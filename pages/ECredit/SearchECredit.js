const { I } = inject()

class SearchECredit {
  #externalApplicationsTab = '//*[@data-index="4"]//*[text()="ВНЕШНИЕ ЗАЯВКИ"]'
  //#externalApplicationsTab = '//*[@class="tab-head-wrapper "]//*[@data-index="4"]//*[text()="ВНЕШНИЕ ЗАЯВКИ"]'
  #checkboxAcceptance = '//*[@data-control-name="ф_Акцепт_ДПА"]//*[@class="checkbox"]'
  #applicationNumber = reqID => {
    return `//*[@class="ui-table-wrapper"]//*[text()="${reqID}"]`
  }
  #confirmAcceptance =
    '//*[@data-control-name="Всплывающее_окно_Акцепт"]//*[@data-control-name="Кнопка_Подтвердить"]//*[@class="ui-button-text ui-button-in-line"]'
  #searchByReqID = '//*[@data-control-name="Поиск_по_ReqID"]//input'
  #searchByReqIDButton = '//*[@data-control-name="Кнопка_поиск_по_ReqID"]//*[@class="ui-button-text ui-button-in-line"]'

  /**
   * Поиск внешней заявки на вкладке "Внешние заявки"
   * @param {object} credit - объект с тестовыми данными кредита
   */
  async choseApplication(credit) {
    I.waitForText('Параметры поиска', 15)
    await I.cClick(this.#externalApplicationsTab)
    if (
      credit.idSystem !== 'eCreditHyundai' &&
      credit.idSystem !== 'eCreditPlatform' &&
      credit.idSystem !== 'ecredit'
    ) {
      await I.cClick(this.#checkboxAcceptance)
      I.waitForVisible(this.#applicationNumber(credit.reqID), 5)
      await I.cDoubleClick(this.#applicationNumber(credit.reqID))
      I.waitForText('Акцепт ДПА', 10)
      await I.cClick(this.#confirmAcceptance)
      I.wait(2)
      await I.cClick(this.#checkboxAcceptance)
      I.wait(2)
    }
    await I.cFillField(this.#searchByReqID, credit.reqID)
    I.wait(2)
    await I.cDoubleClick(this.#searchByReqIDButton)
    I.waitForVisible(this.#applicationNumber(credit.reqID), 30)
    await I.cDoubleClick(this.#applicationNumber(credit.reqID))
  }
}

module.exports = SearchECredit
