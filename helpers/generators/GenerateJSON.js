const postAgreementJSON = require('../json/eCredit/postAgreement.json')
const card = require('../json/eCredit/card.json')
const casco = require('../json/eCredit/casco.json')
const dms = require('../json/eCredit/dms.json')
const financialProtection = require('../json/eCredit/financialProtection.json')
const finGAPDealer = require('../json/eCredit/finGAPDealer.json')
const gap = require('../json/eCredit/gap.json')
const gapDealer = require('../json/eCredit/gapDealer.json')
const gapRESOWarranty = require('../json/eCredit/gapRESOWarranty.json')
const gms = require('../json/eCredit/gms.json')
const personalInsurance = require('../json/eCredit/personalInsurance.json')
const pvp = require('../json/eCredit/pvp.json')
const roadsideAssistanceCards = require('../json/eCredit/roadsideAssistanceCards.json')
const setYourBet = require('../json/eCredit/setYourBet.json')
const specialProducts = require('../json/eCredit/specialProducts.json')
const subsidy = require('../json/eCredit/subsidy.json')
const cardRAT = require('../json/eCredit/cardRAT.json')
const FakeCreditData = require('../fakers/FakeCreditData')
const lossOfIncome = require('../json/eCredit/lossOfIncome.json')
const additionalEquipment = require('../json/eCredit/additionalEquipment.json')
const { I } = inject()

class GenerateJSON {
  /**
   * Формирование PostAgreement запроса
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns JSON - объект для запроса к сервису
   */
  async postAgreement(credit) {
    const faker = new FakeCreditData()
    const json = postAgreementJSON
    json.applicationId = credit.reqID
    json.applicationInfo.partnerId = credit.fisClientId
    json.applicationInfo.organizationProperty.bic = credit.bic
    json.applicationInfo.organizationProperty.checkingAccount = credit.checkingAccount
    json.dealCost.amount = credit.parameters.cost
    json.creditInfo.product = credit.schemeId
    json.creditInfo.period = credit.parameters.term
    json.creditInfo.downPayment = credit.parameters.initialPayment
    if (credit.parameters?.residualPayment?.amount) {
      json.creditInfo.residualPaymentValue = credit.parameters.residualPayment.amount
    }
    json.vehicleInfo[0].vehicleType = credit.auto.status
    json.vehicleInfo[0].mileage = credit.auto.millage
    json.vehicleInfo[0].brand = credit.auto.marka
    json.vehicleInfo[0].model = credit.auto.model
    json.vehicleInfo[0].constructionYear = credit.auto.yearOfRelease
    let vin = await I.selectFromDataBase('validVin.sql', credit.parameters.program)
    if (!vin.rows[0]) {
      json.vehicleInfo[0].vin = credit.auto?.pts?.vin ?? faker.vin()
    } else {
      json.vehicleInfo[0].vin = vin.rows[0][0]
    }
    const cardProducts = await this.cardsArray(credit)
    const insuranceList = await this.additionalServices(credit)
    const optionalEquipment = await this.additionalEquipmentList(credit)
    if (cardProducts.length) {
      json.cardProducts = cardProducts
    }
    if (insuranceList.length) {
      json.insuranceList = insuranceList
    }
    if (optionalEquipment.length) {
      json.optionalEquipment = optionalEquipment
    }
    return json
  }

  /**
   * Получение данных карты
   * @param {String} type - тип карты
   * @returns JSON - объект для вставки в cardProducts
   */
  async card(type) {
    const json = card
    json.type = type
    let cardId
    if (type === 'АвтоХалва') {
      cardId = '1007'
    } else if (type === 'ZK') {
      cardId = '1003'
    }
    let cardArrayHalva = await I.grabCardData(cardId)
    const cardNumber = cardArrayHalva[0]
    const cardHash = cardArrayHalva[2]

    //Срок действия карты
    let date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    date = date.toLocaleDateString('ru')
    date = date.split('.')
    date = `${date[2]}-${date[1]}`

    json.cardValidUntil = date
    json.cardHash = cardHash
    json.cardNumber = cardNumber
    return json
  }

  /**
   * Добавление в массив ранее полученных карт
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns ARRAY - возвращает массив с картами
   */
  async cardsArray(credit) {
    const cardProducts = []
    if (credit?.cardHALVA?.card) {
      const halva = await this.card('АвтоХалва')
      cardProducts.push(halva)
    }
    if (credit?.goldKeyCard?.card) {
      const goldKey = await this.card('ZK')
      cardProducts.push(goldKey)
    }
    return cardProducts
  }

