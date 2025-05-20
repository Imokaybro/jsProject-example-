const { I } = inject()

/**
 * Класс для обработки отправки и одобрения анкет для кредитов.
 */
class ECreditQuestionnaire {
  /**
   * Отправляет анкету для клиента.
   * @param {Object} client - Объект с данными клиента.
   * @param {Object} credit - Объект с данными кредита.
   * @param {String} questionnaireType - Тип анкеты ('Short' или 'Full').
   */
  async sendQuestionnaire(client, credit, questionnaireType) {
    const response = await this.sendSOAPeCredit(client, credit, questionnaireType)
    await this.checkStatusCredit(response, questionnaireType, credit.reqID)
  }

  /**
   * Генерирует и отправляет SOAP запрос для анкеты кредита.
   * @param {Object} client - Объект с данными клиента.
   * @param {Object} credit - Объект с данными кредита.
   * @param {String} questionnaireType - Тип анкеты ('Short' или 'Full').
   * @returns {String} - Ответ от сервиса.
   */
  async sendSOAPeCredit(client, credit, questionnaireType) {
    const request = await I.generateXMLeCredit(client, credit, questionnaireType)
    const response = await I.sendXML(codeceptjs.config.get().urlServiceAuto, request, 'OneTwoAutoRequest')
    return response
  }

  /**
   * Проверяет статус заявки на кредит.
   * @param {String} response - Ответ от сервиса.
   * @param {String} questionnaireType - Тип анкеты ('Short' или 'Full').
   * @param {String} reqID - Внешний номер заявки.
   */
  async checkStatusCredit(response, questionnaireType, reqID) {
    if (!response.includes('IN WORK')) {
      throw new Error('Ошибка при отправке анкеты')
    }

    for (let i = 0; i < 5; i++) {
      I.wait(60)
      let stageStatus
      await tryTo(async () => (stageStatus = await I.selectFromDataBase('creditStatus.sql', reqID)))

      if (!stageStatus.rows[0]) {
        const log = await I.findAndGrabLog(`ecredit_${await I.getCurrentDate()}`, reqID)
        await I.cSay(JSON.stringify(log))
        throw new Error(log)
      } else {
        stageStatus = stageStatus.rows[0][0]
      }
      await I.cSay(stageStatus)

      if (stageStatus === 'Ошибка при обращении к РБС') {
        throw new Error(stageStatus)
      }

      if (await this.isQuestionnaireApproved(stageStatus, questionnaireType, i, reqID)) break
    }
  }

  /**
   * Проверяет, одобрена ли анкета.
   * @param {String} stageStatus - Текущий статус этапа заявки.
   * @param {String} questionnaireType - Тип анкеты ('Short' или 'Full').
   * @param {Number} attempt - Номер текущей попытки.
   * @param {String} reqID - Внешний номер заявки.
   * @returns {Boolean} - True, если анкета одобрена, иначе false.
   */
  async isQuestionnaireApproved(stageStatus, questionnaireType, attempt, reqID) {
    const approvedStatuses = {
      Short: ['Одобрено DESS (скоринг) '],
      Full: ['Запрос в РБС успешно выполнен', 'Акцепт ДПА', 'Одобрено DESS (по заявке) : Автокредит'],
    }

    if (!approvedStatuses[questionnaireType].includes(stageStatus)) {
      if (attempt > 3) {
        const log = await I.findAndGrabLog(`ecredit_${await I.getCurrentDate()}`, reqID)
        throw new Error(`Ошибка обработки ${questionnaireType.toLowerCase()} анкеты: ${log}`)
      }
      return false
    }

    return true
  }
}

module.exports = { ECreditQuestionnaire }
