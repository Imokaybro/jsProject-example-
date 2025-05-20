const { I } = inject()
const { AddressOfWork } = require('./AddressOfWork')
const { AddressOfWorkGar } = require('./AddressOfWorkGar')
/**
 * @param {Object} client - объект тестовых данных клиента
 * Объединенная подформа, включающая в себя еще 3 подформы
 * SubFormName: Адрес_по_ГАР (Интеграция_с_дадата.Формы.Адрес_по_ГАР)
 * {@link DELETED:8080/web/conf/#application.DELETED:form.Интеграция_с_дадата.Формы.Адрес_по_ГАР}.
 * SubFormName: Адрес (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Адреса.Адрес)
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Адреса.Адрес}.
 * SubFormName: Место_работы_СВК_товарная_метком (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Место_работы_СВК_товарная_метком)
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Место_работы_СВК_товарная_метком}.
 */
class PlaceOfWork {
  constructor() {
    const formLocate = '//*[@data-control-name="Место_работы"]'
    //Поля
    this.nameEmployeeOrganization = `${formLocate}//*[@data-control-name="Название_организации_сотрудника"]//input`
    this.nameOrganization = `${formLocate}//*[@data-control-name="Поле_ввода_Наименование_организации"]//input`
    this.organizationType = `${formLocate}//*[@data-control-name="Раскрывающийся_список_Тип_организации_гос"]//input`
    this.industry = `${formLocate}//*[@data-control-name="Раскрывающийся_список_отрасль"]//input`
    this.profession = `${formLocate}//*[@data-control-name="Раскрывающийся_список_1"]//input`
    this.busyness = `${formLocate}//*[@data-control-name="Раскрывающийся_список_Род_занятий"]//input`
    this.workExperienceYears = `${formLocate}//*[@data-control-name="Числовое_поле_ввода_срок_работы"]//input`
    this.workExperienceMonths = `${formLocate}//*[@data-control-name="Числовое_поле_ввода_1"]//input`
    this.workOrgnip = `${formLocate}//*[@data-control-name="Поле_ввода_ОГРНИП"]//input`
    this.workOrgnipDate = `${formLocate}//*[@data-control-name="Дата_ОГРНИП"]//input`
  }
  /**
   * Заполнение блока Место работы
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    if (
      client.otherPersonalInformation.socialStatus !== 'Пенсионер' &&
      client.otherPersonalInformation.socialStatus !== 'Самозанятость'
    ) {
      if (client.otherPersonalInformation.socialStatus === 'Сотрудник Банка/Группы') {
        await I.cClickFillList(this.nameEmployeeOrganization, client.placeOfWork.nameOfTheOrganization)
      } else {
        await I.cFillField(this.nameOrganization, client.placeOfWork.nameOfTheOrganization)
      }
      I.pressKey('Tab')

      if (client.otherPersonalInformation.socialStatus === 'ИП') {
        I.waitForText('Проверьте, что тип организации указан верно', 150)
        I.pressKey('Escape')
      }

      if (client.otherPersonalInformation.socialStatus !== 'ИП') {
        await I.clearField(this.organizationType, client.placeOfWork.organizationType)
        await I.cClickFillList(this.organizationType, client.placeOfWork.organizationType)
      }
      await I.cClickFillList(this.industry, client.placeOfWork.industry)
      await I.cFillField(this.profession, `${client.placeOfWork.profession} `)
      I.pressKey('Backspace')
      I.wait(1)
      await I.cClick(`//ul[not(contains(@style, "display: none"))]//*[text()='${client.placeOfWork.profession}']`)
      await I.cClickFillList(this.busyness, client.placeOfWork.busyness)
      await I.cFillField(this.workExperienceYears, client.placeOfWork.workExperienceYears)
      await I.cFillField(this.workExperienceMonths, client.placeOfWork.workExperienceMonths)
      if ((await I.selectSwitchStatus('Новая_форма_адреса_АВТО')) === 'да') {
        await new AddressOfWorkGar().fillAddressOfWorkGar(client)
      } else {
        await new AddressOfWork().fillAddressOfWork(client)
      }
      if ((await I.selectSwitchStatus('Новые_поля_758П_АВТО_включено')) == 'да') {
        if (client.otherPersonalInformation.socialStatus == 'ИП') {
          await I.cFillField(this.workOrgnip, client.placeOfWork.orgnip)
          await I.cFillField(this.workOrgnipDate, client.placeOfWork.orgnipDate)
        }
      }
    }
    if (client.otherPersonalInformation.socialStatus === 'Самозанятость') {
      await I.cFillField(this.industry, client.placeOfWork.industry)
      await I.cFillField(this.workExperienceYears, client.placeOfWork.workExperienceYears)
      await I.cFillField(this.workExperienceMonths, client.placeOfWork.workExperienceMonths)
      if ((await I.selectSwitchStatus('Новая_форма_адреса_АВТО')) === 'да') {
        await new AddressOfWorkGar().fillAddressOfWorkGar(client)
      } else {
        await new AddressOfWork().fillAddressOfWork(client)
      }
    }
  }
}

module.exports = { PlaceOfWork }
