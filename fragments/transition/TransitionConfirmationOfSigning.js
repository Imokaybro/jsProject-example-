const ContextError = require('../../helpers/ContextError')

const { I } = inject()
/**
 * Навигация с подтверждения подписания для товарного кредита, кредита наличными на покупку авто
 */
class TransitionConfirmationOfSigning {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #next = `//*[@data-control-name="Кнопка_Далее" or @data-control-name="Кнопка_Договор"]${this.#buttonClass}`
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`

  /**
   * Переход с подтверждения подписания для товарного кредита, кредита наличными на покупку авто
   */
  async transition() {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line')) {
      if (!tags.includes('@pp')) {
        await I.cClick(this.#next)
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Отказ'))
        I.waitForText('Вы действительно хотите отказаться от текущего кредита? ', 5)
        await I.cClick(this.#button('Удалить'))
      }
    }
  }
}

module.exports = { TransitionConfirmationOfSigning }
