const { I } = inject()
const FakeClientData = require('../helpers/fakers/FakeClientData')
/**
 * Обработчик ошибок от РБС
 */
class RBSError {
  #next =
    '//*[@data-control-name="Кнопка_2" or @data-control-name="Кнопка_Сохранить"]//*[text()="Далее" or text()="ДАЛЕЕ"]'
  #back = '//*[@data-control-name="Кнопка_2"]//*[@class="ui-button-text ui-button-in-line"]'
  #backToKA = '//*[@data-control-name="Кнопка_2"]//*[text()="НАЗАД" or text()="Назад"]'
  #passportSerial = '//*[@data-control-name="Серия_документа"]//input'
  #passportNumber = '//*[@data-control-name="Номер_документа"]//input'
  #nextToPFKA =
    '//*[@class="element group horizontal-group __cell-noflex__"]//*[@data-control-name="Кнопка_1"]//*[@class="ui-button-text ui-button-in-line"]'
  #resume = '//*[@data-control-name="Кнопка_продолжить"]//*[@class="ui-button-text ui-button-in-line"]'
  #cardNumber =
    '//*[@data-control-name="Поле_ввода_с_шаблоном_Номер_карты" or @data-control-name="Номер_Халва_маск"]//input'
  #cardTerm = '//*[@data-control-name="Поле_ввода_с_шаблоном_Срок_действия" or @data-control-name="Срок_Халва"]//input'
  #halvaLimit =
    '//*[@data-control-name="Раскрывающийся_список_Лимит_Халва" or @data-control-name="Список_сумма_лимита"]//input'
  #cardCategory = '//*[text()="Карточная категория"]/..//input'
  #countyOfBirth = '//*[@data-control-name="Раскрывающийся_список_страна_рождения"]//input'
  #repeatRequest = '//*[@data-control-name="Группа_кнопок_Завершить"]//*[@class="ui-button ui-widget supporting"]'
  #cardNumberZK = '//*[@data-control-name="Номер_ЗК_маск"]//input'
  #cardTermZK = '//*[@data-control-name="Срок_ЗК"]//input'
  /**
   * Выполняет замену паспорта в случае получения ошибки от РБС (реализация имеет смысл только на переходе с короткой анкеты)
   * @param {Object} client - объект данных клиента
   */
  async incorrectPassport(client) {
    const faker = new FakeClientData()
    const clientAlreadyExist = await tryTo(() => I.waitForText('Код: XMLSRV-41', 15))
    const invalidPassport = await tryTo(() => I.waitForText('Код: 0-0', 5))
    if (clientAlreadyExist || invalidPassport) {
      client.passport.serial = faker.randomNumber(4)
      client.passport.number = faker.randomNumber(6)
      await I.cSay(
        `Был сгенерирован некорректный паспорт. Возврат на КА, замена номера и серии паспорта на: ${client.passport.serial} ${client.passport.number}`,
      )
      await I.cClick(this.#backToKA)
      await I.cFillField(this.#passportSerial, client.passport.serial)
      await I.cFillField(this.#passportNumber, client.passport.number)
      await I.cClickFillList(this.#countyOfBirth, client.countryOfBirth)
      await I.cClick(this.#nextToPFKA)
      const checkClientGender = await tryTo(() => I.waitForText('Проверьте правильность заполнения пола клиента', 5))
      if (checkClientGender) {
        await I.cClick(this.#resume)
      }
    }
  }
  /*
   * Выполняет повторный запрос в случае получении ошибки от РБС(цикл 15минут)
   */
  async connectionError() {
    for (let i = 1; i < 4; i++) {
      const connectionError = await tryTo(() => I.waitForText('Текст: Ошибка при обращении к РБС', 15))
      const systemError = await tryTo(() => I.waitForText('Текст: Системная ошибка.', 1))
      if (connectionError || systemError) {
        await I.cSay(`Получена ошибка отправка запроса в РБС. Выполняем повторный запрос. Итерация №${i}`)
        I.wait(285)
        await I.cClick(this.#repeatRequest)
        I.wait(15)
      }
      if (!connectionError && !systemError) {
        i = 4
      }
    }
  }

  /**
   * Выполняет замену номера карты, если карта занята, заблокирована или были введены некорректные данные
   * @param {Object} credit - объект с тесовыми данными кредита
   */
  async invalidCard(credit) {
    for (let i = 0; i < 5; i++) {
      let incorrectCard = await tryTo(() => I.waitForText('Текст: Некорректные данные карты', 15))
      let cardNotFound = await tryTo(() => I.waitForText('DELETED', 1))
      let cardBlocked = await tryTo(() => I.waitForText('DELETED', 1))
      let cardIssued = await tryTo(() => I.waitForText('DELETED', 1))
      let processing = await tryTo(() => I.waitForText('DELETED', 1))

      if (incorrectCard || cardNotFound || cardIssued || cardBlocked || processing) {
        await I.cClick(this.#back)
        if (credit?.goldKeyCard?.card) {
          const cardArray = await I.grabCardData('1003')
          const cardExpiration = cardArray[1].split('.')
          const cardNumberZK = cardArray[0]
          const cardTermZK = cardExpiration[1] + cardExpiration[2].substr(2)
          await I.cFillField(this.#cardNumberZK, cardNumberZK)
          await I.cFillField(this.#cardTermZK, cardTermZK)
        }
        if (credit.cardHALVA?.card || credit.typeCredit === 'Кредитные карты') {
          const cardCategory = 'DELETED'
          const cardArray = await I.grabCardData('1006')
          const cardExpiration = cardArray[1].split('.')
          const cardNumber = cardArray[0]
          const cardTerm = cardExpiration[1] + cardExpiration[2].substr(2)
          await I.cFillField(this.#cardNumber, cardNumber)
          I.wait(1)
          await I.cFillField(this.#cardTerm, cardTerm)
          await I.cClickFillList(this.#halvaLimit, credit.cardHALVA.limit)
          if ((await I.selectSwitchStatus('Новая_логика_КП')) === 'нет') {
            await I.cClickFillList(this.#cardCategory, cardCategory)
          }
        }
        await I.cClick(this.#next)
      } else {
        i = 5
      }
    }
  }
}

module.exports = { RBSError }
