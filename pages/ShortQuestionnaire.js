const { I } = inject()
const { PersonalInformation } = require('../fragments/shortQuestionnaire/PersonalInformation')
const { IdentityDocuments } = require('../fragments/shortQuestionnaire/IdentityDocuments')
const { ContactInformation } = require('../fragments/shortQuestionnaire/ContactInformation')
const { AverageIncome } = require('../fragments/shortQuestionnaire/AverageIncome')
const { CheckingMobileNumber } = require('../fragments/shortQuestionnaire/CheckingMobileNumber')
const { Address } = require('../fragments/shortQuestionnaire/Address')
const { TransitionShortQuestionnaire } = require('../fragments/transition/TransitionShortQuestionnaire')
const CheckShortQuestionnaire = require('../fragments/negativeChecks/CheckShortQuestionnaire')

/**
 * @param {Object} client - объект тестовых данных клиента
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит}.
 * FormName: Короткая анкета (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Товарный_кредит_формы.Предварительная_анкета_автокредит)
 */
class ShortQuestionnaire {
  /**
   * Короткая анкета для всех продуктов, кроме постановки авто в залог
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async generalShortQuestionnaire(client, credit) {
    await I.waitFormLoad()
    await I.grabAndSayApplicationData(client, credit)
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await new PersonalInformation().fillPageFragment(client)
    await new IdentityDocuments().fillPageFragment(client)
    await new Address().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new AverageIncome().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    await new TransitionShortQuestionnaire().transition(client, credit)
  }

  /**
   * Короткая анкета для постановки авто в залог
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async carPledgeShortQuestionnaire(client, credit) {
    await I.waitFormLoad()
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await I.grabAndSayApplicationData(client, credit)
    await new PersonalInformation().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    if (!tags.includes('@kaCarPledge')) {
      await new TransitionShortQuestionnaire().transition(client, credit)
    }
  }

  /**
   * Короткая анкета для негативных проверок авто
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeChecks(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await I.grabAndSayApplicationData(client, credit)
    await new PersonalInformation().fillPageFragment(client)
    await new IdentityDocuments().fillPageFragment(client)
    await new Address().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new AverageIncome().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    await new CheckShortQuestionnaire().negativeCheck(client)
  }

  /**
   * Короткая анкета для проверки адреса регистрации
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async checkRegistrationAddressGAR(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await I.grabAndSayApplicationData(client, credit)
    await new PersonalInformation().fillPageFragment(client)
    await new IdentityDocuments().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new AverageIncome().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    await new CheckShortQuestionnaire().checkRegistrationAddressGAR()
  }

  /**
   * Короткая анкета для проверки фактического адреса
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async checkActualAddress(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await I.grabAndSayApplicationData(client, credit)
    await new PersonalInformation().fillPageFragment(client)
    await new IdentityDocuments().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new AverageIncome().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    await new CheckShortQuestionnaire().checkActualAddress(client)
  }

  /**
   * Короткая анкета для дополнительных негативных проверок авто
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async negativeAdditionalCheck(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Короткая анкета"----------')
    await I.grabAndSayApplicationData(client, credit)
    await new IdentityDocuments().fillPageFragment(client)
    await new Address().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new AverageIncome().fillPageFragment(client)
    await new CheckingMobileNumber().fillPageFragment()
    await new CheckShortQuestionnaire().negativeAdditionalCheck(client, credit)
  }
}
module.exports = { ShortQuestionnaire }
