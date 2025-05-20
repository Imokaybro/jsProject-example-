const { AddressOfRegistration } = require('../../fragments/shortQuestionnaire/AddressOfRegistration')
const { AddressOfRegistrationGar } = require('../../fragments/shortQuestionnaire/AddressOfRegistrationGar')
const { AddressOfResidence } = require('../../fragments/shortQuestionnaire/AddressOfResidence')
const { AddressOfResidenceGar } = require('../../fragments/shortQuestionnaire/AddressOfResidenceGar')
const { I } = inject()

/**
 * Заполнение адресов клиента
 *
 * FormName: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит
 * qname: Адрес_регистрации - AddressOfRegistrationGar && AddressOfRegistration
 * qname: Адрес_фактический - AddressOfResidenceGar && AddressOfResidence
 */
class Address {
  async fillPageFragment(client) {
    if ((await I.selectSwitchStatus('Новая_форма_адреса_АВТО')) === 'да') {
      await new AddressOfRegistrationGar().fillAddressOfRegistrationGar(client)
      await new AddressOfResidenceGar().fillAddressOfResidenceGar(client)
    } else {
      await new AddressOfRegistration().fillAddressOfRegistration(client)
      await new AddressOfResidence().fillAddressOfResidence(client)
    }
  }
}

module.exports = { Address }
