const { I } = inject()
/**
 * {@link DELETED:8080/web/conf/#application.DELETED:form.Кредиты_фл.Формы.Для_процесса_оформления_кредита.Выбор_типа_кредита}
 * FormName: Выбор типа кредита (Кредиты_фл.Формы.Для_процесса_оформления_кредита.Выбор_типа_кредита)
 * @param {*} typeCredit - выбранный тип кредита из DataCase(credit.typeCredit)
 */
class ChoosingCreditType {
  #typeCredit = '//*[@data-control-name="Раскрывающийся_список_Тип_кредита"]//*[@class="dropdown-trigger unselectable"]'
  #next = '//*[@data-control-name="Кнопка_Далее"]//*[@class="button ui-button ui-widget  main"]'
  /**
   * Заполнение формы "Выбор типа кредита"
   */
  async choseCreditType(typeCredit) {
    const typeSelection = await tryTo(() => I.waitForText('Тип кредита', 60)) //Для точек, где установлен только один тип кредита
    if (typeSelection) {
      await I.cSay('----------Осуществлен переход на этап: "Выбор типа кредита"----------')
      I.waitForElement(this.#typeCredit, 30)
      I.wait(2)
      await I.cClickList(this.#typeCredit, typeCredit)
      await I.cClick(this.#next)
      if (tags.includes('@vtk_zapret')) {
        I.waitForText('Постановка залога по данному клиенту недоступна', 2)
      }
    }
  }
}

module.exports = { ChoosingCreditType }
