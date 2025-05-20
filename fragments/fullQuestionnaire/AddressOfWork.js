const { Fias } = require('../fias/Fias')

/**
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_регистрации
 */
class AddressOfWork extends Fias {
  /**
   * @param {String} formLocate waits for the input name of sub form date-control-form.
   * [@data-control-name="${formLocate}"]
   */
  constructor() {
    super('Место_работы')
  }

  async fillAddressOfWork(client) {
    await this.fillPageFragment(client.placeOfWork.address)
  }
}

module.exports = { AddressOfWork }
