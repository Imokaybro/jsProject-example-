const { I } = inject()

class GarError {
  #checkAddress = data => {
    return `//*[@data-control-name="${data}"]//*[@data-control-name="Кнопка_Проверить_адрес_по_полям" and not(contains(@style, "display: none"))]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #closeAlert = '//*[@class="b-popup"]//*[@value="Закрыть"]'
  async checkGar(data) {
    for (let index = 0; index < 3; index++) {
      await I.lossOfFocus()
      I.wait(5)
      const garError = await tryTo(() => I.waitForElement(this.#checkAddress(data), 2))
      if (garError) {
        I.wait(2)
        await I.cClick(this.#checkAddress(data))
        I.wait(2)
        let garError1 = await tryTo(() => I.waitForElement(this.#closeAlert, 2))
        if (garError1) {
          I.wait(2)
          await I.cClick(this.#closeAlert)
          I.wait(2)
        }
      } else {
        index = 3
      }
    }
  }
}

module.exports = GarError
