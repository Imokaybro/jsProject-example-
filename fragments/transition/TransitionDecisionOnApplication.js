const ContextError = require('../../helpers/ContextError')
const Loader = require('../../helpers/Loader')

const { I } = inject()
/**
 * Навигация с этапа решения по заявке
 */
class TransitionDecisionOnApplication {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  /**
   * Переход с этапа решения по заявке
   */
  async transition() {
    await new ContextError().grab()
    if (
      tags.includes('@line') ||
      tags.includes('@back') ||
      tags.includes('@negative') ||
      tags.includes('@migration') ||
      tags.includes('@rejection')
    ) {
      if (!tags.includes('@rpz')) {
        await new Loader().reload('Заявка на выдачу кредита - одобрена')
        await I.cClick(this.#button('Кнопка_замена'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@rpz')) {
        if (tags.includes('@vno') || tags.includes('@sno')) {
          await this.rejectionFromDess()
        } else {
          await I.cClick(this.#button('Кнопка_Отказ_1'))
        }
      }
    }
  }

  /**
   * Подмена ответа от ДЕСС на отказ
   */
  async rejectionFromDess() {
    if (tags.includes('@vno') || tags.includes('@sno')) {
      let rejectionType = ''
      if (tags.includes('@vno')) {
        rejectionType = 'Временный отказ'
      }
      if (tags.includes('@sno')) {
        rejectionType = 'Нет'
      }
      await new Loader().reload('Заявка на выдачу кредита - одобрена')
      await I.replacingResponseFromDESS(rejectionType)
      if (tags.includes('@vno')) {
        await I.cClick(this.#button('Кнопка_возврата'))
        I.waitForElement(this.#activeStage('Заявка на рассмотрение'), 50)
      } else {
        await I.cClick(this.#button('Кнопка_Завершить_процесс'))
      }
    }
  }
}

module.exports = { TransitionDecisionOnApplication }
