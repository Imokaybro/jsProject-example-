const { Fias } = require('../fias/Fias')
const { I } = inject()

/**
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_регистрации
 */
class AddressOfRegistration extends Fias {
  /**
   * @param {String} formLocate waits for the input name of sub form date-control-form.
   * [@data-control-name="${formLocate}"]
   */
  constructor() {
    super('Адрес_регистрации')
    this.dateOfRegistration =
      '//*[@data-control-name="Адрес_регистрации"]//*[@data-control-name="Дата_регистрации"]//input'
  }

  async fillAddressOfRegistration(client) {
    await this.fillPageFragment(client.address.addressOfRegistration)
    await I.cFillField(this.dateOfRegistration, client.address.dateOfRegistration)
  }
}

module.exports = { AddressOfRegistration }
