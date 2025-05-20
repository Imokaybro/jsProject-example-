const { CardData } = require('../fragments/applicationForConsiderationCreditCard/CardData')
const {
  LendingSchemeCreditCard,
} = require('../fragments/applicationForConsiderationCreditCard/LendingSchemeCreditCard')
const { RBSError } = require('../fragments/RBSError')
const { AddClientPhoto } = require('../fragments/AddClientPhoto')
const { I } = inject()
const { TransitionApplicationForIssuance } = require('../fragments/transition/TransitionApplicationForIssuance')

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Кредитные_карты.Заявка_кредитные_карты}.
 * FormName: Заявка (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Кредитные_карты.Заявка_кредитные_карты)
 */
class ApplicationForConsiderationCreditCard {
  constructor() {
    this.decision = '//*[@data-control-name="Решение_по_заявке"]//input'
    this.comment = '//*[@data-control-name="Комментарий_к_решению"]//textarea'
    this.smsDidntCome =
      '//*[@data-control-name="Вид_проверки_мобильного_Прочее"]//*[text()="SMS - сообщение с проверочным кодом не пришло"]/..//*[@class="radiobutton"]'
  }

  /**
   * Заполнение этапа "Заявка на выдачу кредитных карт"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPage(credit) {
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Заявка на выдачу кредитных карт"----------')
    await new LendingSchemeCreditCard().fillPageFragment(credit)
    await new CardData().fillPageFragment(credit)
    await new AddClientPhoto().takePicture()
    await I.cClickFillList(this.decision, credit.decision)
    await I.cFillField(this.comment, credit.comment)
    I.wait(5)
    await I.cClick(this.smsDidntCome)
    await new TransitionApplicationForIssuance().transitionCreditCard(credit)
  }
}

module.exports = { ApplicationForConsiderationCreditCard }
