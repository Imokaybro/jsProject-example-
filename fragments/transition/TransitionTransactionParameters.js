const ContextError = require('../../helpers/ContextError')

const { I } = inject()
/**
 * Навигация с этапа параметры сделки
 */
class TransitionTransactionParameters {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #reject = `//*[@data-control-name="Кнопка_отказ" or @data-control-name="Кнопка_Отказ_1"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  /**
   * Переход с параметров сделки для автокреда, автолизинга физлиц и кредита наличными на покупку авто
   */
  async transaction() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@negative') ||
      tags.includes('@rejection')
    ) {
      if (!tags.includes('@ps')) {
        await I.cClick(this.#button('Кнопка_замена'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@ps')) {
        await I.cClick(this.#reject)
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@account_numbers_to_zv')) {
        await I.cClick(this.#button('Кнопка_возврата'))
        I.waitForElement(this.#activeStage('Заявка на выдачу кредита'), 50)
      } else {
        await I.cClick(this.#button('Кнопка_замена'))
      }
    }
  }
}

module.exports = { TransitionTransactionParameters }
