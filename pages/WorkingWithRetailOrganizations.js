const { WindowCreatingRetailOrganization } = require('../fragments/ARMAdministration/WindowCreatingRetailOrganization')

const { I } = inject()

class WorkingWithRetailOrganizations {
  constructor() {
    const tabLocate = '//*[@data-control-name="Работа_с_розничными_организациями_1"]'
    const button = '//*[@class="ui-button-text ui-button-in-line"]'

    this.addNewOrganization = `${tabLocate}//*[@data-control-name="Кнопка_Создать"]${button}`
    this.searchByName = `//*[@data-control-name="Поле_поиска_розничной"]//input`
    this.search = `${tabLocate}//*[@data-control-name="Кнопка_найти"]${button}`

    const tableRequisites = '//*[@data-control-name="Таблица_БанкоDELETEDие_реквизиты"]'

    this.addRequisitesFromTable = `${tabLocate}${tableRequisites}//*[@data-name="Добавить"]`
    this.changeRequisitesFromTable = `${tabLocate}${tableRequisites}//*[@data-name="Просмотр"]`
    this.deleteRequisitesFromTable = `${tabLocate}${tableRequisites}//*[@data-name="Удалить"]`

    const windowAddRequisites = '//*[@data-control-name="Окно_создания_реквизита"]'

    this.bik = `${windowAddRequisites}//*[@data-control-name="Поле_ввода_бик_банка"]//input`
    this.recipient = `${windowAddRequisites}//*[@data-control-name="Поле_ввода_получатель"]//input`
    this.account = `${windowAddRequisites}//*[@data-control-name="Поле_ввода_счет_получателя"]//input`
    this.save = `${windowAddRequisites}//*[@data-control-name="Сохранить"]${button}`

    this.confirmDelete =
      '//*[@class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front tooltip-area tooltip-anchor ui-draggable dialog-active"]//*[@data-control-name="Окно_удаления_Реквизита"]//*[@data-control-name="Удалить"]${button}'

    this.deleteOrganizationButton = `//*[@data-control-name="Рамка_Информация_РО"]//*[@data-control-name="Кнопка_Удалить"]${button}`
    this.confirmDeleteOrganization = `//*[@data-control-name="Всплывющее_окно_Удаление"]//*[@data-control-name="Удалить"]${button}`
  }

  /**
   * Создание розничной организации
   * @param {Object} organization - объект с данными организации
   */
  async addNewRetailOrganization(organization) {
    await I.cClick(this.addNewOrganization)
    I.waitForText('Создание розничной организации', 10)
    await new WindowCreatingRetailOrganization().fillData(organization)
  }

  /**
   * Поиск организации
   * @param {Object} organization - объект с данными организации
   */
  async searchOrganization(organization) {
    await I.cFillField(this.searchByName, organization.name)
    await I.cClick(this.search)
    await I.cClick(`//*[@data-control-name="Таблица_Розничные_организации"]//*[text()="${organization.name}"]`)
  }

  /**
   * Добавление реквизитов розничной организации
   * @param {Object} organization - объект с данными организации
   */
  async addRequisites(organization) {
    await I.cClick(this.addRequisitesFromTable)
    I.waitForText('Добавление Реквизита', 10)
    I.wait(2)
    await I.cClickFillList(this.bik, organization.bik)
    await I.cFillField(this.recipient, organization.recipient)
    await I.cFillField(this.account, organization.account)
    await I.cClick(this.save)
  }

  /**
   * Изменение реквизитов розничной организации
   * @param {Object} organization - объект с данными организации
   */
  async changeRequisites(organization) {
    await I.cClick(`//*[@data-control-name="Таблица_БанкоDELETEDие_реквизиты"]//*[text()="${organization.bik}"]`)
    await I.cClick(this.changeRequisitesFromTable)
    await I.cFillField(this.account, '12345678901234567890')
    await I.cClick(this.save)
    I.waitForText('12345678901234567890', 5)
  }

  /**
   * Удаление реквизитов розничной организации
   * @param {Object} organization - объект с данными организации
   */
  async deleteRequisites(organization) {
    await I.cClick(`//*[@data-control-name="Таблица_БанкоDELETEDие_реквизиты"]//*[text()="${organization.bik}"]`)
    await I.cClick(this.deleteRequisitesFromTable)
    I.waitForText('Вы действительно хотите удалить реквизит?', 5)
    await I.cClick(this.confirmDelete)
    I.wait(2)
    let checkDelete = await tryTo(() =>
      I.cClick(`//*[@data-control-name="Таблица_БанкоDELETEDие_реквизиты"]//*[text()="${organization.bik}"]`, 10),
    )
    if (checkDelete) {
      throw new Error('Реквизиты не были удалены')
    }
  }

  /**
   * Удаление розничной организации
   * @param {Object} organization - объект с данными организации
   */
  async deleteOrganization(organization) {
    await this.searchOrganization(organization)
    await I.cClick(this.deleteOrganizationButton)
    I.waitForText('Вы действительно хотите удалить розничную организацию?', 10)
    await I.cClick(this.confirmDeleteOrganization)
  }
}

module.exports = { WorkingWithRetailOrganizations }
