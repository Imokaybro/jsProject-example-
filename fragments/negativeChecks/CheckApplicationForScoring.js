const { I } = inject()

class CheckApplicationForScoring {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #list = name => {
    return `//*[@data-control-name="${name}"]//*[@class="dropdown-trigger unselectable"]`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #passportBlock = '//*[@data-control-name="Паспорт"]'
  #horizontalBlockButton = '//*[@class="element group horizontal-group __cell-noflex__"]'

  /**
   * Негативные проверки этапа "Заявка на скорринг"
   */
  async negativeChecks() {
    const todayDate = new Date().toLocaleString('ru').split(',')[0]
    let dateOfBirthday = new Date()
    dateOfBirthday.setFullYear(dateOfBirthday.getFullYear() + -30)
    dateOfBirthday = dateOfBirthday.toLocaleString('ru').split(',')[0]

    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_РО'), 'Выберите значение')
    await I.cFillField(this.#input('Оплачено_в_кассу'), '0')
    await I.checkInputDigits(
      this.#input('Стоимость_товара'),
      null,
      null,
      10_000_000,
      'Максимальная сумма кредита 9000000',
    )
    await I.checkInputDigits(
      this.#input('Срок_кредита'),
      1,
      'Срок кредита должен быть больше нуля',
      120,
      'Превышен максимальный срок',
    )
    await I.cClick(this.#button('Кнопка_2'))
    await I.cFillField(this.#input('Дата_Дата_рождения'), dateOfBirthday)
    await I.cFillField(`${this.#passportBlock}${this.#input('Дата_выдачи_1')}`, todayDate)
    await I.cClick(`${this.#horizontalBlockButton}${this.#button('Кнопка_1')}`)
    I.waitForText('Анкета заемщика (предварительная)', 30)
    await I.cClick(`${this.#horizontalBlockButton}${this.#button('Кнопка_Договор')}`)
    await I.cFillField(this.#input('Стоимость_товара'), 1_000_000)
    await I.lossOfFocus()
    await I.cClickList(this.#list('Решение_по_заявке'), 'Одобрено')
    await I.cClick(this.#button('Кнопка_Запрос'))
  }

  /**
   * Дополнительные негативные проверки этапа "Заявка на скорринг"
   */
  async additionalNegativeChecks() {
    await I.cClick(this.#button('Кнопка_Запрос'))
    I.wait(1)
    await I.lossOfFocus()
    I.waitForText('Полей осталось: 9', 5)
    I.waitForVisible('//*[text()="Сумма должна быть больше нуля."]', 5)
    I.waitForVisible('//*[text()="Срок кредита должен быть больше нуля"]', 5)
    I.waitForVisible('//*[text()="Выберите вариант"]', 5)
    I.waitForVisible('//*[text()="Обязательно к заполнению"]', 5)
  }
}

module.exports = CheckApplicationForScoring
