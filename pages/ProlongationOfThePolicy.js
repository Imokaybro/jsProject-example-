const { I } = inject()
const { TransitionApplicationForInsurance } = require('../fragments/transition/TransitionApplicationForInsurance')
/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.Формы.Заявка_Пролонгация}.
 * FormName: Заявка на пролонгацию (БанкоDELETEDий_базовый.Пролонгация.Формы.Заявка_Пролонгация)
 */
class ProlongationOfThePolicy {
  #page = '//*[@data-control-name="Рамка_доп_продукты"]'
  #lifeInsurance = `${this.#page}//*[@data-control-name="Таблица_1"]//*[text()[contains(.,'Страхование')]]`
  #loanRepaymentGuarantee = `${this.#page}//*[@data-control-name="Таблица_1"]//*[text()[contains(.,'Гарантия')]]`
  #medicalInsurance = `${this.#page}//*[@data-control-name="Таблица_1"]//*[text()[contains(.,'Добровольное')]]`
  #insuranceCompany = `${this.#page}//*[@data-control-name="Страховая_компания"]//input`
  #insuranceTariff = `${this.#page}//*[@data-control-name="Раскрывающийся_список_Страховой_тариф"]//input`
  #lifeInsuranceTerm = `${this.#page}//*[@data-control-name="рс_Срок"]//input`
  #loanRepaymentTerm = `${this.#page}//*[@data-control-name="Список_сроков"]//input`
  #paymentInvoice = `${this.#page}//*[@data-control-name="Счет_оплаты"]//input`
  #save = `${this.#page}//*[@data-control-name="Кнопка_Сохранить"]//*[@class="ui-button-text ui-button-in-line"]`
  #nextToPF = '//*[text()="Перейти к формированию ПФ"]'
  #paymentMethod = registrationMethod => {
    return `${this.#page}//*[@data-control-name="Группа_переключателей_Способ_оформления_1"]//*[text()='${registrationMethod}']`
  }
  /**
   * Метод заполнения этапа "Заявка на страхование"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPage(credit) {
    await I.cSay('----------Осуществлен переход на этап: "Заявка на страхование"----------')
    if (credit.insuranceProduct.lifeInsurance) {
      await I.cClick(this.#lifeInsurance)
      await I.cClick(this.#paymentMethod(credit.insuranceProduct.registrationMethod))
      await I.cClickFillList(this.#insuranceCompany, credit.insuranceProduct.company)
      await I.cClickFillList(this.#insuranceTariff, credit.insuranceProduct.tariff)
      await I.cClickFillList(this.#lifeInsuranceTerm, credit.insuranceProduct.financialProtectionTerm)
      await I.cClick(this.#save)
    }
    if (credit.insuranceProduct.gpk) {
      await I.cClick(this.#loanRepaymentGuarantee)
      await I.cClick(this.#paymentMethod(credit.insuranceProduct.registrationMethod))
      await I.cClickFillList(this.#loanRepaymentTerm, credit.insuranceProduct.gpkTerm)
      await I.cClick(this.#save)
    }
    if (credit.parameters.program === 'Легкий выбор' && credit.insuranceProduct.dms) {
      await I.cClick(this.#medicalInsurance)
      await I.cClick(this.#paymentMethod(credit.insuranceProduct.registrationMethod))
      await I.cClick(this.#save)
    }
    if (
      credit.insuranceProduct.registrationMethod === 'Оформление за счет заемных средств карты Халва' ||
      credit.insuranceProduct.registrationMethod === 'Оформление за счет собственных средств карты Халва'
    ) {
      await I.cClickFillList(this.#paymentInvoice, 'Халва')
    }
    await I.cClick(this.#nextToPF)
    await new TransitionApplicationForInsurance().transition()
  }
}

module.exports = { ProlongationOfThePolicy }
