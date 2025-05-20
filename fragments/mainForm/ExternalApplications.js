const { I } = inject()

class ExternalApplications {
  #externalApplicationsTab = '//*[text()="ВНЕШНИЕ ЗАЯВКИ"]'
  //#externalApplicationsTab = '//*[@class="tab-head-wrapper "]//*[text()="ВНЕШНИЕ ЗАЯВКИ"]'
  #checkboxAcceptance = '//*[@data-control-name="ф_Акцепт_ДПА"]//*[@class="checkbox"]'
  #findAppNumber = reqID => `//*[@class="ui-table-wrapper"]//*[text()="${reqID}"]`
  #confirm = '//*[@data-control-name="Кнопка_Подтвердить"]//*[@class="ui-button-text ui-button-in-line"]'
  #applicationId = '//*[@data-control-name="Поиск_по_ReqID"]//input'
  #searchByReqId = '//*[@data-control-name="Кнопка_поиск_по_ReqID"]//*[@class="ui-button-text ui-button-in-line"]'
  #interceptionWindow = '//*[@role="dialog"]//*[@class="dialog_title_inner"][text()="Перехват внешней заявки"]'
  #interceptionAccept = '//*[@data-control-name="Флажок_подтветрждения"]//*[@class="checkbox"]'
  #interceptionButton = '//*[@data-control-name="Кнопка_зайти_в_заявку"]//*[@class="ui-button-text ui-button-in-line"]'

  //ДЛЯ КОСТЫЛЯ. Удалить после починки процесса
  #processHasBeenReassigned = '//*[@data-control-name="Экран_ожидания_1"]//*[text()="Процесс переназначен"]'
  #dossier = '//*[@data-control-name="Кнопка_В_досье_1"]//*[@class="ui-button-text ui-button-in-line"]'
  #lastCredit = '//*[@data-control-name="Таблица_текущие_кредиты"]//*[@class="cell-inner content-tt-cell"]'

  /**
   * Выбор ранее созданной внешней заявки
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async choseECreditApplication(credit) {
    I.waitForText('Параметры поиска', 15)
    await I.cClick(this.#externalApplicationsTab)
    await this.acceptance(credit)
    await I.cFillField(this.#applicationId, credit.reqID)
    I.wait(2)
    await I.cDoubleClick(this.#searchByReqId)
    I.waitForElement(this.#findAppNumber(credit.reqID), 30)
    await I.cDoubleClick(this.#findAppNumber(credit.reqID))
    await this.checkError()
  }

  /**
   * Простановка акцепта ДПА
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async acceptance(credit) {
    if ([('eCreditHyundai', 'eCreditPlatform', 'ecredit')].includes(credit.idSystem) && credit.needAccept) {
      await I.cClick(this.#checkboxAcceptance)
      I.waitForVisible(this.#findAppNumber(credit.reqID), 5)
      await I.cDoubleClick(this.#findAppNumber(credit.reqID))
      I.waitForText('Акцепт ДПА', 10)
      await I.cClick(this.#confirm)
      await I.cClick(this.#checkboxAcceptance)
    }
  }

  /**
   * КОСТЫЛЬ. Перехват заявки через досье после отображения ошибки "Процесс переназначен"
   */
  async checkError() {
    const interceptionOfExternalApplication = await tryTo(() => I.waitForText('Перехват внешней заявки', 5))
    if (interceptionOfExternalApplication) {
      await I.cClick('//*[@data-control-name="Рамка_перехват_внешней_заявки"]//*[@class="checkbox"]')
      I.wait(1)
      await I.cClick('//*[@data-control-name="Кнопка_зайти_в_заявку"]//*[@class="ui-button-text ui-button-in-line"]')
    }
    const processHasBeenReassigned = await tryTo(() => I.waitForVisible(this.#processHasBeenReassigned, 5))
    if (processHasBeenReassigned) {
      await I.cClick(this.#dossier)
      await I.cDoubleClick(this.#lastCredit)
    }
  }

  /**
   * Подтверждение перехвата заявки
   */
  async acceptInterception() {
    const interceptionOfExternalApplication = await tryTo(() => I.waitForElement(this.#interceptionWindow, 10))
    if (interceptionOfExternalApplication) {
      await I.cCheckOption(this.#interceptionAccept)
      I.wait(1)
      await I.cClick(this.#interceptionButton)
    }
  }
}

module.exports = ExternalApplications
