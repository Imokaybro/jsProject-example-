const { I } = inject()

class CheckConfirmationOfInvoices {
  #input = (context = '', name) => {
    if (context) {
      return `//*[@data-control-name="${context}"]//*[@data-control-name="${name}"]//input`
    }
    return `//*[@data-control-name="${name}"]//input`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  /**
   * Негативные проверки этапа "Параметры сделки"
   */
  async check() {
    await I.checkTemplateFieldMandatory(
      this.#input('Рамка_Оплата_за_автомобиль', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      'Скорректируйте номер или вернитесь на редактирование заявки для корректировки счета',
    )
    await I.checkTemplateFieldMandatory(
      this.#input('Рамка_Оплата_за_КАСКО', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      'Скорректируйте номер или вернитесь на редактирование заявки для корректировки счета',
    )
    await I.checkTemplateFieldMandatory(
      this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_н_валидация'),
      'Скорректируйте номер или вернитесь на редактирование заявки для корректировки VIN',
    )
    await I.checkTemplateFieldMandatory(
      this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_к_валидация'),
      'Скорректируйте номер или вернитесь на редактирование заявки для корректировки VIN',
    )

    await I.checkingTransition(
      this.#input('Рамка_Оплата_за_автомобиль', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      this.#button('Кнопка_замена'),
    )
    await I.checkingTransition(
      this.#input('Рамка_Оплата_за_КАСКО', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      this.#button('Кнопка_замена'),
    )
    await I.checkingTransition(
      this.#input('Рамка_Оплата_за_дополнительные_услуги_партнеров', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      this.#button('Кнопка_замена'),
    )
    await I.checkingTransition(
      this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_н_валидация'),
      this.#button('Кнопка_замена'),
    )
    await I.checkingTransition(
      this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_к_валидация'),
      this.#button('Кнопка_замена'),
    )
  }
}

module.exports = CheckConfirmationOfInvoices
