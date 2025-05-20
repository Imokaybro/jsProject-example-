const { WindowForCreatingOrganization } = require('../fragments/ARMAdministration/WindowForCreatingOrganization')

const { I } = inject()

class WorkingWithOrganizationalStructure {
  constructor() {
    const tabLocate = '//*[@data-control-name="Tabs.Организации"]'
    const organizationInfoLocate = `//*[@data-control-name="Рамка_просмотр_звена"]`

    this.add = `${tabLocate}//*[@data-control-name="Создать"]//*[@class="ui-button-text ui-button-in-line"]`
    this.deletedOrganization = `${tabLocate}//*[@data-control-name="Флажок_Удаленные"]//*[@class="checkbox"]`
    this.carDealership = `${tabLocate}//*[@data-control-name="ф_Автосалоны"]//*[@class="checkbox"]`
    this.bankOffice = `${tabLocate}//*[@data-control-name="ф_Офисы"]//*[@class="checkbox"]`
    this.organizationSearch = `${tabLocate}//*[@data-control-name="Поле_поиска_организации"]//input`
    this.organizationSerchForID = `${tabLocate}//*[@data-control-name="Поле_поиска_по_ИД"]//input`
    this.clear = `${tabLocate}//*[@data-control-name="Кнопка_очистить"]//*[@class="ui-button-text ui-button-in-line"]`
    this.search = `${tabLocate}//*[@data-control-name="Кнопка_найти"]//*[@class="ui-button-text ui-button-in-line"]`
    this.external = `${organizationInfoLocate}//*[@data-control-name="Внешнее"]//*[@class="checkbox"]`
    this.office = `${organizationInfoLocate}//*[@data-control-name="ф_Офис"]//*[@class="checkbox"]`
    this.pep = `${organizationInfoLocate}//*[@data-control-name="Флажок_Досптупен_ПЭП"]//*[@class="checkbox"]`
    this.blocked = `${organizationInfoLocate}//*[@data-control-name="Заблокированно"]//*[@class="checkbox"]`
    this.changeParent = `${organizationInfoLocate}//*[@data-control-name="Кнопка_сменить_родительское_звено"]//*[@class="ui-button-text ui-button-in-line"]`
    this.clearParent = `${organizationInfoLocate}//*[@data-control-name="Кнопка_очистить_родителя"]//*[@class="ui-button-text ui-button-in-line"]`
    this.name = `${organizationInfoLocate}//*[@data-control-name="Название"]//input`
    this.address = `${organizationInfoLocate}//*[@data-control-name="Поле_ввода_Адрес"]//input`
    this.type = `${organizationInfoLocate}//*[@data-control-name="Тип"]//input`
    this.regionCode = `${organizationInfoLocate}//*[@data-control-name="Поле_ввода_Код_региона"]//input`
    this.businessLine = `${organizationInfoLocate}//*[@data-control-name="Бизнес_линия"]//input`
    this.accountNumber = `${organizationInfoLocate}//*[@data-control-name="Поле_Счет_получателя"]//input`
    this.comment = `${organizationInfoLocate}//*[@data-control-name="Многострочное_поле_ввода_1"]//textarea`
    this.transitAccount = `${organizationInfoLocate}//*[@data-control-name="Поле_Транзитный_счет"]//input`
    this.correspondentAccount = `${organizationInfoLocate}//*[@data-control-name="Поле_коор_счет"]//input`
    this.codeRBS = `${organizationInfoLocate}//*[@data-control-name="Код_в_АБС"]//input`
    this.city = `${organizationInfoLocate}//*[@data-control-name="Поле_ввода_Город"]//input`
    this.weborCode = `${organizationInfoLocate}//*[@data-control-name="Код_webor"]//input`
    this.inn = `${organizationInfoLocate}//*[@data-control-name="Поле_ИНН"]//input`
    this.searchParams = `${organizationInfoLocate}//*[@data-control-name="Флажок_Параметры_поиска_опциональны"]//*[@class="checkbox"]`
    this.scanner = `${organizationInfoLocate}//*[@data-control-name="Флажок_Доступен_сканер"]//*[@class="checkbox"]`
    this.rca = `${organizationInfoLocate}//*[@data-control-name="Флажок_Является_РЦА"]//*[@class="checkbox"]`
    this.bic = `${organizationInfoLocate}//*[@data-control-name="Поле_БИК"]//input`
    this.rcaField = `${organizationInfoLocate}//*[@data-control-name="РЦА"]//input`
    this.ruleRegistration = `${organizationInfoLocate}//*[@data-control-name="Правило_оформления_оценки_залога"]//input`
    this.preficsRuleRegistration = `${organizationInfoLocate}//*[@data-control-name="Префикс_оценки_залога_1"]//input`
    this.smsInfoTariff = `${organizationInfoLocate}//*[@data-control-name="Список_с_множественным_выбором_1_смс_инфо"]//input`
    this.smsInfoDefault = `${organizationInfoLocate}//*[@data-control-name="СМС_по_умолчанию"]//input`
    this.urlRequest = `${organizationInfoLocate}//*[@data-control-name="Поле_ввода_2"]//input`
    this.urlResponse = `${organizationInfoLocate}//*[@data-control-name="Поле_ввода_1"]//input`
    this.removeOrganization = `${organizationInfoLocate}//*[@data-control-name="Удалить"]//*[@class="ui-button-text ui-button-in-line"]`
    this.reasonDeleteOrganization =
      '//*[@data-control-name="Окно_удаления_организации"]//*[@data-control-name="пв_Причина_удаления"]//input'
    this.confirmDeleteOrganization =
      '//*[@data-control-name="Окно_удаления_организации"]//*[@data-control-name="Удалить"]//*[@class="ui-button-text ui-button-in-line"]'
  }

