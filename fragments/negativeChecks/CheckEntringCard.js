const { I } = inject()

class CheckEnteringCard {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #numberCardHALVA =
    '//*[@data-control-name="Поле_ввода_с_шаблоном_Номер_карты" or @data-control-name="Номер_Халва_маск"]//input'
  #termCardHALVA =
    '//*[@data-control-name="Поле_ввода_с_шаблоном_Срок_действия" or @data-control-name="Срок_Халва"]//input'
  /**
   * Негативные проверки этапа "Параметры сделки" форма ввода данных карт
   * @param {string} cardNumberZK - номер карты Золотой Ключ
   * @param {string} cardNumberHalva - номер карты Халва
   */
  async checkCardField(cardNumberHalva) {
    await I.checkTemplateFieldMandatory(this.#numberCardHALVA, undefined, cardNumberHalva)
    I.wait(1)
    await I.checkTemplateFieldMandatory(this.#termCardHALVA)
    await I.checkingTransition(this.#numberCardHALVA, this.#button('Кнопка_2'), cardNumberHalva)
    await I.checkingTransition(this.#termCardHALVA, this.#button('Кнопка_2'))
  }
}

module.exports = CheckEnteringCard
