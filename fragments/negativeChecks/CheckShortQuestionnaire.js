const { I } = inject()

class CheckShortQuestionnaire {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #list = name => {
    return `//*[@data-control-name="${name}"]//*[@class="dropdown-trigger unselectable"]`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #closeNotification =
    '//*[@class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front jq_popup_message message ui-draggable dialog-active"]//*[@class="ui-dialog-titlebar-close"]'
  #checkboxIPDL = '//*[contains (text(), "Клиент является иностранным")]/..//*[@class="checkbox"]'
  #buttonHorizontalGroup = '//*[@class="element group horizontal-group __cell-noflex__"]'
  #nextToPFKA = `${this.#buttonHorizontalGroup}${this.#button('Кнопка_1')}`
  #nextToZV = `${this.#buttonHorizontalGroup}${this.#button('Кнопка_Договор')}`
  #checkboxMatchingAddresses = '//*[@data-control-name="Совпадение_адресов"]//*[@class="checkbox"]'

  /**
   * Негативные проверки этапа "Короткая анкета"
   */
  async negativeCheck(client) {
    await this.checkFIO(client)
    await this.checkDocuments(client)
    await this.checkRegAddress(client)
    await this.checkActualAddress(client)
    await this.checkContactInformation()
    await I.checkTemplateFieldMandatory(this.#input('Доход_предварительная_анкета_1'), 'Введите число больше нуля')
    await this.checkIDPL()
  }
  /**
   * Дополнительные негативные проверки этапа "Короткая анкета"
   */
  async negativeAdditionalCheck(client) {
    await I.cFillField(this.#input('Поле_ввода_Место_рождения'), client.placeOfBirth)
    await I.cClick(this.#nextToPFKA)
    I.waitForVisible('//*[@data-control-name="Персональня_информация"]//*[text()="Выберите вариант"]', 5)
    I.waitForVisible('//*[@data-control-name="Персональня_информация"]//*[text()="Выберите значение"]', 5)
  }

  /**
   * Проверка блока ФИО
   */
  async checkFIO(client) {
    await I.checkFieldMandatory(this.#input('Валидируемое_поле_ввода_Фамилия'), 'Поле Фамилия не может быть пустым')
    await I.checkFieldMandatory(this.#input('Валидируемое_поле_ввода_Имя'), 'Поле Имя не может быть пустым')
    await I.patronymicGenderCheck(client, this.#input('Валидируемое_поле_ввода_Отчество'))
    await I.checkFieldMandatory(this.#input('Поле_ввода_Место_рождения'), 'Обязательно к заполнению')
    await I.checkTemplateFieldMandatory(this.#input('Дата_Дата_рождения'), 'Некорректная дата рождения')
    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_страна_рождения'), 'Выберите значение')
  }

  /**
   * Проверка блока документы
   */
  async checkDocuments(client) {
    const todayDate = new Date().toLocaleString('ru').split(',')[0]
    await I.checkTemplateFieldMandatory(this.#input('Серия_документа'), 'Длина поля серия паспорта должна быть 4 числа')
    await I.checkTemplateFieldMandatory(this.#input('Номер_документа'), 'Длина поля номер паспорта должна быть 6 чисел')
    await I.checkTemplateFieldMandatory(
      this.#input('Код'),
      'Код подразделения должен содержать 2 части по 3 цифры в каждой.',
    )
    await I.checkTemplateFieldMandatory(
      this.#input('Дата_выдачи_1'),
      'Дата должна быть позднее или равна дате рождения субъекта плюс 13 лет',
    )
    //await I.checkTemplateFieldMandatory(this.#input('Кем_выдан'), 'Выберите значение')
    //Проверка действия паспорта по истечению срока годности(20 и 45 лет)
    await I.passportExpiry(this.#input('Дата_выдачи_1'), client.dateOfBirth, 20)
    await I.passportExpiry(this.#input('Дата_выдачи_1'), client.dateOfBirth, 45)
    //Проверка даты выдачи карты (до даты рождения и после сегодняшнего дня)
    await I.checkDate(
      this.#input('Дата_выдачи_1'),
      client.dateOfBirth,
      todayDate,
      'Дата не может быть раньше даты рождения',
      'Дата должна быть не больше текущей',
    )
    I.wait(1)
    await I.cFillField(this.#input('Дата_выдачи_1'), client.passport.dateOfIssue)
    await I.cFillField(this.#input('Номер_документа'), client.passport.number)
  }

  /**
   *Проверка адреса регистрации
   */
  async checkRegAddress(client) {
    const todayDate = new Date().toLocaleString('ru').split(',')[0]
    await I.checkTemplateFieldMandatory(this.#input('Дата_регистрации'), 'Введите дату')
    await I.checkDate(
      this.#input('Дата_регистрации'),
      client.dateOfBirth,
      todayDate,
      'Дата регистрации не может быть меньше даты рождения',
      'Дата регистрации должна быть не больше текущей',
    )
  }

  /**
   *Проверка адреса регистрации GAR
   */
  async checkRegistrationAddressGAR() {
    await I.cCheckOption(this.#checkboxMatchingAddresses)
    await I.cClick(this.#button('Кнопка_2'))
    I.waitForText('Проверьте правильность адресов или подтверждение для ИПДЛ', 5)
    I.pressKey('Escape')
  }
  /**
   * Проверка блока Актуальный адрес
   * @param {Object} client - объект с данными клиента
   */
  async checkActualAddress(client) {
    const todayDate = new Date().toLocaleString('ru').split(',')[0]
    if (
      // проверка на одинаковость адресов фактического проживания и регистрации
      JSON.stringify(client.address.addressOfResidence) !== JSON.stringify(client.address.addressOfRegistration)
    ) {
      await I.checkTemplateFieldMandatory(this.#input('Дата_начала_проживания'), 'Введите дату')
      await I.checkDate(
        this.#input('Дата_начала_проживания'),
        client.dateOfBirth,
        todayDate,
        'Дата начала проживания ',
        'Дата проживания должна быть не больше текущей',
      )
    }
  }

  /**
   * Проверка блока контактной информации
   */
  async checkContactInformation() {
    await I.checkTemplateFieldMandatory(this.#input('Мобильный_Телефон'))
    //Проверка подтверждении номера
    await I.lossOfFocus()
    await I.cClickList(this.#list('Основной_тел_список_неподтв'), '<не выбрано>')
    I.wait(1)
    await I.cClick(this.#button('Основной_тел_отправить_смс'))
    await I.cClick(this.#closeNotification)
    await I.checkFieldMandatory(this.#input('Основной_тел_поле_ввода_кода'))
    await I.cClick(this.#button('Основной_тел_отправить_смс'))
    I.wait(1)
    await I.postToUdmConsole('Кредит.Заявка.Проверка_мобильного.Проверочный_код')
    let phoneSmsCode = await I.getFromUdmConsole()
    await I.cFillField(this.#input('Основной_тел_поле_ввода_кода'), phoneSmsCode)
  }

  /**
   * Проверка клиента на ИДПЛ
   */
  async checkIDPL() {
    await I.cClick(this.#checkboxIPDL)
    await I.cClick(this.#nextToPFKA)
    I.waitForVisible(this.#nextToZV, 30)
    await I.cClick(this.#nextToZV)
    I.waitForText(
      'Клиенту необходимо обратиться в отделение Банка для заполнения анкеты и/или формы самосертификации по установленной Банком форме',
      5,
    )
    await I.cClick(this.#button('Кнопка_Возврат_на_анкету'))
  }
}
module.exports = CheckShortQuestionnaire
