const ContextError = require('../../helpers/ContextError')
const Loader = require('../../helpers/Loader')

const { I } = inject()
/**
 * Навигация с этапа Постановка авто в залог
 */
class TransitionCarPledge {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #horizontal = ' //*[@class="element group horizontal-group __cell-noflex__"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`

  /*
   * Переход для процесса постановки авто в залог
   * этап Постановка авто в залог
   */
  async transition() {
    await new ContextError().grab()
    if (tags.includes('@rejection') && tags.includes('@paz')) {
      await I.cClick(this.#button('Кнопка_Далее'))
      const answerFromDess = await tryTo(() => I.waitForText('Заявка на выдачу кредита - одобрена', 250))
      if (!answerFromDess) {
        I.waitForText('Идет обработка...', 2)
        I.refreshPage()
        I.wait(5)
        I.waitForText('Заявка на выдачу кредита - одобрена', 5)
      }
      await I.cClick(this.#button('Кнопка_Отказ_1'))
    } else if (tags.includes('@back')) {
      if (tags.includes('@scp_to_ka')) {
        await I.cClick(this.#horizontal + this.#button('Кнопка_Назад'))
        I.waitForElement(this.#activeStage('Короткая анкета'), 50)
      } else {
        await this.nextStage()
      }
    } else {
      await this.nextStage()
    }
  }

  async nextStage() {
    await new ContextError().grab()
    await I.cClick(this.#button('Кнопка_Далее'))
    await new Loader().reload('Заявка на выдачу кредита - одобрена')
    await I.cClick(this.#button('Кнопка_замена'))
  }
}

module.exports = { TransitionCarPledge }
