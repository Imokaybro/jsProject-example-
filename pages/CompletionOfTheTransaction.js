const { TransitionCompletionTransaction } = require('../fragments/transition/TransitionCompletionTransaction')

const { I } = inject()
/**
 * Этап завершения сделки автолизинга !!ФУНКИЦИОНАЛ НЕ РАБОТАЕТ!!
 */
class CompletionOfTheTransaction {
  #attachButton = name => `//div[text()="${name}"]/..//*[@class="attach-button"]`
  #text = text => `//span[text()="${text}"]`
  #checkBox = text => `//*[@class='checkbox']/..${this.#text(text)}`
  #alert =
    'Для формирования актов приемки, нужно подтвердить установку маяка и проложить фотографию с размещением маяка на автомобиле'
  /**
   * Этап завершения сделки автолизинга !!ФУНКИЦИОНАЛ НЕ РАБОТАЕТ!!
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async fillPage(credit) {
    const currentDate = new Date().toLocaleDateString('ru-RU')
    if (credit.cardHALVA.card) {
      await I.cClick(this.#checkBox('Не подключать регулярные перечисления в счет оплаты лизинга'))
      await I.cClick(this.#text('Далее'))
    }
    /* I.waitForText(this.#alert, 150)
    await I.cClick(this.#text('Подтверждаю установку маяка')) */
    /* I.waitForText('Необходимо установить маяк на автомобиль магнитами к металлической поверхности автомобиля, ', 150)
    I.pressKey('Escape') */
    await I.cFillField(`${this.#text('Номер блока')}/..//input`, credit.blockNumber ?? '123123')
    await I.cFillField(`${this.#text('Место установки')}/..//input`, credit.installationLocation ?? 'Под капот')
    await I.cClick(this.#attachButton('Акт приемки к Договору Купли-Продажи'))
    await I.cFillField(`${this.#text('Дата акта')}/..//input`, currentDate)
    await I.cFillField(`${this.#text('Дата Товарной накладной или УПД')}/..//input`, currentDate)
    await I.scanDocumentLoad(this.#attachButton('Акт приемки к Договору Купли-Продажи'))
    await I.scanDocumentLoad(this.#attachButton('Акт приемки к Договору Лизинга'))
    await I.scanDocumentLoad(this.#attachButton('Товарная накладная + Счет-фактура'))
    await I.scanDocumentLoad(this.#attachButton('Доп.соглашение к ДКП'))
    await I.scanDocumentLoad(this.#attachButton('Доп.соглашение к ДЛ'))
    await I.cClick(this.#text('Подтверждаю получение второго комплекта ключей'))
    I.wait(5)
    await I.cClick('//*[@class="radiobutton"]') //this.#text('Акт приемки к Договору Купли-Продажи')
    await I.cClick('//*[@data-control-name="Коллекция_изображений_фото_маяка"]//*[@class="tool ui-btn add-button"]')
    await I.cClick('//*[text()="Добавить снимок"]')
    I.wait(2)
    await I.cClick('//*[contains(text(), "СДЕЛАТЬ СНИМОК")]')
    await I.cClick('//*[contains(text(), "СОХРАНИТЬ")]')
    I.wait(2)
    await I.cClick('//*[@class="ui-button-text ui-button-in-line"][text()="Продолжить"]')
    await new TransitionCompletionTransaction().transition()
  }
}

module.exports = { CompletionOfTheTransaction }
