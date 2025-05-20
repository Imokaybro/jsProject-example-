const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Жилищные_условия_образование_социальный_статус_иждивенцы_метком}.
 * SubFormName: Жилищные_условия_образование_социальный_статус_иждивенцы_метком (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Жилищные_условия_образование_социальный_статус_иждивенцы_метком)
 */
class OtherPersonalInformation {
  #form = '//*[@data-control-name="Жилищные_условия_образование_соц_статус_иждивенцы"]'
  #element = name => {
    return `${this.#form}//*[@data-control-name="${name}"]//input`
  }
  /**
   * Заполнение блока Жилищные условия, образование, социальный статус, иждивенцы
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    const clientInfo = client.otherPersonalInformation
    await I.cClickFillList(this.#element('Фактическое_проживание_'), clientInfo.actualPlacement)
    if (clientInfo.actualPlacement === 'Иное') {
      I.wait(1)
      await I.cFillField(this.#element('Другое_факт_проживание'), clientInfo.actualPlacementComment)
    }
    await I.cClickFillList(this.#element('Образование_'), clientInfo.education)
    if (clientInfo.education === 'Другое') {
      I.wait(1)
      await I.cFillField(this.#element('Другое_образование'), clientInfo.educationComment)
    }
    await I.cClickFillList(this.#element('Соц_статус_клиента'), clientInfo.socialStatus)
    if (clientInfo.socialStatus === 'Другое') {
      I.wait(1)
      await I.cFillField(this.#element('Другой_соц_статус'), clientInfo.socialStatusComment)
    }
    await I.cFillField(this.#element('Количество_иждивенцев_поле'), clientInfo.dependentPersons)
    await I.cClick(this.#element('Количество_детей_поле'))
    I.wait(1)
    await I.cFillField(this.#element('Количество_детей_поле'), clientInfo.children)
  }
}

module.exports = { OtherPersonalInformation }
