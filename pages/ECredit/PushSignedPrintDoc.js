const { I } = inject()

/**
 * Подготовка запроса и отправка печатных документов по заявке
 */
class PushSignedPrintDoc {
  /**
   * Отправка документов по сервису PushSignedPrintDoc
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async sendPrintDoc(credit) {
    await I.cSay('Подготовка к отправке PushPrintDocs')
    const url = codeceptjs.config.get().urlServiceAuto
    const request = await I.generateXMLPushSignedPrintDoc(credit)
    const soapAction = 'DELETED'

    brake: for (let i = 0; i < 2; i++) {
      I.wait(250)
      const firstStatus = await this.#checkStatus(credit, 'Без интерфейсное оформление внешних. Подписание Договора')
      if (firstStatus) {
        const response = await I.sendXML(url, request, soapAction)
        if (response.includes('<tns:errorCode>0</tns:errorCode>')) {
          await I.cSay('Документы успешно отправлены')
          break brake
        } else {
          throw new Error(`Ошибка при отправке документов ${response}`)
        }
      }
    }

    I.wait(15)
    const secondStatus = await this.#checkStatus(credit, 'Без интерфейсное оформление внешних. Подписание Договора')
    if (secondStatus) {
      I.wait(50)
      await I.cSay('Повторная отправка документов.')
      await I.sendXML(url, request, soapAction)
    }
  }

  async #checkStatus(credit, status) {
    const stageStatus = (await I.selectFromDataBase('creditStatus.sql', credit.reqID)).rows[0][0]
    if (status === stageStatus) {
      return true
    } else {
      return false
    }
  }
}

module.exports = { PushSignedPrintDoc }
