const ContextError = require('../../helpers/ContextError')

const { I } = inject()
/**
 * Навигация с заявки на страхование для пролонгаци полиса
 */
class TransitionApplicationForInsurance {
  #horizontal = '//*[@class="element group horizontal-group __cell-noflex__"]'
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #next = `${this.#horizontal}//*[@data-control-name="Кнопка_Сохранить" or @data-control-name="Кнопка_Далее"]${this.#buttonClass}`
  #reject = `${this.#horizontal}//*[@data-control-name="Кнопка_отказ" or @data-control-name="Кнопка_Отказ"]${this.#buttonClass}`

  /**
   * Переход с заявки на страхование для пролонгаци полиса
   */
  async transition() {
    if (tags.includes('@migration') || tags.includes('@line') || tags.includes('@rejection')) {
      if (!tags.includes('@znstr')) {
        await I.cClick(this.#next)
        await new ContextError().grab()
      }
    }
    if (tags.includes('@rejection') && tags.includes('@znstr')) {
      await I.cClick(this.#reject)
      await new ContextError().grab()
    }
  }
}

module.exports = { TransitionApplicationForInsurance }
