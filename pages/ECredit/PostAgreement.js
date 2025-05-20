const GenerateJSON = require('../../helpers/generators/GenerateJSON')
const { I } = inject()
/**
 * Подготовка и отправка PostAgreement для безинтерфейсных заявок
 */
class PostAgreement {
  /**
   * Отправка PostAgreement по безинтерфейсной заявке
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async send(credit) {
    const stageStatus = await this.selectCreditStatus(credit)
    if (stageStatus === 'Запрос в РБС успешно выполнен' || stageStatus === 'Одобрено DESS (по заявке) : Автокредит') {
      const response = await I.sendJSON(
        `${codeceptjs.config.get().urlAuto}/platform/rs2/rest/endpoint/agreement`,
        await new GenerateJSON().postAgreement(credit),
      )
      return response
    }
  }
  /**
   * Получение статуса кредита, перед отправкой PostAgreement
   * @returns возвращает строку со статусом кредита
   */
  async selectCreditStatus(credit) {
    I.wait(60)
    const stageStatus = await I.selectFromDataBase('creditStatus.sql', credit.reqID)
    return stageStatus.rows[0][0]
  }

  /**
   * Проверка ответа от сервиса PostAgreement
   * @param {Object} response - объект ответа от сервиса PostAgreement
   */
  async checkStatus(response) {
    if (response.status === 'В работе') {
      await I.cSay('Постагримент успешно обработан')
    } else {
      throw new Error(response.message)
    }
  }
}

module.exports = { PostAgreement }
