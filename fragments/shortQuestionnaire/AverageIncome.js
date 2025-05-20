const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Доходы.Доход_предварительная_анкета}.
 * SubForm: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Доходы.Доход_предварительная_анкета
 */
class AverageIncome {
  #averageIncome =
    '//*[@data-control-name="Среднемесячный_доход"]//*[@data-control-name="Доход_предварительная_анкета_1"]//input'
  /**
   * Заполнение блока "Среднемесячный доход"
   */
  async fillPageFragment(client) {
    await I.cFillField(this.#averageIncome, client.incomeAndExpenses.mainIncome)
  }
}

module.exports = { AverageIncome }
