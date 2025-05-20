const { I } = inject()

class CheckFullQuestionnaire {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #maritalStatus = '//span[text()="Замужем / Женат"]/..//*[@class="radiobutton"]'
  #spouseBlock = '//*[@data-control-name="Семейное_положение_1"]'
  #spousePhone = `//*[@data-control-name="Супруга"]${this.#input('Поле_ввода_с_шаблоном_Телефон')}`
  #oldPassportBlock = '//*[@data-control-name="Старый_паспорт"]'
  #secondDocumentDate = () => {
    return `//*[@data-control-name="Другой_документ"]${this.#input('Дата_выдачи_1')}`
  }

  /**
   * Метод негативных проверок на полной анкете
   * @param {Object} client - объект с данными клиента
   */
  async negativeCheck(client) {
    await this.checkSpouseBlock(client)
    await this.checkOldPassport(client)
    await this.checkOldFIO()
    await this.checkOtherPersonalInfo()
    await this.checkSecondDocument()
    await this.checkIncome()
  }

  /**
   * Проверка блока Семейное положение
   * @param {Object} client - объект с данными клиента
   */
  async checkSpouseBlock(client) {
    await I.cClick(this.#button('Кнопка_2'))
    I.waitForVisible('//*[@data-control-name="Семейное_положение_1"]//*[text()="Выберите вариант"]', 5)
    await I.cClick(this.#maritalStatus)
    await I.cFillField(this.#input('Поле_ввода_Фамилия'), client.spouse.surname)
    await I.cFillField(this.#input('Поле_ввода_Имя'), client.spouse.firstName)
    await I.cFillField(`${this.#spouseBlock}${this.#input('Дата_Дата_рождения')}`, client.spouse.dateOfBirth)
    await I.checkTemplateFieldMandatory(this.#input('Поле_ввода_Фамилия'), 'Введен недопустимый символ')
    await I.checkTemplateFieldMandatory(this.#input('Поле_ввода_Имя'), 'Введен недопустимый символ')
    await I.checkTemplateFieldMandatory(`${this.#spouseBlock}${this.#input('Дата_Дата_рождения')}`, 'Введите дату')
    await I.checkTemplateFieldMandatory(this.#spousePhone)
  }

  /**
   * Проверка блока Старый паспорт
   * @param {Object} client - объект с данными клиента
   */
  async checkOldPassport(client) {
    await I.checkTemplateFieldMandatory(`${this.#oldPassportBlock}${this.#input('Серия_документа')}`)
    await I.checkTemplateFieldMandatory(`${this.#oldPassportBlock}${this.#input('Номер_документа')}`)
    await I.checkTemplateFieldMandatory(`${this.#oldPassportBlock}${this.#input('Дата_выдачи_1')}`, 'Введите дату')
    await I.checkTemplateFieldMandatory(
      `${this.#oldPassportBlock}${this.#input('Код')}`,
      'Код подразделения должен содержать 2 части по 3 цифры в каждой.',
    )
    await I.cClearField(`${this.#oldPassportBlock}${this.#input('Серия_документа')}`)
    await I.cClearField(`${this.#oldPassportBlock}${this.#input('Номер_документа')}`)
    await I.cClearField(`${this.#oldPassportBlock}${this.#input('Дата_выдачи_1')}`)
    await I.cClearField(`${this.#oldPassportBlock}${this.#input('Код')}`)
    await I.cClick(this.#button('Кнопка_2'))
    I.waitForVisible('//*[@class="validatingErrors"]//*[text()="Чтобы продолжить, введите важные данные"]', 5)
    I.waitForVisible('//*[@class="validatingErrors"]//*[text()="Полей осталось: 4"]', 5)
    await I.cFillField(`${this.#oldPassportBlock}${this.#input('Серия_документа')}`, client.oldPassport.serial)
    await I.cFillField(`${this.#oldPassportBlock}${this.#input('Номер_документа')}`, client.oldPassport.number)
    await I.cFillField(`${this.#oldPassportBlock}${this.#input('Дата_выдачи_1')}`, client.oldPassport.dateOfIssue)
    await I.cFillField(`${this.#oldPassportBlock}${this.#input('Код')}`, client.oldPassport.divisionCode)
  }

  /**
   * Проверка блока Данные о смене ФИО
   */
  async checkOldFIO() {
    await I.checkTemplateFieldMandatory(this.#input('Причина_изменения'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(
      this.#input('Дата_смены'),
      'Дата смены ФИО не может быть позже даты выдачи паспорта',
    )
  }

  /**
   * Проверка Блок Жилищные условия, образование, социальный статус, иждивенцы
   */
  async checkOtherPersonalInfo() {
    await I.checkTemplateFieldMandatory(this.#input('Фактическое_проживание_'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Образование_'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Соц_статус_клиента'), 'Выберите значение')
  }

  /**
   * Проверка Блок второй документ
   */
  async checkSecondDocument() {
    await I.checkDate(
      this.#secondDocumentDate(),
      '01.01.1900',
      '01.01.3000',
      'Дата не может быть раньше даты рождения',
      'Дата должна быть не больше текущей',
    )
  }

  /**
   * Проверка полей доход у работающего пенсионера
   */
  async checkIncome() {
    await I.checkTemplateFieldMandatory(this.#input('Основной'), 'Введите число больше нуля')
    await I.checkTemplateFieldMandatory(this.#input('Сумма_1'))
  }
}
module.exports = CheckFullQuestionnaire
