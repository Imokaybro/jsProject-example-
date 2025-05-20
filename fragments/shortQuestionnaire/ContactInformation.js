const ElementBuilder = require('../../helpers/ElementBuilder')

const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Контактная_информация.Контактная_информация_предварительная_анкета}.
 * SubForm: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Контактная_информация.Контактная_информация_предварительная_анкета
 */
class ContactInformation {
  #fragment = '//*[@data-control-name="Контактная_информация_предварительная_анкета_1"]'
  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#fragment).element(element, type)
    return locate
  }

  /**
   * Заполнение данных контактной информации
   */
  async fillPageFragment(client) {
    await I.cFillField(await this.#element('Мобильный_Телефон'), client.contact.mobilePhone)
    if (client.contact.homePhone) {
      await I.cFillField(await this.#element('Домашний_Телефон'), client.contact.homePhone)
    }
  }
}

module.exports = { ContactInformation }
