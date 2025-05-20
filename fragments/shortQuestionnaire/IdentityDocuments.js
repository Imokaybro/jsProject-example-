const ElementBuilder = require('../../helpers/ElementBuilder')
const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Документы_удостоверяющие_личность.Документы_предварительная_анкета}.
 * SubForm: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Документы_удостоверяющие_личность.Документы_предварительная_анкета
 */
class IdentityDocuments {
  #fragment = '//*[@data-control-name="Документы_удостоверяющие_личность"]'
  #issuedBy = `${this.#fragment}//*[@data-control-name="Кем_выдан"]//*[@class="dropdown-trigger unselectable"]`
  #element = async (element, type) => {
    const locate = await new ElementBuilder(this.#fragment).element(element, type)
    return locate
  }
  /**
   * Заполнение блока Документы удостоверяющие личность
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    await I.cFillField(await this.#element('Код'), client.passport.divisionCode)
    await I.cFillField(await this.#element('Дата_выдачи_1'), client.passport.dateOfIssue)
    await I.cClickList(this.#issuedBy, client.passport.issuedBy)
  }
}

module.exports = { IdentityDocuments }
