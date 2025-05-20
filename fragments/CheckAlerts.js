const { I } = inject()
const creditProgramArray = [
  'DELETED',
]

const typeOfServiceArray = [
  'DELETED)',
]
/**
 * Проверка всех всплывающий уведомлений и алертов
 */
class CheckAlerts {
  #closePopUpWindow = '//*[contains(@class, "dialog-active")]//*[@class="ui-dialog-titlebar-close"]'
  /**
   * Всплывающие уведомления об условиях оформления программы для автокредита на этапе "Заявка на рассмотрении"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async applicationForConsideration(credit) {
    await this.installmentPlan(credit)
    await this.discountOnCars(credit)
    await this.noDiscountOnCars(credit)
    if (
      !credit.parameters.program.includes('рассрочк') &&
      !creditProgramArray.includes(credit.parameters.program) &&
      credit.typeCredit != 'АвтоЛизинг физических лиц'
    ) {
      if ((credit.auto.marka === 'DELETED' || credit.auto.marka === 'DELETED') && credit.auto.status === 'Новый') {
        I.waitForText('Отметьте предоставляется ли на автомобиль скидка по программе DELETED.', 180)
        I.pressKey('Escape')
      }
    }
  }
  /**
   * Всплывающие уведомления об условиях оформления программы для автокредита на этапе "Заявка на выдачу"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async applicationForIssuance(credit) {
    await this.installmentPlan(credit)
    await this.discountOnCars(credit)
    await this.noDiscountOnCars(credit)
    await this.gpk(credit)
  }
  /**
   * Всплывающие уведомления при добавлении дополнительных услуг
   * @param {Object} credit - объект тестовых данных кредита
   */
  async addAdditionalServices(credit) {
    if (typeOfServiceArray.includes(credit?.additionalServices?.typeOfService)) {
      I.waitForText('Для выбранной услуги разрешенная максимальная масса ТС не больше 3500', 30)
      await I.cClick(this.#closePopUpWindow)
    }
  }

  /**
   * Закрытие уведомления по авторассрочке
   * @param {Object} credit - объект с тестовыми данными клиента
   */
  async installmentPlan(credit) {
    if (credit.parameters.program.includes('рассрочк')) {
      I.waitForText('ВНИМАНИЕ! Убедись, что оформляешь по Авторассрочке субсидируемый автомобиль!', 30)
      I.pressKey('Escape')
    }
  }

  /**
   * Закрытие уведомления по схеме KIA Finance Indirect
   * @param {Object} credit - объект с тестовыми данными клиента
   */
  async discountOnCars(credit) {
    if (credit.parameters.program === 'DELETED') {
      I.waitForText('ВНИМАНИЕ! По данной программе оформляются только автомобили со скидкой!', 180)
      I.pressKey('Escape')
    }
  }

  /**
   * Закрытие уведомления по автомобилям без скидки
   * @param {Object} credit - объект с тестовыми данными клиента
   */
  async noDiscountOnCars(credit) {
    if (
      credit.parameters.program === 'DELETED' ||
      (credit.parameters.program === 'DELETED' && credit.auto.marka === 'KIA')
    ) {
      I.waitForText('ВНИМАНИЕ! По данной программе оформляются только автомобили без скидки!', 180)
      I.pressKey('Escape')
    }
  }

  /**
   * Закрытие уведомления по услуге Гарантия погашения кредита
   * @param {Object} credit - объект с тестовыми данными клиента
   */
  async gpk(credit) {
    if (credit?.additionalServices?.typeOfService === 'DELETED') {
      I.waitForText('Для услуги ГПК первоначальный взнос DELETED%', 180)
      await I.cClick(this.#closePopUpWindow)
    }
  }
}

module.exports = { CheckAlerts }
