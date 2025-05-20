const { WindowAddPost } = require('../fragments/ARMAdministration/WindowAddPost')
const { WindowNewRole } = require('../fragments/ARMAdministration/WindowNewRole')

const { I } = inject()

class WorkingWithPositions {
  constructor() {
    const tabLocate = '//*[@data-control-name="Управление_должностями_и_ролями_1"]'

    this.add = `${tabLocate}//*[@data-name="СОЗДАТЬ ДОЛЖНОСТЬ"]`
    this.filterUp = `(${tabLocate}//*[@data-control-name="Рамка_должности"]//*[@class="ui-arrow-up "])[1]`
    this.filesTableHead =
      '//*[@data-control-name="Рамка_должности"]//*[@data-control-name="Таблица_должности"]//thead//div[@class="content content-tt-cell"]'
    this.filesTableBody =
      '//*[@data-control-name="Рамка_должности"]//*[@data-control-name="Таблица_должности"]//tbody//div[@class="cell-inner content-tt-cell"]'
    this.delete = `${tabLocate}//*[@data-name="УДАЛИТЬ ДОЛЖНОСТЬ"]`
  }

  /**
   * Добавление должности
   * @param {Object} post - объект с данными должности
   */
  async addPosition(post) {
    await I.cClick(this.add)
    await new WindowAddPost().fillPostParametrs(post)
  }

  /**
   * Поиск должности
   * @param {Object} post - объект с данными должности
   */
  async searchPost(post) {
    let positionFound
    I.wait(10)
    let tablePages = await I.grabTextFromAll(
      '//*[@class="ui-btn paginator-control" or @class="ui-btn paginator-control paginator-control-active"]',
    )
    for (let i = 0; i < tablePages.length; i++) {
      I.wait(1)
      positionFound = await tryTo(() => I.cClick(`//*[text()="${post.name}"]`, 5))
      if (positionFound) {
        await I.cSay(`Должность найдена на странице №${i + 1}`)
        await I.cClick(
          `//*[@data-control-name="Рамка_должности"]//*[@data-control-name="Таблица_должности"]//*[text()="${post.name}"]`,
        )
        i = tablePages.length
      } else {
        await I.cSay(`На странице №${i + 1} должность не найдена, переход на следующую страницу`)
        await I.cClick(
          '//*[@data-control-name="Таблица_должности"]//*[@class="ui-btn paginator-control paginator-control-next"]',
        )
      }
    }
    if (!positionFound) {
      throw new Error('Должность не найдена на всех страницах должностей')
    }
  }

  /**
   * Добавление роли
   * @param {Object} role - объект с данными должности
   */
  async addRole(role) {
    await I.cClick(
      '//*[@data-control-name="Рамка_роли"]//*[@data-control-name="Кнопка_добавить_роль"]//*[@class="ui-button-text ui-button-in-line"]',
    )
    await I.cFillField(
      '//*[@data-control-name="Рамка_роли"]//*[@data-control-name="Раскрывающийся_список_множ_роли"]//input',
      role.name,
    )
    await I.cClick(`//*[text()="${role.name}"]`)
    await I.cClick(
      '//*[@data-control-name="Рамка_роли"]//*[@data-control-name="Кнопка_добавить_роль"]//*[@class="ui-button-text ui-button-in-line"]',
    )
  }

  /**
   * Создание новой роли
   * @param {Object} role - объект с данными должности
   */
  async newRole(role) {
    await I.cClick('//*[@data-control-name="Таблица_роли"]//*[@data-name="СОЗДАТЬ НОВУЮ РОЛЬ"]')
    await new WindowNewRole().add(role)
  }

  /**
   * Добавление привилегий к роли
   * @param {Object} role - объект с данными должности
   */
  async addPrivileges(role) {
    await I.cClick(`//*[@data-control-name="Таблица_роли"]//*[text()="${role.name}"]`)
    await I.cClick(
      '//*[@data-control-name="Рамка_прикладные_роли"]//*[@data-control-name="Кнопка_добавить_роль"]//*[@class="ui-button-text ui-button-in-line"]',
    )
    await I.cFillField(
      '//*[@data-control-name="Рамка_прикладные_роли"]//*[@data-control-name="Раскрывающийся_список_множ_роли"]//input',
      'Подписание_по_смс',
    )
    await I.cClick('//*[text()="Подписание_по_смс"]')
    await I.cClick(
      '//*[@data-control-name="Рамка_прикладные_роли"]//*[@data-control-name="Кнопка_добавить_роль"]//*[@class="ui-button-text ui-button-in-line"]',
    )
  }

  /**
   * Удаление должности
   * @param {Object} post - объект с данными должности
   */
  async deletePost(post) {
    await I.cClick(`//*[text()="${post.name}"]`, 5)
    await I.cClick(this.delete)
    I.waitForText('Желаете удалить эту должность из этого подразделения?', 10)
    await I.cClick(
      '//*[@data-control-name="Всплывающее_окно_удалить_должность"]//*[@data-control-name="Кнопка_все"]//*[@class="ui-button-text ui-button-in-line"]',
    )
  }
}

module.exports = { WorkingWithPositions }
