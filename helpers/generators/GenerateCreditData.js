const Helper = require('@codeceptjs/helper')
const FakeCreditData = require('../fakers/FakeCreditData')
/**
 * Генератор данных кредита
 */
class GenerateCreditData extends Helper {
  /**
   * Метод генерации данных кредита для авто
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns возвращает объект с генерированными данными кредита
   */
  async generateCreditData(credit) {
    const { DataBaseHelper } = this.helpers
    const faker = new FakeCreditData()
    if (credit?.auto?.status === 'Новый') {
      let date = new Date()
      credit.auto.yearOfRelease =
        credit.auto.yearOfRelease ?? String(date.toLocaleString('ru').split(',')[0].split('.')[2])
      credit.auto.millage = credit.auto.millage ?? faker.randomChoice(0, 99)
    }
    if (credit?.auto?.status === 'Подержанный') {
      let date = new Date()
      credit.auto.yearOfRelease =
        credit.auto.yearOfRelease ??
        String(date.toLocaleString('ru').split(',')[0].split('.')[2] - faker.randomChoice(0, 6))
      credit.auto.millage = credit.auto.millage ?? faker.randomChoice(1001, 10000)
    }
    if (credit.typeCredit !== 'Кредитные карты' && credit.typeCredit !== 'Товарный кредит') {
      credit.auto.maxWeight = credit.auto.maxWeight ?? '3000'
      credit.auto.categoryAuto = 'B'

      if (!credit.auto.pts) {
        credit.auto.pts = new Object()
      }
      credit.auto.pts.type = faker.randomChoice() ? 'ПТС' : 'ЭПТС'
      if (credit?.auto?.stateSubsidy) {
        credit.auto.pts.type = 'ЭПТС'
      }
      if (credit?.auto?.pts?.type === 'ПТС') {
        credit.auto.pts.serial = credit.auto.pts.serial ?? (await faker.randomNumber(2)) + (await faker.randomString(2))
        credit.auto.pts.number = String(faker.randomChoice(100000, 999999))
        credit.auto.pts.issuedBy = faker.randomString(10)
      }
      if (credit?.auto?.pts?.type === 'ЭПТС') {
        credit.auto.pts.number = String(faker.randomChoice(100000000000000, 999999999999999))
      }
      let vin = await DataBaseHelper.selectFromDataBase('validVin.sql', credit.parameters.program)
      if (!vin.rows[0]) {
        credit.auto.pts.vin = credit.auto.pts.vin ?? faker.vin()
      } else {
        credit.auto.pts.vin = vin.rows[0][0]
      }
      if (credit.typeCredit == 'АвтоЛизинг физических лиц') {
        credit.auto.pts.bodyNumber = credit.auto.pts.vin
      }
      credit.auto.pts.dateOfIssue = new Date(credit.auto.yearOfRelease).toLocaleString('ru').split(',')[0]

      if (credit?.insurancePolicy?.type === 'КАСКО в кредит' || credit?.insurancePolicy?.type === 'КАСКО за наличные') {
        credit.insurancePolicy.company = credit.insurancePolicy.company ?? 'АО "DELETED"'
        credit.insurancePolicy.requisites = credit.insurancePolicy.requisites ?? '40702810206000330001'
        credit.insurancePolicy.number = '331' + String(faker.randomChoice(1000000000000, 999999999999999))
        credit.insurancePolicy.startDate = new Date().toLocaleString('ru').split(',')[0]
        let endDate = new Date()
        endDate.setDate(endDate.getDate() + 364)
        endDate = endDate.toLocaleString('ru').split(',')[0]
        credit.insurancePolicy.endDate = endDate
        credit.insurancePolicy.amount = credit.insurancePolicy.amount ?? String(faker.randomChoice(5000, 15000))
      }

      if (credit?.insurancePolicy?.type === 'EGAP') {
        credit.insurancePolicy.company = 'ПАО СК "Росгосстрах"'
        credit.insurancePolicy.requisites = '47422810450160048509'
      }

      if (credit?.insurancePolicy?.type === 'Многолетнее КАСКО') {
        credit.insurancePolicy.cascoTariff = 'Классика 25'
        credit.insurancePolicy.drivingExperience = '5'
      }
    }

    if (credit.typeCredit !== 'Кредитные карты' && credit.typeCredit !== 'АвтоЛизинг физических лиц') {
      if (credit?.parameters?.program.includes('рассрочк')) {
        credit.smsInfoType = null
      } else {
        credit.smsInfoType = credit.smsInfoType ?? (faker.randomChoice() ? 'Базовое' : 'Расширенное с ДБО')
      }
    }
    await this.dataForSubsidy(credit)
    if (credit?.goldKeyCard?.tariff === 'Золотой ключ ДМС Лайт Премиум, тариф 19999') {
      credit.goldKeyCard.term = credit.goldKeyCard.term ?? '3'
    }
    if (
      credit?.insurancePolicy?.type === 'EGAP' ||
      credit?.insurancePolicy?.type === 'КАСКО в подарок' ||
      credit?.insurancePolicy?.type === 'DELETED'
    ) {
      credit.auto.carPower = '100'
    }
    return credit
  }

  async dataForSubsidy(credit) {
    if (credit?.auto?.stateSubsidy) {
      credit.auto.pts.vin = 'XTA8BCDR8A2HT2757'
    }
    if (credit?.auto?.stateSubsidy === 'Электромобиль') {
      credit.auto.pts.vin = 'EAN11135469879879'
    }
    if (credit?.auto?.stateSubsidy === 'Семейный автомобиль') {
      let childBirthday = new Date()
      childBirthday.setDate(childBirthday.getDate() - 1)
      credit.auto.childBirthday = childBirthday.toLocaleDateString('ru-RU')
    }
    if (credit?.auto?.stateSubsidy === 'Автомобиль в Trade-in') {
      let dateTradeInCarRelease = new Date()
      dateTradeInCarRelease.setFullYear(dateTradeInCarRelease.getFullYear() - 6)
      credit.auto.carSubsidy.dateTradeInCarRelease = dateTradeInCarRelease.toLocaleDateString('ru-RU')
      let yearTradeInCarRelease = credit.auto.carSubsidy.dateTradeInCarRelease.split('.')
      credit.auto.carSubsidy.yearTradeInCarRelease = yearTradeInCarRelease[2]
    }
  }
}

module.exports = GenerateCreditData
