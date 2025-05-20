const ContextError = require('../../helpers/ContextError')

const { I } = inject()
/**
 * Навигация с этапа открытия счетов
 */
class TransitionOpeningAccounts {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  #horizontal = '//*[@class="element group horizontal-group __cell-noflex__"]'
  /**
   * Переход с этапа открытия счетов
   */
  async transition() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@rejection') ||
      tags.includes('@negative')
    ) {
      if (!tags.includes('@os')) {
        await I.cClick(this.#button('Кнопка_2'))
      } else if (tags.includes('@os')) {
        await I.cClick(this.#button('Кнопка_отказ'))
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@card_numbers_to_zv')) {
        await I.cClick(this.#horizontal + this.#button('Кнопка_1'))
        I.waitForElement(this.#activeStage('Заявка на выдачу кредита'), 50)
      } else {
        await I.cClick(this.#button('Кнопка_2'))
      }
    }
  }
}

module.exports = { TransitionOpeningAccounts }
