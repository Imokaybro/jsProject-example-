const ContextError = require('../../helpers/ContextError')
const { RBSError } = require('../RBSError')
const { I } = inject()
const DESS = 'Базовый:Организация:поИд(идобъекта(кредит.точка_оформления))[0]'
const request = 'https://wrdc-dess-dit.sovcombank.group:443/CabinetIntegration/put_request.aspx'
const response = 'https://wrdc-dess-dit.sovcombank.group:443/CabinetIntegration/get_status.aspx'
const RBS = 'Базовый:Пользователь:По_логину_не_удаленные(ТЕКУЩИЙПОЛЬЗОВАТЕЛЬ())[0].выбранный_рбс :='
/**
 * Навигация с этапа короткой анкеты
 */
class TransitionShortQuestionnaire {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  #horizontal = '//*[@class="element group horizontal-group __cell-noflex__"]'
  /**
   * Переход с этапа "Короткая анкета"
   * @param {Object} client - тестовые данные клиента
   * @param {Object} credit - тестовые данные кредита
   */
  async transition(client, credit) {
    await new ContextError().grab()
    if (tags.includes('@line') || tags.includes('@negative') || tags.includes('@migration') || tags.includes('@back')) {
      await this.goToPrintedDocsShortQuestionnaire(client, credit)
      if (tags.includes('@pfka_to_ka')) {
        await I.cClick(this.#button('Кнопка_Возврат_на_анкету'))
        I.waitForElement(this.#activeStage('Короткая анкета'), 50)
      } else if (!tags.includes('@ka')) {
        await I.cClick(this.#horizontal + this.#button('Кнопка_Договор'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@return')) {
        await I.postToUdmConsole(`${DESS}.url_для_запроса_dess := '${request}'`)
        await I.postToUdmConsole(`${DESS}.url_для_ответа_dess := '${response}'`)
      }
      if (tags.includes('@ka')) {
        I.waitForEnabled(this.#button('Кнопка_отказ'), 250)
        await I.cClick(this.#button('Кнопка_отказ'))
      } else if (tags.includes('@rbsErr')) {
        await I.postToUdmConsole(`${RBS} "не_существующий"`)
        await I.postToUdmConsole('кредит.рбс.выбранный_рбс:="не_существующий"')
        await I.cClick(this.#horizontal + this.#button('Кнопка_1'))
        const passportCheck = await tryTo(() => I.waitForText('Проверка паспорта', 10))
        if (passportCheck) {
          await I.cClick('//*[@data-control-name="Кнопка_Подтверждаю"]//*[@class="ui-button-text ui-button-in-line"]')
        }
        I.waitForText('Ошибка отправки запроса', 150)
        await I.cClick('//*[text()="ЗАВЕРШИТЬ ПРОЦЕСС" or text()="Завершить процесс"]/..')
      } else {
        await this.goToPrintedDocsShortQuestionnaire(client, credit)
        await I.cClick(this.#horizontal + this.#button('Кнопка_Договор'))
      }
    }
  }

  async goToPrintedDocsShortQuestionnaire(client, credit) {
    await new ContextError().grab()
    await I.cClick(this.#horizontal + this.#button('Кнопка_1'))
    const passportCheck = await tryTo(() => I.waitForText('Проверка паспорта', 10))
    if (passportCheck) {
      await I.cClick('//*[@data-control-name="Кнопка_Подтверждаю"]//*[@class="ui-button-text ui-button-in-line"]')
    }

    await new RBSError().connectionError()
    await new RBSError().incorrectPassport(client)
    await this.checkShortQuestionnairePDF(credit)
  }

  async checkShortQuestionnairePDF(credit) {
    if (credit?.typeCredit === 'Кредитные карты') {
      I.waitForText('Анкета заемщика (Халва)', 150)
    } else {
      I.waitForText('Анкета заемщика (предварительная)', 150)
    }
  }
}

module.exports = { TransitionShortQuestionnaire }