  /**
   * Добавление в PostAgreement запрос необходимых доп. услуг
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns ARRAY - возвращает массив с дополнительными услугами
   */
  async additionalServices(credit) {
    const insuranceList = []
    if (credit?.additionalServices?.length) {
      if (
        credit.additionalServices.includes('КАСКО дилер') ||
        credit.additionalServices.includes('КАСКО за наличные') ||
        credit.additionalServices.includes('EGAP')
      ) {
        const json = casco
        const formatter = new Intl.DateTimeFormat('SE', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
        json.policyStart = formatter.format(new Date())
        json.policyEnd = formatter.format(new Date().setDate(364))

        if (credit.additionalServices.includes('КАСКО дилер')) {
          json.type = 'КАСКО'
          json.paymentType = 'ЗАналичные'
          json.company.insurerId = '5'
          json.company.type = 'БанкоDELETEDая'
        }
        if (credit.additionalServices.includes('КАСКО за наличные')) {
          json.type = 'КАСКО'
          json.paymentType = 'ВКредит'
          json.company.insurerId = '5'
          json.company.type = 'БанкоDELETEDая'
        }
        if (credit.additionalServices.includes('EGAP')) {
          json.type = 'КАСКО'
          json.paymentType = 'ВКредит'
          json.company.insurerId = '19'
          json.company.type = 'БанкоDELETEDая'
          json.recipientProperty = {
            bic: '045004763',
            checkingAccount: '47422810450160048509',
            paymentPurpose: 'НДС Назначение платежа',
            VAT: true,
          }
        }
        insuranceList.push(json)
      }
      if (credit.additionalServices.includes('Личное страхование')) {
        insuranceList.push(personalInsurance)
      }
      if (credit.additionalServices.includes('ФЗ (техническое)')) {
        insuranceList.push(financialProtection)
      }
      if (credit.additionalServices.includes('ДМС')) {
        insuranceList.push(dms)
      }
      if (credit.additionalServices.includes('GAP-страхование')) {
        insuranceList.push(gap)
      }
      if (credit.additionalServices.includes('GAP-страхование(дилерское)')) {
        insuranceList.push(gapDealer)
      }
      if (credit.additionalServices.includes('Карты помощи на дорогах')) {
        insuranceList.push(roadsideAssistanceCards)
      }
      if (credit.additionalServices.includes('Финансовый GAP РЕСО-Гарантия')) {
        insuranceList.push(gapRESOWarranty)
      }
      if (credit.additionalServices.includes('ФинGAP (диллерское)')) {
        insuranceList.push(finGAPDealer)
      }
      if (credit.additionalServices.includes('СпецДопПродукты (дилерское)')) {
        insuranceList.push(specialProducts)
      }
      if (credit.additionalServices.includes('Субсидия')) {
        insuranceList.push(subsidy)
      }
      if (credit.additionalServices.includes('Гарантия минимальной ставки')) {
        insuranceList.push(gms)
      }
      if (credit.additionalServices.includes('Назначь свою ставку')) {
        insuranceList.push(setYourBet)
      }
      if (credit.additionalServices.includes('Платежи в подарок')) {
        insuranceList.push(pvp)
      }
      if (credit.additionalServices.includes('Снижение ставки на 11,8%')) {
        const nss = {}
        nss.type = 'NSS'
        nss.paymentType = 'ВКредит'
        nss.company = {
          type: 'Снижение_ставки_на_11_8',
        }
        insuranceList.push(nss)
      }
      if (credit.additionalServices.includes('Потеря дохода')) {
        insuranceList.push(lossOfIncome)
      }
      if (credit.additionalServices.includes('Карта РАТ')) {
        insuranceList.push(cardRAT)
      }
      if (tags.includes('@251319')) {
        insuranceList.push(lossOfIncome)
      }
      if (tags.includes('@251314')) {
        lossOfIncome.period = 3
        insuranceList.push(lossOfIncome)
      }
      if (tags.includes('@251313')) {
        lossOfIncome.period = 0
        insuranceList.push(lossOfIncome)
      }
    }
    return insuranceList
  }

  /**
   * Добавление в PostAgreement запрос необходимого доп. оборудования
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns ARRAY - возвращает массив с дополнительным оборудованием
   */

  async additionalEquipmentList(credit) {
    const optionalEquipment = []
    const listOfAdditionalEquipment = [
      'Вебаста',
      'Фаркоп',
      'Прочее доп.оборудование',
      'Крепления багажника',
      'Рейлинги на крышу',
    ]

    credit.additionalServices.forEach(item => {
      if (listOfAdditionalEquipment.includes(item)) {
        let copyAdditionalEquipment = {
          ...additionalEquipment,
          equipmentType: item,
        }
        optionalEquipment.push(copyAdditionalEquipment)
      }
    })
    return optionalEquipment
  }
}
module.exports = GenerateJSON
