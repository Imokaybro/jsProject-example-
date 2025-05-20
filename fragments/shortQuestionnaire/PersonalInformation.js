const ElementBuilder = require('../../helpers/ElementBuilder')
const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Персональная_Информация}.
 * SubForm: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Персональная_Информация
 */
class PersonalInformation {
  #gender = client => `//*[@data-control-name="Радио_группа_Пол"]//span[text() = '${client.gender}']`
  #fragment = '//*[@data-control-name="Персональня_информация"]'
  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#fragment).element(element, type)
    return locate
  }
  /**
   * Блок ввода базовой информации: ФИО, пол, дата и место рождения
   */
  async fillPageFragment(client) {
    await I.cClick(this.#gender(client))
    await I.cFillField(await this.#element('Поле_ввода_Место_рождения'), client.placeOfBirth)
    if ((await I.selectSwitchStatus('Новые_поля_758П_АВТО_включено')) == 'да') {
      await I.cClickFillList(await this.#element('Раскрывающийся_список_страна_рождения'), client.countryOfBirth)
    }
  }
}

module.exports = { PersonalInformation }
