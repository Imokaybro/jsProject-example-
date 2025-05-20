const { I } = inject()
/**
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.sub_Проверка_телефона_с_подтверждением}.
 * SubForm: БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.sub_Проверка_телефона_с_подтверждением
 */
class CheckingMobileNumber {
  #numberNotConfirmed =
    '//*[@data-control-name="Проверка_телефона"]//*[@data-control-name="Основной_тел_список_неподтв"]//div[@class="dropdown-trigger unselectable"]'
  #smsDidntCome = 'SMS-сообщение с проверочным номером не пришло'
  /**
   * Заполнение блока Проверка мобильного номера
   */
  async fillPageFragment() {
    await I.cClickList(this.#numberNotConfirmed, this.#smsDidntCome)
  }
}

module.exports = { CheckingMobileNumber }
