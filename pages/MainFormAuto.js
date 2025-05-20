const SearchParameters = require('../fragments/mainForm/SearchParameters')
const ExternalApplications = require('../fragments/mainForm/ExternalApplications')
const ElementBuilder = require('../helpers/ElementBuilder')
const { I } = inject()

/**
 * Взаимодействия с главной формой
 * FormName: Главная форма (Кредиты_фл.Формы.Главная_форма_метком)
 * @param {Object} credit - объект с тестовыми данными кредита
 *  {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Главная_форма_метком}
 */
class MainFormAuto {
  #element = async (element, type) => {
    const locate = await new ElementBuilder().element(element, type)
    return locate
  }
  #searchResult = '//*[@class="ui-table-rows-even  selected last_selected"]'
  #disabledApplyForCredit = '//*[@data-control-name="Кнопка_Оформить_кредит"]//*[@class="decoration element-disabler"]'
  #goToMainForm =
    '//*[@class="element group-stretch group horizontal-group"]//*[@data-control-name="Кнопка_Назад"]//*[@class="ui-button-text ui-button-in-line"]'
  #tabSearch = '//*[@data-control-name="Tabs.Поиск_клиента"]'
  #inClientDossier = '//*[@data-control-name="Кнопка_В_досье"]//*[@class="ui-button-text ui-button-in-line"]'
  #currentApplication = '(//*[@data-control-name="Таблица_текущие_кредиты"]//*[@class="cell-inner content-tt-cell"])[1]'
  #lastApplicationLocked =
    '//*[@class="element widget widget-ext-grid no-height-by-content cell-fixed-height vcm-locked"]'
  #lastApplication = '//*[@data-control-name="Таблица_Заявки_поиск"]//*[@class="ui-table-wrapper-content"]//tr[1]'
  #tab = nameOfTab => `//*[@class="tab-head-container"]//*[text()="${nameOfTab}"]`

  /**
   * Метод поиска и выбора клиента на главной форме
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async choseClient(client) {
    await this.searchClient(client)
    I.waitForInvisible(this.#disabledApplyForCredit, 15)
    await I.cClick(await this.#element('Кнопка_Оформить_кредит', 'button'))
  }

  /**
   * Поиск клиента на главной форме
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async searchClient(client) {
    I.waitForText('Параметры поиска', 180)
    await I.cSay('----------Осуществлен переход на главную форму"----------')
    await new SearchParameters().fillPageFragment(client)
    await I.cClick(await this.#element('Кнопка_Поиск', 'button'))
    await this.clientAlreadyExist()
  }

  /**
   * Взятие в работу внешней заявки
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async choseECreditApplication(credit) {
    await new ExternalApplications().choseECreditApplication(credit)
  }

  /**
   *Проверка на то, что клиент с такими данными существует
   */
  async clientAlreadyExist() {
    const clientAlreadyExist = await tryTo(() => I.waitForVisible(this.#searchResult, 10))
    if (clientAlreadyExist) {
      await I.cClick(this.#searchResult)
    }
  }

  async openForm() {
    I.waitForVisible(this.#goToMainForm, 10)
    await I.cClick(this.#goToMainForm)
    I.waitForVisible(this.#tabSearch, 30)
  }

  async openClientDossier() {
    await I.cClick(this.#inClientDossier)
    I.waitForText('Досье клиента', 25)
  }

  /**
   * Метод поиска клиента на главной форме и взятие заявки в работу через досье клиента от Ecredit
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async choseApplicationInClientProfile(client) {
    await this.searchClient(client)
    await this.openClientDossier()
    await I.cDoubleClick(this.#currentApplication)
  }

  /**
   * Метод перехода на вкладку Заявки на главной форме и и поиск заявки от eCredit в таблице "Итого по поиску"
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async goToTheApplicationTab(client, tab) {
    await this.selectTab(tab)
    I.waitForText('На оформлении за последние 5 дней', 20)
    await I.postToUdmConsole(
      `Добавить(НАЙТИПОЛЬЗОВАТЕЛЯ("${codeceptjs.container.support().usernameAuto}").должности, НАЙТИДОЛЖНОСТЬ("Администратор", найтиподразделение("Единое_платформенное_подразделение")))`,
    )
    await I.cFillField(await this.#element('Поле_ввода_фамилия'), client.surname)
    await I.cFillField(await this.#element('Поле_ввода_имя'), client.firstName)
    if (client.patronymic) {
      await I.cFillField(await this.#element('Поле_ввода_отчество'), client.patronymic)
    }
    await I.cClick(await this.#element('Кнопка_поиск', 'button'))
    await I.waitForVisible(this.#lastApplicationLocked, 80)
    await I.waitForInvisible(this.#lastApplicationLocked, 80)
    await I.cDoubleClick(this.#lastApplication)
  }

  async selectTab(tab) {
    I.waitForText('Параметры поиска', 180)
    await I.cSay('----------Осуществлен переход на главную форму"----------')
    await I.waitForClickable(this.#tab(tab), 20)
    await I.click(this.#tab(tab))
    await I.cSay(`----------Осуществлен переход на вкладку ${tab}"----------`)
  }
}

module.exports = { MainFormAuto }
