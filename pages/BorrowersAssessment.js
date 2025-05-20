const { AddingScans } = require('../fragments/borrowersAssessment/AddingScans')
const { Conclusion } = require('../fragments/borrowersAssessment/Conclusion')
const { TransitionBorrowersAssessment } = require('../fragments/transition/TransitionBorrowersAssessment')
const { TransitionApplicationFromAutoCheck } = require('../fragments/transition/TransitionApplicationFromAutoCheck')
const CheckBorrowersAssessment = require('../fragments/negativeChecks/CheckBorrowersAssessment')
const { ApplicationParameters } = require('../fragments/applicationForScoring/ApplicationParameters')
const { I } = inject()

/**
 * Форма "Оценка заемщика"
 * @param {Object} client - объект тестовых данных клиента
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Заявка_оценка_заемщика}.
 * FormName: Заявка оценка заемщика (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Заявка_оценка_заемщика)
 */
class BorrowersAssessment {
  /**
   * Заполнение этапа "Оценка заемщика" для кредитных карт
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageCreditCard(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForCreditCard(client, credit)
    await new AddingScans().fillPageFragmentCreditCard()
    await new Conclusion().fillPageFragment(credit)
    await new TransitionBorrowersAssessment().transition()
  }
  /**
   * Заполнение этапа "Оценка заемщика" для КНПА
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageKNPA(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForKNPA(client, credit)
    await new AddingScans().fillPageFragment()
    await new Conclusion().fillPageFragment(credit)
    await new TransitionBorrowersAssessment().transition()
  }
  /**
   * Негативные проверки этапа "Оценка заемщика" для КНПА
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeCheckKNPA(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForKNPA(client, credit)
    await new AddingScans().fillPageFragment()
    await new Conclusion().fillPageFragment(credit)
    await new CheckBorrowersAssessment().forKNPA()
  }
  /**
   * Заполнение этапа "Оценка заемщика" для кредитных карт с негативными проверками
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeCheckCreditCard(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForCreditCard(client, credit)
    await new AddingScans().fillPageFragmentCreditCard()
    await new Conclusion().fillPageFragment(credit)
    await new CheckBorrowersAssessment().forCreditCard()
  }
  /**
   * Заполнение этапа "Заявка на автоматическую проверку" для товарного кредита
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageCommodityCredit(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForCommodityCredit(client, credit)
    await new AddingScans().fillPageFragment()
    await new Conclusion().fillPageFragment(credit)
    await new TransitionApplicationFromAutoCheck().transition()
  }
  /**
   * Заполнение этапа "Оценка заемщика" для товарного кредита с негативными проверками
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeCheckCommodityCredit(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Оценка заемщика"----------')
    await new ApplicationParameters().fillForCommodityCredit(client, credit)
    await new AddingScans().fillPageFragment()
    await new Conclusion().fillPageFragment(credit)
    await new CheckBorrowersAssessment().forCommodityCredit()
  }
}

module.exports = { BorrowersAssessment }
