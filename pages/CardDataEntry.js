const { I } = inject()
const CheckEnteringCard = require('../fragments/negativeChecks/CheckEntringCard')
const { TransitionOpeningAccounts } = require('../fragments/transition/TransitionOpeningAccounts')

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Данные_по_картам}.
 * FormName: Данные_по_картам (Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Данные_по_картам)
 */
class CardDataEntry {
  #element = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #limit =
    '//*[@data-control-name="Раскрывающийся_список_Лимит_Халва" or @data-control-name="Список_сумма_лимита"]//input'
  /**
   * Этап ввода данных карт(старое название Открытие счетов)
   * @param {object} credit - объект тестовых данных кредита
   */
  async fillPage(credit) {
    if (credit.goldKeyCard?.card || credit.cardHALVA?.card) {
      await this.entryHalva(credit)
      await this.entryGoldKeyCard(credit)
      await new TransitionOpeningAccounts().transition()
    }
  }
  /**
   * Этап ввода данных карт(старое название Открытие счетов) с негативными
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkOpeningCards(credit) {
    await this.entryHalva(credit)
    await this.entryGoldKeyCard(credit)
    await new CheckEnteringCard().checkCardField(credit.cardHALVA.cardNumber)
    await new TransitionOpeningAccounts().transition()
  }
  /**
   * Ввод данных карты ХАЛВА
   * @param {object} credit - объект тестовых данных кредита
   */
  async entryHalva(credit) {
    if (credit.cardHALVA.card) {
      let cardArrayHalva = await I.grabCardData('1006')
      let cardCategoryHalva = 'ХАЛВА 4.0 МИР (РАЗРЕШЕН 2.0)'
      let cardExpirationHalva = cardArrayHalva[1].split('.')
      credit.cardHALVA.cardNumber = cardArrayHalva[0]
      let cardTermHalva = cardExpirationHalva[1] + cardExpirationHalva[2].substr(2)

      await I.cFillField(this.#element('Номер_Халва_маск'), credit.cardHALVA.cardNumber)
      I.wait(1)
      await I.cFillField(this.#element('Срок_Халва'), cardTermHalva)
      await I.cClickFillList(this.#limit, credit.cardHALVA.limit ?? '60000')
      if ((await I.selectSwitchStatus('Новая_логика_КП')) == 'нет') {
        await I.cClickFillList(this.#element('Раскрывающийся_список_Категория_Халва'), cardCategoryHalva)
      }
    }
  }
  /**
   * Ввод данных карты Золотой Ключ
   * @param {object} credit - объект тестовых данных кредита
   */
  async entryGoldKeyCard(credit) {
    if (credit?.goldKeyCard?.card) {
      let cardArrayZK = await I.grabCardData('1003')
      let cardExpirationZK = cardArrayZK[1].split('.')
      credit.goldKeyCard.cardNumber = cardArrayZK[0]
      let cardTermZK = cardExpirationZK[1] + cardExpirationZK[2].substr(2)
      await I.cFillField(this.#element('Номер_ЗК_маск'), credit.goldKeyCard.cardNumber)
      await I.cFillField(this.#element('Срок_ЗК'), cardTermZK)
    }
  }
}

module.exports = { CardDataEntry }
