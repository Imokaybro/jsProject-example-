const ContextError = require('../../helpers/ContextError')

const { I } = inject()
/**
 * Навигация с этапа завершения сделки для автолизинга физлиц
 */
class TransitionCompletionTransaction {
  /**
   * Переход с завершения сделки для автолизинга физлиц
   */
  async transition() {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line')) {
      if (!tags.includes('@zs')) {
        await I.cClick('//span[text()="Продолжить"]')
        const checkEmail = await tryTo(() => I.waitForText('У Вас не заполнена электронная почта', 5))
        if (checkEmail) {
          await I.cClick('//span[text()="Продолжить"]')
        }
        const requestError = await tryTo(() => I.waitForText('Ошибка запроса', 150))
        if (requestError) {
          await I.cClick("//span[text()='Далее']")
        }
      }
    }
  }
}

module.exports = { TransitionCompletionTransaction }
