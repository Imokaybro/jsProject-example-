const ContextError = require('../../helpers/ContextError')
const { RBSError } = require('../RBSError')
const InnAlert = require('../fullQuestionnaire/InnAlert')
const { I } = inject()
/**
 * Навигация с этапа полной анкеты
 */
class TransitionFullQuestionnaire {
  #button = name => `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`

  /**
   * Переход с этапа "Полная анкета"
   * @param {Object} credit - тестовые данные кредита
   */
  async transition(credit) {
    await new ContextError().grab()
    if (
      tags.includes('@line') ||
      (tags.includes('@migration') && !tags.includes('@pa')) ||
      tags.includes('@negative') ||
      (tags.includes('@back') && !tags.includes('@pfpa_to_pa')) ||
      (tags.includes('@rejection') && !tags.includes('@pa'))
    ) {
      if (credit.typeCredit !== 'Пролонгация полиса') {
        await this.transitionToNextStage()
      } else if (credit.typeCredit === 'Пролонгация полиса') {
        await I.cClick(this.#button('Кнопка_2')) //Далее
        await new InnAlert().closePopUpWindow()
        await new RBSError().connectionError()
      }
    }
    if (tags.includes('@pfpa_to_pa')) {
      await I.cClick(this.#button('Кнопка_2')) //Далее
      await new InnAlert().closePopUpWindow()
      await I.cClick(this.#button('Кнопка_Возврат_на_анкету'))
      I.waitForElement('//*[@class="active"]//*[text()="Полная анкета"]', 50)
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pa')) {
        await I.cClick(this.#button('Кнопка_ОТКАЗ'))
      }
    }
  }

  /**
   * Переход на следующий этап
   */
  async transitionToNextStage() {
    await new ContextError().grab()
    await I.cClick(this.#button('Кнопка_2')) //Далее
    const passportCheck = await tryTo(() => I.waitForText('Проверка предыдущего паспорта', 15))
    if (passportCheck) {
      await I.cClick('//*[@data-control-name="Кнопка_Подтверждаю"]//*[@class="ui-button-text ui-button-in-line"]')
    }
    await new InnAlert().closePopUpWindow()
    await new RBSError().connectionError()
    I.waitForText('Анкета заемщика', 150)
    await I.cClick(this.#button('Кнопка_Договор'))
  }
}

module.exports = { TransitionFullQuestionnaire }
