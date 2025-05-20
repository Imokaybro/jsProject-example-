const { I } = inject()

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_заявки.Покупка_ТК}.
 * FormName: Покупка_ТК (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_заявки.Покупка_ТК)
 */
class Purchase {
  #pageFragmentLocate = '//*[@data-control-name="Рамка_покупка"]'
  #modalWindow = '//*[@data-control-name="Всплывающее_окно_Изменить"]'
  #buttonSave = `${this.#modalWindow}//*[@data-control-name="Кнопка_Изменить_Сохранить"]//*[@class="ui-button-text ui-button-in-line"]`
  #buttonAddPurchase = `${this.#pageFragmentLocate}//*[@data-name="Добавить"]`
  #nameOfType = `${this.#modalWindow}//*[@data-control-name="Раскрывающийся_список_Группа_товара"]//*[@class="dropdown-trigger unselectable"]`
  #type = `${this.#modalWindow}//*[@data-control-name="Раскрывающийся_список_Вид_товара"]//*[@class="dropdown-trigger unselectable"]`
  #requisites = `${this.#modalWindow}//*[@data-control-name="Раскрывающийся_список_Реквизиты_банка"]//*[@class="dropdown-trigger unselectable"]`
  #cost = `${this.#modalWindow}//*[@data-control-name="Поле_ввода_суммы_Стоимость"]//input`
  /**
   * Метод добавления товара для типа кредита "Товарный кредит"(вызов модального окна)
   * @param {Object} product - объект тестовых данных товара(например, credit.purchaseOfGoods)
   */
  async addPurchase(product) {
    await I.cForceClick(this.#buttonAddPurchase)
    await I.cClickFillList(this.#nameOfType, product.creditType)
    await I.cClickFillList(this.#type, product.productType)
    await I.cClickFillList(this.#requisites, product.requisites)
    await I.cFillField(this.#cost, product.cost)
    I.waitForVisible("//*[@data-control-name='Надпись_Реквизиты']//*[text()[contains(.,'Получатель')]]")
    I.wait(1)
    await I.cClick(this.#buttonSave)
  }
  /**
   * Метод добавления товара для типа кредита "Товарный кредит"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageFragment(credit) {
    if (credit.purchaseOfGoods) {
      await this.addPurchase(credit.purchaseOfGoods)
    }
    if (credit.purchaseCASCO) {
      await this.addPurchase(credit.purchaseCASCO)
    }
    if (credit.purchaseOfService) {
      await this.addPurchase(credit.purchaseOfService)
    }
    if (credit.additionalPurchase) {
      await this.addPurchase(credit.additionalPurchase)
    }
    if (credit.anotherPurchase) {
      await this.addPurchase(credit.anotherPurchase)
    }
  }
}

module.exports = { Purchase }
