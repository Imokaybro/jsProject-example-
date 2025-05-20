const { I } = inject()
const typeOfCASCO = [
  'DELETED',
]

const typeOfService = [
  'DELETED',
]
/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Решение_по_заявке_валидация}.
 * FormName: Решение_по_заявке_валидация (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Решение_по_заявке_валидация)
 */
class ConfirmationOfInvoices {
  #recipientsAccountCASKO =
    '//*[@data-control-name="Рамка_Оплата_за_КАСКО"]//*[@data-control-name="Поле_ввода_с_шаблоном_Счет_получателя_валидация"]//input'
  #recipientsAccountAdditionalService =
    '//*[@data-control-name="Рамка_Оплата_за_дополнительные_услуги_партнеров"]//*[@data-control-name="Поле_ввода_с_шаблоном_Счет_получателя_валидация"]//input'
  #recipientsAccountCar =
    '//*[@data-control-name="Рамка_Оплата_за_автомобиль"]//*[@data-control-name="Поле_ввода_с_шаблоном_Счет_получателя_валидация"]//input'
  #firstThreeCharactersVIN =
    '//*[@data-control-name="Рамка_VIN_автомобиля"]//*[@data-control-name="Поле_ввода_с_шаблоном_VIN_н_валидация"]//input'
  #lastThreeCharactersVIN =
    '//*[@data-control-name="Рамка_VIN_автомобиля"]//*[@data-control-name="Поле_ввода_с_шаблоном_VIN_к_валидация"]//input'
  /**
   * Метод ввода последних 5-ти цифр счета КАСКО
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillCASKO(credit) {
    if (credit.parameters.program !== 'DELETED') {
      if (credit?.insurancePolicy?.type && !typeOfCASCO.includes(credit?.insurancePolicy?.type)) {
        await I.cFillField(
          this.#recipientsAccountCASKO,
          credit.insurancePolicy.requisites.substr(credit.insurancePolicy.requisites.length - 5),
        )
      }
    }
  }

  /**
   * Метод ввода последних 5-ти цифр счета доп. услуг
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillAdditionalService(credit) {
    const type = credit?.additionalServices?.typeOfService
    if (type && !typeOfService.includes(type)) {
      await I.cFillField(
        this.#recipientsAccountAdditionalService,
        credit.additionalServices.requisites.substr(credit.additionalServices.requisites.length - 5),
      )
    }
  }

  /**
   * Метод ввода последних 5-ти цифр счета оплаты за авто
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPaymentForCar(credit) {
    await I.cFillField(
      this.#recipientsAccountCar,
      credit.detailsOfRetailOrganization.substr(credit.detailsOfRetailOrganization.length - 5),
    )
  }

  /**
   * Метод ввода первых 3-х и последних 4-х символов VIN-номера авто
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillVIN(credit) {
    if (credit.auto.pts.vin !== 'Отсутствует') {
      await I.cFillField(this.#firstThreeCharactersVIN, credit.auto.pts.vin.substr(0, 3))
      await I.cFillField(this.#lastThreeCharactersVIN, credit.auto.pts.vin.substr(credit.auto.pts.vin.length - 4))
    }
  }
}
module.exports = { ConfirmationOfInvoices }
