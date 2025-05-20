const { I } = inject()
/**
 * работа с сервисом получения ИНН
 */
class InnAlert {
  #popUpWindow = '//*[@data-control-name="Всплывающее_окно_Предупреждение_ИНН"]'
  #button = '//*[@class="ui-button-text ui-button-in-line"]'
  #closeWindow = `${this.#popUpWindow}//*[@data-control-name="Кнопка_2"]${this.#button}`

  /**
   *Закрытие модального окна сервиса получения ИНН клиента
   */
  async closePopUpWindow() {
    if ((await I.selectSwitchStatus('Запрос_ИНН')) === 'да') {
      const seeWindow = await tryTo(() => I.waitForVisible(this.#popUpWindow, 25))
      if (seeWindow) {
        await I.cClick(this.#closeWindow)
      }
    }
  }
}

module.exports = InnAlert
