const { I } = inject()
/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Другие_сведения.Другие_сведения_основная_форма}.
 * SubFormName: Другие_сведения_основная_форма (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Другие_сведения.Другие_сведения_основная_форма)
 */
class OtherInformation {
  #form = '//*[@data-control-name="Другие_сведения"]'
  #foundAboutDepartment = `${this.#form}//*[@data-control-name="Раскрывающийся_список_Откуда_узнали_об_отделении"]//input`
  #foundAboutBank = `${this.#form}//*[@data-control-name="Раскрывающийся_список_Откуда_узнали_о_банке"]//input`
  /**
   * Заполнение блока Другие сведения
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageFragment(credit) {
    if (credit.typeCredit === 'Кредитные карты') {
      await I.cClickFillList(this.#foundAboutDepartment, 'Интернет')
      await I.cClickFillList(this.#foundAboutBank, 'Интернет')
    }
  }
}

module.exports = { OtherInformation }
