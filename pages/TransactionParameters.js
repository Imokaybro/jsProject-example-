const { ConfirmationOfInvoices } = require('../fragments/ConfirmationOfInvoices')
const CheckConfirmationOfInvoices = require('../fragments/negativeChecks/CheckConfirmationOfInvoices')
const { TransitionDecisionOnApplication } = require('../fragments/transition/TransitionDecisionOnApplication')
const { TransitionTransactionParameters } = require('../fragments/transition/TransitionTransactionParameters')
const { I } = inject()

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Результат_ответа_диспетчерской}.
 * FormName: Результат_ответа_системы (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Результат_ответа_диспетчерской)
 */
class TransactionParameters {
  #recipientsAccountProduct =
    "//span[text()='Товар']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  #recipientsAccountCASKO =
    "//span[text()='Полис КАСКО']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"

  /**
   * Метод заполнения этапа "Параметры сделки"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPage(credit) {
    await I.cSay('----------Осуществлен переход на этап: "Параметры сделки"----------')
    if (credit.typeCredit !== 'Кредит наличными на покупку Авто') {
      await new ConfirmationOfInvoices().fillPaymentForCar(credit)
      await new ConfirmationOfInvoices().fillCASKO(credit)
      await new ConfirmationOfInvoices().fillAdditionalService(credit)
      await new ConfirmationOfInvoices().fillVIN(credit)
    }
    await new TransitionTransactionParameters().transaction()
  }
  /**
   * Метод негативных проверок этапа "Параметры сделки"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeCheck(credit) {
    await I.cSay('----------Осуществлен переход на этап: "Параметры сделки"----------')
    await new ConfirmationOfInvoices().fillPaymentForCar(credit)
    await new ConfirmationOfInvoices().fillCASKO(credit)
    await new ConfirmationOfInvoices().fillAdditionalService(credit)
    await new ConfirmationOfInvoices().fillVIN(credit)
    await new CheckConfirmationOfInvoices().check()
  }
  /**
   * Заполнение этапа "Решение по заявке" для Товарного кредита
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async fillDecisionOnTheApplication(credit) {
    const answerFromDess = await tryTo(() => I.waitForText('Заявка на выдачу кредита - одобрена', 250))
    if (!answerFromDess) {
      I.waitForText('Идет обработка...', 2)
      I.refreshPage()
      I.wait(5)
      I.waitForText('Заявка на выдачу кредита - одобрена', 5)
    }
    await I.cSay('----------Осуществлен переход на этап: "Решение по заявке"----------')
    await I.cFillField(
      this.#recipientsAccountProduct,
      credit.purchaseOfGoods.requisites.substr(credit.purchaseOfGoods.requisites.length - 5),
    )
    if (credit.purchaseCASCO) {
      await I.cFillField(
        this.#recipientsAccountCASKO,
        credit.purchaseCASCO.requisites.substr(credit.purchaseCASCO.requisites.length - 5),
      )
    }
    await new TransitionDecisionOnApplication().transition()
  }
}
module.exports = { TransactionParameters }
