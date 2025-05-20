const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Документы_удостоверяющие_личность.Документы}.
 * SubFormName: Документы (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Блоки_анкеты.Документы_удостоверяющие_личность.Документы)
 */
class IdentityDocuments {
  #form = '//*[@data-control-name="Документы_удостоверяющие_личность"]'
  #snils = `${this.#form}//*[@data-control-name="Документ_удостоверяющий_личность_1"]//*[@data-control-name="Номер_документа"]//input`
  #inn = `${this.#form}//*[@data-control-name="Поле_ввода_ИНН"]//input`
  #noOldPassport = `${this.#form}//*[@data-control-name="Флажок"]//*[@class="checkbox"]`
  #noMarkOldPassport =
    '//*[@data-control-name="Всплывающее_окно_Отсутствие_старого_документа"]//*[@data-control-name="Кнопка_Доп_Да"]//*[@class="ui-button-text ui-button-in-line"]'
  #secondDocument = name => {
    return `${this.#form}//*[@data-control-name="Другой_документ"]//*[@data-control-name="${name}"]//input`
  }
  #oldPassport = name => {
    return `${this.#form}//*[@data-control-name="Старый_паспорт"]//*[@data-control-name="${name}"]//input`
  }
  #issuedBy = `${this.#form}//*[@data-control-name="Другой_документ"]//*[(@data-control-name="Кем_выдан_СТАРАЯ_ВЕРСИЯ" or @data-control-name="Кем_выдан") and not(contains(@style, "display: none"))]//input`
  /**
   * Заполнение блока Документы, удостоверяющие личность
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    if (client.secondDocument.haveSnils) {
      await I.cFillField(this.#snils, client.secondDocument.snils)
    }
    if (client.secondDocument.haveInn) {
      await I.cFillField(this.#inn, client.secondDocument.inn)
    }
    await this.fillSecondDocument(client.secondDocument)
    await this.fillOldPassport(client)
  }

  async fillOldPassport(client) {
    // if (oldPassport.haveOldPassport)
    if (client.oldPassport.haveOldPassport || client.oldName.change) {
      await I.cUnCheckOption(this.#noOldPassport)
      await I.cFillField(this.#oldPassport('Серия_документа'), client.oldPassport.serial)
      await I.cFillField(this.#oldPassport('Номер_документа'), client.oldPassport.number)
      await I.cFillField(this.#oldPassport('Дата_выдачи_1'), client.oldPassport.dateOfIssue)
      await I.cFillField(this.#oldPassport('Код'), client.oldPassport.divisionCode)
    } else {
      await I.cCheckOption(this.#noOldPassport)
      const noMark = await tryTo(() => I.waitForText('Вы уверены, что у клиента нет отметки', 5))
      if (noMark) await I.cClick(this.#noMarkOldPassport)
    }
  }

  async fillSecondDocument(secondDocument) {
    if (secondDocument.haveSecondDocument) {
      await I.cClickFillList(this.#secondDocument('Тип_документа'), secondDocument.document)
      if (secondDocument?.serial) {
        await I.cFillField(this.#secondDocument('Серия_документа'), secondDocument.serial)
      }
      await I.cFillField(this.#secondDocument('Номер_документа'), secondDocument.number)
      await I.cFillField(this.#secondDocument('Дата_выдачи_1'), secondDocument.dateOfIssue)
      await I.cFillField(this.#issuedBy, secondDocument.issuedBy)
    }
  }
}

module.exports = { IdentityDocuments }
