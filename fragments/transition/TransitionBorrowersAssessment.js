const ContextError = require('../../helpers/ContextError')
const Loader = require('../../helpers/Loader')

const { I } = inject()
/**
 * Навигация с этапа оценки заемщика
 */
class TransitionBorrowersAssessment {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  /**
   * Переходы с оценки заемщика для кредитной карты
   */
  async transition() {
    await new ContextError().grab()
    if (
      (tags.includes('@migration') && !tags.includes('@oz')) ||
      tags.includes('@line') ||
      tags.includes('@negative') ||
      (tags.includes('@rejection') && !tags.includes('@oz'))
    ) {
      await this.goToFullQuestionnaire()
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@oz')) {
        await this.rejectionFromDess()
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@oz_to_ka')) {
        await I.cClick(this.#button('Кнопка_2'))
        I.waitForElement(this.#activeStage('Короткая анкета'), 50)
      } else {
        await this.goToFullQuestionnaire()
      }
    }
  }
  /**
   * Переход на этап Полной анкеты
   */
  async goToFullQuestionnaire() {
    await I.cClick(this.#button('Кнопка_Запрос'))
    await new Loader().reload('Оценка заемщика - одобрена')
    await I.cClick(this.#button('Кнопка_Продолжить'))
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
      await I.cClick(this.#button('Кнопка_Запрос'))
      await new Loader().reload('Оценка заемщика - одобрена')
      await I.replacingResponseFromDESS(rejectionType)
      await I.cClick(this.#button('Кнопка_Завершить_процесс'))
    }
  }
}

module.exports = { TransitionBorrowersAssessment }
