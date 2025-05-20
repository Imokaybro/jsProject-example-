const { I } = inject()

class CheckRegistrationOfCollateral {
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #closeAlertWindow =
    '//*[@class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front jq_popup_message error ui-draggable dialog-active"]//*[@class="ui-dialog-titlebar-close"]'
  #insuranceFees = '//div[text()="Заявление на списание платы за страхование"]/..//*[@class="attach-button"]'
  /**
   * Дополнительные проверки на этапе Регистрация залога
   */
  async advancedCheck() {
    await I.cClick(this.#button('Кнопка_Далее'))
    I.waitForText('Вложите подписанное клиентом "Заявление на списание платы за страхование" в соответствующий слот', 5)
    await I.cClick(this.#closeAlertWindow)
    await I.scanDocumentLoad(this.#insuranceFees)
    await I.cClick(this.#button('Кнопка_Далее'))
    I.waitForText(
      'Вложите подписанное клиентом "Заявление о предоставлении кредита автокредита" в соответствующий слот',
      5,
    )
    await I.cClick(this.#closeAlertWindow)
    await I.scanDocumentLoad(
      "//div[text()='Заявление о предоставлении кредита автокредита']/..//*[@class='attach-button']",
    )
    await I.cClick(this.#button('Кнопка_Отказ'))
    await I.cClick(this.#button('Удалить'))
  }
}

module.exports = CheckRegistrationOfCollateral
