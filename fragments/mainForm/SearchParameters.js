const ElementBuilder = require('../../helpers/ElementBuilder')
const { I } = inject()

class SearchParameters {
  #form = '//*[@data-control-name="Tabs.Поиск_клиента"]'
  #fragment = '//*[@data-control-name="Паспортные_данные_клиента"]'
  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#form, this.#fragment).element(element, type)
    return locate
  }

  /**
   * Заполнение фрагмента "Параметры поиска"
   * @param {Object} client - объект с тестовыми данными кредита
   */
  async fillPageFragment(client) {
    await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Фамилия'), client.surname)
    await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Имя'), client.firstName)
    if (client.patronymic) {
      await I.cFillField(await this.#element('Поле_ввода_с_проверкой_Отчество'), client.patronymic)
    }
    await I.cFillField(await this.#element('Поле_Серия_и_Номер'), client.passport.serialAndNumber)
    await I.cFillField(await this.#element('Дата_Дата_рождения'), client.dateOfBirth)
  }
}

module.exports = SearchParameters
