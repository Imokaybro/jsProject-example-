const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Процессы.Дистрибутивные.Интерфейсные.Автокредит.Метком.Проверка_данных_клиента}.
 * SubFormName: Проверка данных клиента (БанкоDELETEDий_базовый.Кредиты_фл.Процессы.Дистрибутивные.Интерфейсные.Автокредит.Метком.Проверка_данных_клиента)
 */
class CheckingCustomerData {
  #confirm = '//*[@data-control-name="Флажок_сверка"]//*[@class="checkbox"]'
  #next = '//*[@data-control-name="Кнопка_Далее"]//*[@class="ui-button-text ui-button-in-line"]'
  #field = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  /**
   * Метод заполнения промежуточного этапа "Подтверждение данных клиента"
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async fillPage(client) {
    await I.cSay('Осуществлен переход на этап подтверждения данных клиента')
    await I.cFillField(this.#field('Поле_Фамилия'), client.surname)
    await I.cFillField(this.#field('Поле_Имя'), client.firstName)
    if (client.patronymic) {
      await I.cFillField(this.#field('Поле_Отчество'), client.patronymic)
    }
    await I.cFillField(this.#field('Серия_документа'), client.passport.serial)
    await I.cFillField(this.#field('Номер_документа'), client.passport.number)
    await I.cFillField(this.#field('Дата_рождения'), client.dateOfBirth)
    await I.cClick(this.#confirm)
    await I.cClick(this.#next)
  }
}

module.exports = { CheckingCustomerData }
