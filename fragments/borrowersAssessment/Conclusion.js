const { I } = inject()
/**
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_заявки.Заключение}.
 * FormName: Заключение (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_заявки.Заключение)
 */
class Conclusion {
  #page = '//*[@data-control-name="Рамка_Заключение_МОК"]'
  #conclusion = `${this.#page}//*[@data-control-name="Решение_по_заявке"]//input`
  #comment = `${this.#page}//*[@data-control-name="Комментарий_к_решению"]//textarea`
  /**
   * Метод заполнения блока "4. Заключение"
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async fillPageFragment(credit) {
    await I.cClickFillList(this.#conclusion, credit.decision)
    if (credit.comment) {
      await I.cFillField(this.#comment, credit.comment)
    }
  }
}

module.exports = { Conclusion }
