const ElementBuilder = require('../../helpers/ElementBuilder')
const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Контактная_информация.Контактная_информация}.
 * FormName: Контактная_информация (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Контактная_информация.Контактная_информация)
 */
class ContactInformation {
  #fragment = '//*[@data-control-name="Контактная_информация"]'
  #subFragment = '//*[@data-control-name="Дополнительный_1"]'
  #homePhone = `${this.#fragment}//*[@data-control-name="Домашний"]//*[@data-control-name="Поле_ввода_с_шаблоном_Телефон"]//input`
  #spouseMobilePhone = `${this.#fragment}//*[@data-control-name="Супруга"]//*[@data-control-name="Поле_ввода_с_шаблоном_Телефон"]//input`
  #jobPhone = `${this.#fragment}//*[@data-control-name="Рабочий"]//*[@data-control-name="Поле_ввода_с_шаблоном_Телефон"]//input`

  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#fragment, this.#subFragment).element(element, type)
    return locate
  }
  /**
   * Заполнение блока Контактная информация
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    if (client.contact.homePhone) {
      await I.cFillField(this.#homePhone, client.contact.homePhone)
    }
    if (client.maritalStatus === 'Гражданский брак' || client.maritalStatus === 'Замужем / Женат') {
      await I.cFillField(this.#spouseMobilePhone, client.spouse.mobilePhone)
    }
    if (client.otherPersonalInformation.socialStatus !== 'Пенсионер') {
      await I.cFillField(this.#jobPhone, client.placeOfWork.jobPhone)
    }
    await I.wait(2)
    await I.cFillField(await this.#element('Поле_ввода_с_шаблоном_Телефон'), client.thirdPerson.phoneNumber)
    await I.cFillField(await this.#element('Чей'), client.thirdPerson.typeOfDating)
    await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Фамилия'), client.thirdPerson.surname)
    await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Имя'), client.thirdPerson.firstName)
    await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Отчество'), client.thirdPerson.patronymic)
  }
}

module.exports = { ContactInformation }
