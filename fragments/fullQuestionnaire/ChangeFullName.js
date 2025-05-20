const ElementBuilder = require('../../helpers/ElementBuilder')
const { IdentityDocuments } = require('../../fragments/fullQuestionnaire/IdentityDocuments')
const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Прежние_ФИО}.
 * FormName: Прежние_ФИО (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Прежние_ФИО)
 */
class ChangeFullName {
  #fragment = '//*[@data-control-name="Панель_прежние_фио"]' //Прежняя фамилия Прежнее имя Прежнее отчество
  #oldNameField = type =>
    `${this.#fragment}//input[contains(@placeholder,'${type}') and not(contains(@disabled , 'disabled'))]`
  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#fragment).element(element, type)
    return locate
  }
  /**
   * Заполнение блока Данные о смене ФИО
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    if ((await I.selectSwitchStatus('Новые_поля_758П_АВТО_включено')) == 'да') {
      if (client.oldName.change) {
        await new IdentityDocuments().fillOldPassport(client) //добавлен метод, что если клиент менял ФИО, то нужно заполнить старый паспорт
        await I.cUnCheckOption(await this.#element('Флажок_ФИО', 'checkbox'))
        I.wait(1)
        await I.cClickList(await this.#element('Причина_изменения', 'dropDown'), client.oldName.reason)
        I.wait(1)
        await I.cClick(await this.#element('Кнопка_скопировать', 'button'))
        await this.changeFIO('Прежняя фамилия', client.oldName.surname)
        await this.changeFIO('Прежнее имя', client.oldName.firstName)
        await this.changeFIO('Прежнее отчество', client.oldName.patronymic)
      }
    } else {
      //Ничего не менял
      await I.cCheckOption(await this.#element('Флажок_ФИО'), 'checkbox')
      I.wait(1)
    }
  }

  /**
   * Заполнение данных о смене ФИО
   * @param {String} type - тип(например: Прежняя фамилия)
   * @param {String} data -
   */
  async changeFIO(type, data) {
    let element
    if (type === 'Прежняя фамилия') element = 'Поле_с_флагом_1'
    if (type === 'Прежнее имя') element = 'Поле_с_флагом_2'
    if (type === 'Прежнее отчество') element = 'Поле_с_флагом_3'
    if (data) {
      await I.cCheckOption(await this.#element(element, 'checkbox'))
      I.wait(1)
      await I.cFillField(await this.#oldNameField(type), data)
    } else {
      await I.cUnCheckOption(await this.#element(element, 'checkbox'))
    }
  }
}

module.exports = { ChangeFullName }
