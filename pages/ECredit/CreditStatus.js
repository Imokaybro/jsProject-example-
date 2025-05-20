const { I } = inject()
/**
 * Проверка финального статуса безинтерфейсных заявок
 */
class CreditStatus {
  /**
   * Получение финального статуса для безинтерфейсных заявок
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async check(credit, status = 'Выдача успешно завершена') {
    for (let i = 0; i < 3; i++) {
      I.wait(80)
      const stageStatus = (await I.selectFromDataBase('creditStatus.sql', credit.reqID)).rows[0][0]

      if (stageStatus === status) {
        await I.cSay(`Статус заявки: ${stageStatus}`)
        if (status === 'Выдача успешно завершена') {
          await I.cSay(`Выдача кредита успешно завершена: внешний номер заявки: ${credit.reqID}`)
        }
        break
      } else if (i > 1) {
        await I.cSay(stageStatus)
        throw new Error(`Некорректный статус заявки: '${stageStatus}', а должен быть '${status}'`)
      }
    }
  }

  async checkAdditionalParameters(credit, type) {
    if (type == 'Потеря дохода') {
      if (credit.reqID) {
        const lossOfIncome = (await I.selectFromDataBase('lossOfIncome.sql', credit.reqID)).rows[0]
        return lossOfIncome
      } else {
        const creditNumber = credit.applicationNumber.slice(1).split('-')[0]
        const lossOfIncome = (await I.selectFromDataBase('lossOfIncomeCredit.sql', creditNumber)).rows[0]
        return lossOfIncome
      }
    }
    if (type == 'Назначь свою ставку') {
      const creditNumber = credit.applicationNumber.slice(1).split('-')[0]
      const lossOfIncome = (await I.selectFromDataBase('setYourBet.sql', creditNumber)).rows[0]
      return lossOfIncome
    }
    if (type == 'Все под ключ') {
      const creditNumber = credit.applicationNumber.slice(1).split('-')[0]
      const everythingIsTurnKey = (await I.selectFromDataBase('everythingIsTurnKey.sql', creditNumber)).rows[0]
      return everythingIsTurnKey
    }
    if (type == 'ДМС Экспресс Доктор') {
      const creditNumber = credit.applicationNumber.slice(1).split('-')[0]
      const dmsExpressDoctor = (await I.selectFromDataBase('dmsExpressDoctorCredit.sql', creditNumber)).rows[0]
      return dmsExpressDoctor
    }
    if (type == 'Доп.оборудование') {
      if (credit.reqID) {
        const additionalEquipment = (await I.selectFromDataBase('additionalEquipment.sql', credit.reqID)).rows
        return additionalEquipment
      }
    }
    if (type == 'КАСКО в подарок') {
      if (credit.reqID) {
        const cascoIsFreeOfCharge = (await I.selectFromDataBase('cascoIsFreeOfCharge.sql', [credit.reqID, '1073']))
          .rows[0]
        return cascoIsFreeOfCharge
      }
    }
    if (type == 'КАСКО в подарок Max') {
      if (credit.reqID) {
        const cascoIsFreeOfCharge = (await I.selectFromDataBase('cascoIsFreeOfCharge.sql', [credit.reqID, '1193']))
          .rows[0]
        return cascoIsFreeOfCharge
      }
    }
  }
}

module.exports = { CreditStatus }
