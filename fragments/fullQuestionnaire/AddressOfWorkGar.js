const GarError = require('../../helpers/GarError')
const { Gar } = require('../fias/Gar')

/**
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_регистрации
 */
class AddressOfWorkGar extends Gar {
  /**
   * @param {String} formLocate waits for the input name of sub form date-control-form.
   * [@data-control-name="${formLocate}"]
   */
  constructor() {
    super('Место_работы')
  }

  async fillAddressOfWorkGar(client) {
    if (!(await this.checkedVisibleGarBlock())) {
      await this.fillPageFragment(client.placeOfWork.address)
      await new GarError().checkGar('Место_работы')
    }
  }
}

module.exports = { AddressOfWorkGar }
