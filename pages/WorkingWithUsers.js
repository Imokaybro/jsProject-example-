const { WindowAddUser } = require('../fragments/ARMAdministration/WindowAddUser')
const { I } = inject()

class WorkingWithUsers {
  constructor() {
    const tabLocate = '//*[@data-control-name="Tabs.Пользователи"]'
    this.searchByName = `${tabLocate}//*[@data-control-name="Поле_поиска_организации"]//input`
    this.search = `${tabLocate}//*[@data-control-name="Кнопка_найти"]//*[@class="ui-button-text ui-button-in-line"]`

    const subTabLocate = '//*[@data-control-name="Рамка_пользователи"]'
    this.addUser = `${subTabLocate}//*[@data-control-name="Кнопка_Создать"]//*[@class="ui-button-text ui-button-in-line"]`
    this.searchLogin =
      '(//*[@data-control-name="Таблица_операторы_подразделения"]//*[@class="ui-table-filter string-type"])[2]'
    this.addRoles = '//*[@data-control-name="Кнопка_добавить_должность"]//*[@class="ui-button-text ui-button-in-line"]'
    this.deleteUsers =
      '//*[@data-control-name="Рамка_пользователи"]//*[@data-control-name="Кнопка_Удалить"]//*[@class="ui-button-text ui-button-in-line"]'

    this.deleteUserSystem = '//*[@data-control-name="Удаление_пользователя_1"]//*[text()="Удалить из системы"]'
  }

  /**
   * Поиск точки оформления
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async searchPoint(credit) {
    await I.cFillField(this.searchByName, credit.point)
    await I.cClick(this.search)
    I.waitForVisible(
      `//*[@data-control-name="Tabs.Пользователи"]//*[@data-control-name="Дерево_иерархия"]//*[text()='${credit.point}']`,
      30,
    )
    await I.cClick(
      `//*[@data-control-name="Tabs.Пользователи"]//*[@data-control-name="Дерево_иерархия"]//*[text()='${credit.point}']`,
    )
  }

  /**
   * Добавление пользователя на точку оформления
   * @param {Object} user - объект с тестовыми данными пользователя
   */
  async addUsers(user) {
    await I.cClick(this.addUser)
    I.waitForVisible('//*[@data-control-name="Всплывающее_окно_пользователь"]', 30)
    await new WindowAddUser().fillUserParametrs(user)
  }

  /**
   * Добавление роли пользователю
   * @param {Object} user - объект с тестовыми данными пользователя
   */
  async addRole(user) {
    await this.searchUser(user)
    await I.cClick(this.addRoles)
    await I.cFillField('//*[@data-control-name="Раскрывающийся_список_множ_должности"]//input', 'Кредитный эксперт')
    await I.cClick('//*[text()="Кредитный эксперт"]')
    await I.cClick(this.addRoles)
  }

  /**
   * Удаление пользователя
   * @param {Object} user - объект с тестовыми данными пользователя
   */
  async deleteUser(user) {
    await I.cClick(this.deleteUsers)
    I.waitForVisible(`//*[text()="Выберите способ удаления пользователя ${user.login}"]`, 15)
    await I.cClick(this.deleteUserSystem)
    I.waitForVisible('//*[@class="ui-dialog-content ui-widget-content"]//*[text()="Пользователь удален"]', 15)
  }

  /**
   * Поиск пользователя
   * @param {Object} user - объект с тестовыми данными пользователя
   */
  async searchUser(user) {
    I.wait(10)
    await I.cFillField(this.searchLogin, user.login)
    I.pressKey('Enter')
    await I.cClick(`//*[@class="ui-table-rows-even "]//*[text()="${user.login}"]`)
  }
}

module.exports = { WorkingWithUsers }