  /**
   * Метод добавления организации
   * @param {Object} organizationData - объект с данными организации
   */
  async addOrganization(organizationData) {
    await I.cClick(this.add)
    await new WindowForCreatingOrganization().fillOrganization(organizationData)
  }

  /**
   * Метод поиска организации
   * @param {Object} organizationData - объект с данными организации
   */
  async searchOrganizationName(organizationData) {
    await I.cClick(this.clear)
    await I.cFillField(this.organizationSearch, organizationData.name)
    await I.cClick(this.search)
    I.waitForVisible(`//*[@class="tree-view-container"]//*[text()="${organizationData.name}"]`, 30)
    await I.cClick(`//*[@class="tree-view-container"]//*[text()="${organizationData.name}"]`)
  }

  /**
   * Метод поиска организации по ID
   * @param {Object} organizationData - объект с данными организации
   */
  async searchOrganizationID(organizationData) {
    await I.cClick(this.clear)
    await I.cFillField(this.organizationSerchForID, organizationData.id)
    await I.cClick(this.search)
    I.waitForVisible(`//*[@class="tree-view-container"]//*[text()="${organizationData.name}"]`, 30)
    await I.cClick(`//*[@class="tree-view-container"]//*[text()="${organizationData.name}"]`)
  }

  /**
   * Проверка сохранения организации(сравнение всех ранее заполненных параметров)
   * @param {Object} organizationData - объект с данными организации
   */
  async checkOrganizationData(organizationData) {
    I.wait(15)
    let grabData = await this.grabOrganizationData()

    await this.compare(grabData.name, organizationData.name)
    await this.compare(grabData.address, organizationData.address)
    await this.compare(grabData.type, organizationData.type)
    await this.compare(grabData.regionCode, organizationData.regionCode)
    await this.compare(grabData.businessLine, organizationData.businessLine)
    await this.compare(grabData.codeRBS, organizationData.codeRBS)
    await this.compare(grabData.ruleRegistration, organizationData.ruleRegistration)
    await this.compare(grabData.preficsRuleRegistration, organizationData.preficsRuleRegistration)
  }

  /**
   * Метод сравнения строк
   * @param {String} value1 - первая строка для сравнения
   * @param {String} value2 - вторая строка для сравнения
   */
  async compare(value1, value2) {
    if (value1 !== value2) {
      throw new Error('Ошибка сравнения')
    }
  }

  /**
   * Получение ID организации(grab)
   * @param {Object} organizationData - объект с данными организации
   */
  async grabOrganizationID(organizationData) {
    await this.searchOrganizationName(organizationData)
    let organizationInfo = await I.grabTextFrom(
      '//*[@data-control-name="Рамка_просмотр_звена"]//*[@class="jq-panel-header-text-default "]',
    )
    organizationInfo = organizationInfo.split('идент. ')
    organizationInfo = organizationInfo[1].slice(0, -1)
    organizationData.id = organizationInfo
  }

  /**
   * Заполнение и проверка сохранения организации
   * @param {Object} organizationData - объект с данными организации
   */
  async fillAndCheckOrganization(organizationData) {
    await this.addOrganization(organizationData)
    await this.searchOrganizationName(organizationData)
    await this.checkOrganizationData(organizationData)
  }

  /**
   * Метод сбора данных организации(grab)
   * @returns возвращает объект с данными организации
   */
  async grabOrganizationData() {
    let grabData = {}
    grabData.name = await I.grabValueFrom(this.name)
    grabData.address = await I.grabValueFrom(this.address)
    grabData.type = await I.grabValueFrom(this.type)
    grabData.regionCode = await I.grabValueFrom(this.regionCode)
    grabData.businessLine = await I.grabValueFrom(this.businessLine)
    grabData.codeRBS = await I.grabValueFrom(this.codeRBS)
    grabData.ruleRegistration = await I.grabValueFrom(this.ruleRegistration)
    grabData.preficsRuleRegistration = await I.grabValueFrom(this.preficsRuleRegistration)
    return grabData
  }

  /**
   * Метод удаления организации
   * @param {Object} organizationData - объект с данными организации
   */
  async deleteOrganization(organizationData) {
    await this.searchOrganizationName(organizationData)
    I.wait(15)
    await I.cClick(this.removeOrganization)
    I.waitForText(`Внимание! При удалении звена ${organizationData.name} будут также удалены его дочерние звенья`, 10)
    await I.cFillField(this.reasonDeleteOrganization, 'Тестирование')
    await I.cClick(this.confirmDeleteOrganization)
  }

  /**
   * Метод проверки удаления организации
   * @param {Object} organizationData - объект с данными организации
   */
  async checkDeletedOrganization(organizationData) {
    I.wait(10)
    await I.cClick(this.deletedOrganization)
    await this.searchOrganizationID(organizationData)
  }
}

module.exports = { WorkingWithOrganizationalStructure }
