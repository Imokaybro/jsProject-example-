const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Данные_о_семье.Семейное_положение}.
 * SubFormName: Семейное_положение (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Данные_о_семье.Семейное_положение)
 */
class MaritalStatus {
  constructor(client) {
    const formLocate = '//*[@data-control-name="Семейное_положение"]'
    //Радиобаттоны
    this.maritalStatus = `${formLocate}//span[text()="${client.maritalStatus}"]/..//*[@class="radiobutton"]`
    //Поля
    this.spouseSurname = `${formLocate}//*[@data-control-name="Поле_ввода_Фамилия"]//input`
    this.spouseFirstName = `${formLocate}//*[@data-control-name="Поле_ввода_Имя"]//input`
    this.spousePatronymic = `${formLocate}//*[@data-control-name="Поле_ввода_Отчество"]//input`
    this.spouseDateOfBirth = `${formLocate}//*[@data-control-name="Дата_Дата_рождения"]//input`
    this.spousePlaceOfBirth = `${formLocate}//*[@data-control-name="Поле_ввода_Место_рождения"]//input`
  }
  /**
   * Заполнение блока Семейное положение
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    await I.cClick(this.maritalStatus)
    if (client.maritalStatus === 'Гражданский брак' || client.maritalStatus === 'Замужем / Женат') {
      await I.cFillField(this.spouseSurname, client.spouse.surname)
      await I.cFillField(this.spouseFirstName, client.spouse.firstName)
      await I.cFillField(this.spousePatronymic, client.spouse.patronymic)
      await I.cFillField(this.spouseDateOfBirth, client.spouse.dateOfBirth)
      await I.cFillField(this.spousePlaceOfBirth, client.spouse.placeOfBirth)
    }
  }
}

module.exports = { MaritalStatus }
