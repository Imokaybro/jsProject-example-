const { ChangeFullName } = require('../fragments/fullQuestionnaire/ChangeFullName')
const { ContactInformation } = require('../fragments/fullQuestionnaire/ContactInformation')
const { IdentityDocuments } = require('../fragments/fullQuestionnaire/IdentityDocuments')
const { IncomeAndExpenses } = require('../fragments/fullQuestionnaire/IncomeAndExpenses')
const { MaritalStatus } = require('../fragments/fullQuestionnaire/MaritalStatus')
const { OtherInformation } = require('../fragments/fullQuestionnaire/OtherInformation')
const { OtherPersonalInformation } = require('../fragments/fullQuestionnaire/OtherPersonalInformation')
const { PlaceOfWork } = require('../fragments/fullQuestionnaire/PlaceOfWork')
const CheckFullQuestionnaire = require('../fragments/negativeChecks/CheckFullQuestionnaire')
const { Address } = require('../fragments/shortQuestionnaire/Address')
const { TransitionFullQuestionnaire } = require('../fragments/transition/TransitionFullQuestionnaire')
const GarError = require('../helpers/GarError')
const { I } = inject()

/**
 * @param {Object} client - объект тестовых данных клиента
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Анкета_товарный_кредит_метком}.
 * FormName: Анкета товарный кредит (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Анкета_товарный_кредит_метком)
 */
class FullQuestionnaire {
  #countryOfBirth = '//*[@data-control-name="Раскрывающийся_список_страна_рождения"]//input'
  #addressMatch =
    '//*[@data-control-name="Адрес_фактический"]//*[@data-control-name="Адрес_по_ГАР_1" and not(contains(@style, "display: none;"))]'
  /**
   * Заполнение этапа Полная анкета для всех продуктов, кроме пролонгации полиса
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillGeneralFullQuestionnaire(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Полная анкета"----------')
    await I.waitFormLoad()
    if (!credit.applicationNumber) {
      await I.grabAndSayApplicationData(client, credit)
    }
    await new MaritalStatus(client).fillPageFragment(client)
    await new IdentityDocuments().fillPageFragment(client)
    await new ChangeFullName().fillPageFragment(client)
    await new OtherPersonalInformation().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new PlaceOfWork().fillPageFragment(client)
    await new IncomeAndExpenses(client).fillPageFragment(client)
    await new OtherInformation().fillPageFragment(credit)
    await new TransitionFullQuestionnaire().transition(credit)
  }
  /**
   * Заполнение этапа Полная анкета для пролонгации полиса
   * @param {Object} client - объект тестовых данных клиента
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillLongPolisFullQuestionnaire(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Полная анкета"----------')
    if ((await I.selectSwitchStatus('Новые_поля_758П_АВТО_включено')) == 'да') {
      await I.cClickFillList(this.#countryOfBirth, client.countryOfBirth)
    }
    await new IdentityDocuments().fillPageFragment(client)
    await new ChangeFullName().fillPageFragment(client)
    await I.grabAndSayApplicationData(client, credit)
    await new TransitionFullQuestionnaire().transition(credit)
  }

  async negativeCheck(client, credit) {
    await I.cSay('----------Осуществлен переход на этап: "Полная анкета"----------')
    await new IdentityDocuments().fillPageFragment(client)
    await new ChangeFullName().fillPageFragment(client)
    await new OtherPersonalInformation().fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new PlaceOfWork().fillPageFragment(client)
    await new IncomeAndExpenses(client).fillPageFragment(client)
    await new OtherInformation().fillPageFragment(credit)
    await new CheckFullQuestionnaire().negativeCheck(client)
  }

  async fillECreditQuestionnaire(client, credit) {
    await new IdentityDocuments().fillPageFragment(client)
    await new ChangeFullName().fillPageFragment(client)
    await new MaritalStatus(client).fillPageFragment(client)
    await new ContactInformation().fillPageFragment(client)
    await new OtherPersonalInformation().fillPageFragment(client)
    /*     await new GarError().checkGar('Адрес_регистрации')
    const addressMatch = await tryTo(() => I.waitForElement(this.#addressMatch, 3))
    if (addressMatch) {
      await new GarError().checkGar('Адрес_фактический')
    } */
    await new Address().fillPageFragment(client)
    await new GarError().checkGar('Место_работы')
    await new TransitionFullQuestionnaire().transition(credit)
  }
}

module.exports = { FullQuestionnaire }
