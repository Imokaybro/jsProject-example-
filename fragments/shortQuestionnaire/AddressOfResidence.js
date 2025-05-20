const { I } = inject()
const { Fias } = require('../fias/Fias')

/**
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_фактический
 */
class AddressOfResidence extends Fias {
  /**
   * @param {String} formLocate waits for the input name of sub form date-control-form.
   * [@data-control-name="${formLocate}"]
   */
  constructor() {
    super('Адрес_фактический')
    this.addressMatch = '//*[@data-control-name="Совпадение_адресов"]//*[@class="checkbox"]'
    this.dateBeginningLife =
      '//*[@data-control-name="Адрес_фактический"]//*[@data-control-name="Дата_начала_проживания"]//input'
  }

  async fillAddressOfResidence(client) {
    if (
      // проверка на одинаковость адресов фактического проживания и регистрации
      JSON.stringify(client.address.addressOfResidence) === JSON.stringify(client.address.addressOfRegistration)
    ) {
      await I.cCheckOption(this.addressMatch)
    } else {
      await I.cUnCheckOption(this.addressMatch)
      await this.fillPageFragment(client.address.addressOfResidence)
      await I.cFillField(this.dateBeginningLife, client.address.dateBeginningLife)
    }
  }
}

module.exports = { AddressOfResidence }
