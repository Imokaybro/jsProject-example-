const { I } = inject()

class CheckBorrowersAssessment {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }

  /**
   * Проверки на этапе Оценка заемщика для кредитных карт
   */
  async forCreditCard() {
    await I.checkTemplateFieldMandatory(this.#input('Сумма_кредита'), 'Сумма кредита должна быть больше нуля')
    await I.cFillField(this.#input('Сумма_кредита'), '11111111111')
    await I.lossOfFocus()
    I.waitForText('Превышение максимально допустимой длины 10 символов', 5)
    await I.cFillField(this.#input('Сумма_кредита'), '100000')
    await I.checkTemplateFieldMandatory(this.#input('Срок_кредита'), 'Срок кредита должен быть больше нуля')
    await I.cFillField(this.#input('Срок_кредита'), '121')
    await I.lossOfFocus()
    I.waitForText('Превышен максимальный срок', 5)
    await I.cFillField(this.#input('Срок_кредита'), '120')
    await I.checkTemplateFieldMandatory(this.#input('Решение_по_заявке'), 'Выберите значение')
    await I.checkingTransition(this.#input('Сумма_кредита'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Срок_кредита'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Решение_по_заявке'), this.#button('Кнопка_Запрос'))
  }
  /**
   * Проверки на этапе Оценка заемщика для товарного кредита
   */
  async forCommodityCredit() {
    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_РО'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Сумма_кредита'), 'Сумма кредита должна быть больше нуля')
    await I.cFillField(this.#input('Сумма_кредита'), '11111111111')
    await I.lossOfFocus()
    I.waitForText('Превышение максимально допустимой длины 10 символов', 5)
    await I.cFillField(this.#input('Сумма_кредита'), '100000')
    await I.checkTemplateFieldMandatory(this.#input('Срок_кредита'), 'Срок кредита должен быть больше нуля')
    await I.cFillField(this.#input('Срок_кредита'), '121')
    await I.lossOfFocus()
    I.waitForText('Превышен максимальный срок', 5)
    await I.cFillField(this.#input('Срок_кредита'), '120')
    await I.checkTemplateFieldMandatory(this.#input('Решение_по_заявке'), 'Выберите значение')
    await I.checkingTransition(this.#input('Раскрывающийся_список_РО'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Сумма_кредита'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Срок_кредита'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Решение_по_заявке'), this.#button('Кнопка_Запрос'))
  }

  /**
   * Проверки на этапе Оценка заемщика для КНПА
   */
  async forKNPA() {
    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_РО'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Стоимость_товара'), 'Сумма должна быть больше нуля.')
    await I.cFillField(this.#input('Стоимость_товара'), '11111111111')
    await I.lossOfFocus()
    I.waitForText('Превышение максимально допустимой длины 10 символов', 5)
    await I.cFillField(this.#input('Стоимость_товара'), '1000000')
    await I.cFillField(this.#input('Оплачено_в_кассу'), '1000001')
    await I.lossOfFocus()
    I.waitForText('ПВ не может быть больше стоимости товара', 5)
    I.waitForText('Сумма кредита должна быть больше нуля', 5)
    await I.cFillField(this.#input('Оплачено_в_кассу'), '1000')
    await I.checkTemplateFieldMandatory(this.#input('Срок_кредита'), 'Срок кредита должен быть больше нуля')
    await I.cFillField(this.#input('Срок_кредита'), '121')
    await I.lossOfFocus()
    I.waitForText('Превышен максимальный срок', 5)
    await I.cFillField(this.#input('Срок_кредита'), '120')
    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_2'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Раскрывающийся_список_3'), 'Выберите значение')
    await I.checkTemplateFieldMandatory(this.#input('Решение_по_заявке'), 'Выберите значение')
    await I.checkingTransition(this.#input('Раскрывающийся_список_РО'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Стоимость_товара'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Срок_кредита'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Раскрывающийся_список_2'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Раскрывающийся_список_3'), this.#button('Кнопка_Запрос'))
    await I.checkingTransition(this.#input('Решение_по_заявке'), this.#button('Кнопка_Запрос'))
  }
}

module.exports = CheckBorrowersAssessment
