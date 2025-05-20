const GarError = require('../../helpers/GarError')
const { Gar } = require('../fias/Gar')
const { I } = inject()

/**
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_регистрации
 */
class AddressOfRegistrationGar extends Gar {
  /**
   * @param {String} formLocate waits for the input name of sub form date-control-form.
   * [@data-control-name="${formLocate}"]
   */
  constructor() {
    super('Адрес_регистрации')
    this.dateOfRegistration =
      '//*[@data-control-name="Адрес_регистрации"]//*[@data-control-name="Дата_регистрации"]//input'
  }

  async fillAddressOfRegistrationGar(client) {
    if (!(await this.checkedVisibleGarBlock())) {
      await this.fillPageFragment(client.address.addressOfRegistration)
    }
    await I.cFillField(this.dateOfRegistration, client.address.dateOfRegistration)
    await new GarError().checkGar('Адрес_регистрации')
  }
}

module.exports = { AddressOfRegistrationGar }
