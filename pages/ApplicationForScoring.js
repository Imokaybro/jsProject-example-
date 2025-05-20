const { I } = inject()
const { ApplicationParameters } = require('../fragments/applicationForScoring/ApplicationParameters')
const { ChoosingAutoHalvaCard } = require('../fragments/applicationForScoring/ChoosingAutoHalvaCard')
const { Conclusion } = require('../fragments/applicationForScoring/Conclusion')
const { MinimumRequirements } = require('../fragments/minimumRequirements/MinimumRequirements')
const CheckApplicationForScoring = require('../fragments/negativeChecks/CheckApplicationForScoring')
const { TransitionApplicationForScoring } = require('../fragments/transition/TransitionApplicationForScoring')

/**
 * @param {Object} client - объект тестовых данных клиента
 * @param {Object} credit - данные кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Заявка_оценка_заемщика}.
 * FormName: Заявка оценка заемщика (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Заявка_оценка_заемщика)
 */
class ApplicationForScoring {
  #documentQuestionnaire = "//div[text()='Анкета']/..//*[@class='attach-button']"
  #documentPassport = "//div[text()='Справка о действительности паспорта']/..//*[@class='attach-button']"

  /**
   * Этап Заявка на скорринг
   */
  async fillApplicationForScoring(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Заявка на скорринг"----------')
    await new ApplicationParameters().fillForAutoCredit(credit)
    await new ChoosingAutoHalvaCard().selectIssuedCard(credit)
    if ((await I.selectSwitchStatus('Минимальные_требования_включено')) === 'да') {
      await new MinimumRequirements().fillPageFragment(client)
    }
    await I.scanDocumentLoad(this.#documentQuestionnaire, 'data/test.jpg')
    await I.scanDocumentLoad(this.#documentPassport, 'data/test.jpg')
    await new Conclusion().decisionOnTheApplication(credit)
    await new TransitionApplicationForScoring().transition()
  }

  async negativeCheckApplicationForScoring(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Заявка на скорринг"----------')
    await new CheckApplicationForScoring().additionalNegativeChecks()
    await new ApplicationParameters().fillForAutoCredit(credit)
    await new ChoosingAutoHalvaCard().selectIssuedCard(credit)
    if ((await I.selectSwitchStatus('Минимальные_требования_включено')) === 'да') {
      await new MinimumRequirements().fillPageFragment(client)
    }
    await new Conclusion().decisionOnTheApplication(credit)
    await new CheckApplicationForScoring().negativeChecks()
  }
}

module.exports = { ApplicationForScoring }
