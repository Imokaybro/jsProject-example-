const { I } = inject()

class CheckApplicationForConsideration {
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #closeAlertWindow =
    '//*[@class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front jq_popup_message error ui-draggable dialog-active"]//*[@class="ui-dialog-titlebar-close"]'
  #documentQuestionnaire = "//div[text()='Анкета_заемщика']/..//*[@class='attach-button']"
  #documentIndividualConditions = "//div[text()='Индивидуальные_условия']/..//*[@class='attach-button']"
  #documentPassport = "//div[text()='Паспорт']/..//*[@class='attach-button']"

  /**
   * Проверка сканов на этапе "Заявка на выдачу кредитных карт"
   */
  async checkScanForCreditCard() {
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForText('Подкрепите скан Анкеты заемщика', 5)
    await I.cClick(this.#closeAlertWindow)
    await I.scanDocumentLoad(this.#documentQuestionnaire)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForText('Подкрепите скан Паспорта', 5)
    await I.cClick(this.#closeAlertWindow)
    await I.scanDocumentLoad(this.#documentPassport)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForText('Подкрепите скан Индивидуальных условий', 5)
    await I.cClick(this.#closeAlertWindow)
    await I.scanDocumentLoad(this.#documentIndividualConditions)
  }
}

module.exports = CheckApplicationForConsideration
