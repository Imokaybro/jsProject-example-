const { I } = inject()
const { LendingScheme } = require('../fragments/applicationMetcomCalculation/LendingScheme')
const { Purchase } = require('../fragments/Purchase')
const { AddClientPhoto } = require('../fragments/AddClientPhoto')
const { TransitionApplicationForIssuance } = require('../fragments/transition/TransitionApplicationForIssuance')

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_ТК_Метком}.
 * FormName: Заявка_ТК_Метком (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_ТК_Метком)
 */
class ApplicationForConsiderationTK {
  #documentPackage =
    '//*[@data-control-name="Группа_переключателей_пакет_документов"]//*[text()="да"]/..//*[@class="radiobutton"]'
  #initialPayment = '//*[@data-control-name="Оплачено_в_кассу"]//input'
  #decision = '//*[@data-control-name="Решение_по_заявке"]//*[@class="dropdown-trigger unselectable"]'
  #financialProtectionCompany =
    '//*[@data-control-name="Страховая_компания"]//*[@class="dropdown-trigger unselectable"]'
  #financialProtectionTariff =
    '//*[@data-control-name="Раскрывающийся_список_Страховой_тариф"]//*[@class="dropdown-trigger unselectable"]'
  #smsInfoType = type =>
    `//*[@data-control-name="Группа_переключателей_смс_информирование"]//*[text()="${type}"]/..//*[@class="radiobutton"]`
  #packageOfDocuments = fullSetOfDocuments =>
    `//*[@data-control-name="Группа_переключателей_пакет_документов"]//*[text()="${fullSetOfDocuments}"]`
  #documentNPD = '//div[text()="Справка о постановке на учет НПД (форма КНД 1122035)"]/..//*[@class="attach-button"]'

  /**
   * Заполнение этапа "Заявка на рассмотрение"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPage(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Заявка на рассмотрение"----------')
    await new LendingScheme().fillPageFragment(credit)
    await new Purchase().fillPageFragment(credit)
    if (credit.financialProtection.company) {
      I.wait(1)
      await I.cClickList(this.#financialProtectionCompany, credit.financialProtection.company)
      I.wait(1)
      await I.cClickList(this.#financialProtectionTariff, credit.financialProtection.tariff)
      I.wait(1)
    }
    await I.cFillField(this.#initialPayment, credit.paymentToCashier)
    await I.cClick(this.#documentPackage)
    await I.cClick(this.#smsInfoType(credit.smsInfoType))
    if (credit.fullSetOfDocuments) {
      await I.cClick(this.#packageOfDocuments(credit.fullSetOfDocuments))
    }
    await new AddClientPhoto().takePicture()
    await I.cClickFillList(this.#decision, credit.decision)
    if (client.otherPersonalInformation.socialStatus === 'Самозанятость') {
      await I.scanDocumentLoad(this.#documentNPD)
    }
    await new TransitionApplicationForIssuance().transitionCommodityCredit()
  }
}

module.exports = { ApplicationForConsiderationTK }
