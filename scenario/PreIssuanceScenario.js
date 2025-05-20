const { MainFormAuto } = require('../pages/MainFormAuto')
const { ChoosingCreditType } = require('../pages/ChoosingCreditType')
const { FullQuestionnaire } = require('../pages/FullQuestionnaire')
const { Authentication } = require('../pages/Authentication')
const { BorrowersAssessment } = require('../pages/BorrowersAssessment')
const { CardDataEntry } = require('../pages/CardDataEntry')
const { TransactionParameters } = require('../pages/TransactionParameters')
const { AttachingScans } = require('../pages/AttachingScans')
const { ApplicationForIssuance } = require('../pages/ApplicationForIssuance')
const { ShortQuestionnaire } = require('../pages/ShortQuestionnaire')
const { PrintedDocuments } = require('../pages/PrintedDocuments')
const { ApplicationForConsiderationCreditCard } = require('../pages/ApplicationForConsiderationCreditCard')
const { ApplicationForScoring } = require('../pages/ApplicationForScoring')
const { ApplicationForConsideration } = require('../pages/ApplicationForConsideration')
const { I } = inject()

class PreIssuanceScenario {
  #goToMainForm = '//*[@data-control-name="Кнопка_Назад"]//*[@class="ui-button-text ui-button-in-line"]'
  /**
   * Сценарий выдачи кредита наличными на покупку авто
   * @param {object} testCase - объект тестовых данных
   */
  async knpa(testCase) {
    tags = '@line'
    const credit = testCase.credit
    const client = testCase.client
    credit.typeCredit = 'Кредит наличными на покупку Авто'
    await new Authentication().login(credit)
    await new MainFormAuto().choseClient(client)
    await new ChoosingCreditType().choseCreditType(credit.typeCredit)
    await new ShortQuestionnaire().generalShortQuestionnaire(client, credit)
    await new BorrowersAssessment().fillPageKNPA(client, credit)
    await new FullQuestionnaire().fillGeneralFullQuestionnaire(client, credit)
    await new ApplicationForIssuance().fillPageKNPA(credit)
    await new TransactionParameters().fillPage(credit)
    await new CardDataEntry().fillPage(credit)
    await new PrintedDocuments().checkDocumentsForKNPA(credit)
    await new AttachingScans().fillPageKNPA()
    I.waitForText('Процесс выдачи кредита завершен', 120)
  }

  /**
   * Оформление Халвы для последующего оформления авторассрочки на выданную халву
   * @param {object} testCase - объект тестовых данных
   */
  async halva(testCase) {
    tags = '@line'
    const credit = testCase.credit
    const client = testCase.client
    credit.typeCredit = 'Кредитные карты'
    await new Authentication().login(credit)
    await new MainFormAuto().choseClient(client)
    await new ChoosingCreditType().choseCreditType(credit.typeCredit)
    await new ShortQuestionnaire().generalShortQuestionnaire(client, credit)
    await new BorrowersAssessment().fillPageCreditCard(client, credit)
    await new FullQuestionnaire().fillGeneralFullQuestionnaire(client, credit)
    await new ApplicationForConsiderationCreditCard().fillPage(credit)
    await new PrintedDocuments().checkDocumentsForCreditCard(credit)
    credit.cardHALVA.existingHalva = true
    I.waitForVisible(this.#goToMainForm, 250)
    I.forceClick(this.#goToMainForm)
  }

  /**
   * Оформление автокредита
   * @param {object} testCase - объект с тестовыми данными
   */
  async autocred(testCase) {
    tags = '@line'
    const credit = testCase.credit
    const client = testCase.client
    credit.typeCredit = 'Автокредитование'
    await new Authentication().login(credit)
    await new MainFormAuto().choseClient(client)
    await new ChoosingCreditType().choseCreditType(credit.typeCredit)
    await new ShortQuestionnaire().generalShortQuestionnaire(client, credit)
    await new ApplicationForScoring().fillApplicationForScoring(client, credit)
    await new FullQuestionnaire().fillGeneralFullQuestionnaire(client, credit)
    await new ApplicationForConsideration().fillGeneralApplicationForConsideration(credit)
    await new ApplicationForIssuance().fillPageAuto(credit)
    await new TransactionParameters().fillPage(credit)
    await new CardDataEntry().fillPage(credit)
    await new PrintedDocuments().checkDocumentsForAutocredit(credit)
    await new AttachingScans().fillPage(credit)
    I.waitForEnabled(this.#goToMainForm, 60)
    I.forceClick(this.#goToMainForm)
  }
}

module.exports = { PreIssuanceScenario }
