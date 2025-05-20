const { CarParameters } = require('../fragments/applicationMetcomCalculation/CarParameters')

const { I } = inject()

class CheckPTS {
  #form = '//*[@data-control-name="sub_ПТС_1"]'
  #ptsType = type => {
    return `${this.#form}//*[text()="${type}"]/..//*[@class="radiobutton"]`
  }
  #confirmVIN = value => {
    return `${this.#form}//*[@data-control-name="Группа_переключателей_подтверждение_VIN"]//*[text()="${value}"]/..//*[@class="radiobutton"]`
  }
  #ptsScan = '//*[text()="ПТС"]/..//*[@class="attach-button"]'
  #next = '//*[@data-control-name="Кнопка_Далее"]//*[@class="ui-button-text ui-button-in-line"]'

  async fill(credit) {
    I.waitForElement(this.#form, 30)
    await I.cClick(this.#ptsType(credit.auto.pts.type))
    await new CarParameters().fillPTS(credit)
    await I.cClick(this.#confirmVIN('Нет'))
    await I.cClick(this.#next)
    I.waitForText('Заведите задачу на замену залога для исправления', 5)
    I.pressKey('Escape')
    await I.cClick(this.#confirmVIN('Да'))
    await I.cClick(this.#next)
    I.waitForText('Вложите сканы ПТС')
    await I.scanDocumentLoad(this.#ptsScan)
    await I.cClick(this.#next)
  }
}

module.exports = { CheckPTS }
