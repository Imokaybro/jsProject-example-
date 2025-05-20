const { TransitionTransactionParameters } = require('../transition/TransitionTransactionParameters')

const { I } = inject()

class CheckAgreements {
  #input = (context = '', name) => {
    if (context) {
      return `//*[@data-control-name="${context}"]//*[@data-control-name="${name}"]//input`
    }
    return `//*[@data-control-name="${name}"]//input`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #termCardHALVA =
    '//*[@data-control-name="Поле_ввода_с_шаблоном_Срок_действия" or @data-control-name="Срок_Халва"]//input'
  #horizontalButtonGroup = '//*[@class="element group horizontal-group __cell-noflex__"]'
  #clientPhoto = '//*[@data-control-name="Фото_клиента"]//*[@class="actionButtons chooseCamera"]'
  #invoiceForTheProduct =
    "//span[text()='Товар']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  #invoiceForTheCASCO =
    "//span[text()='Полис КАСКО']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  #invoiceForTheAdditionalEquipment =
    "//span[text()='Дополнительное оборудование']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  #invoiceForTheServices =
    "//span[text()='Услуги']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  #invoiceForTheOther =
    "//span[text()='комментарий к товару']/../../..//div[@data-control-name='Поле_ввода_с_шаблоном_Счет_получателя_валидация']//input"
  /**
   * Метод проверки обязательности ввода данных договора при переформировании для автокредита
   * @param {object} credit - тестовые данные кредита
   */
  async checkEnteringNumberForAuto(credit) {
    await I.cClick(this.#horizontalButtonGroup + this.#button('Кнопка_1'))
    I.waitForVisible(this.#input('', 'Поле_ввода_Собственные'), 30)
    I.wait(2)
    await I.cFillField(this.#input('', 'Поле_ввода_Собственные'), credit.parameters.initialPayment)
    await I.lossOfFocus()
    I.wait(2)
    await I.cClick(this.#button('к_Расчет'))
    I.waitForVisible(this.#button('Кнопка_Сохранить'), 10)
    await I.cClick(this.#button('Кнопка_Сохранить'))
    I.waitForText('Контрольный символ VIN некорректен! Подтверждаете, что VIN введен верно?', 20)
    await I.cClick(this.#button('окно_предупреждение_ДА'))
    const answerFromDess = await tryTo(() => I.waitForText('Заявка на выдачу кредита - одобрена', 250))
    if (!answerFromDess) {
      I.waitForText('Идет обработка...', 2)
      I.refreshPage()
      I.wait(5)
      I.waitForText('Заявка на выдачу кредита - одобрена', 5)
    }
    if (credit.parameters.program !== 'Без полиса КАСКО') {
      if (
        ![
          'КАСКО за наличные',
          'КАСКО не оформляется',
          'Многолетнее КАСКО',
          'КАСКО в подарок',
          'EGAP',
          'DELETED',
          'КАСКО в подарок Max',
        ].includes(credit?.insurancePolicy?.type)
      ) {
        await I.cFillField(
          this.#input('Рамка_Оплата_за_КАСКО', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
          credit.insurancePolicy.requisites.substr(credit.insurancePolicy.requisites.length - 5),
        )
      }
    }
    if (
      credit?.additionalServices?.typeOfService &&
      [
        'ОСАГО за наличные',
        'Гарантия погашения кредита',
        'Добровольное медицинское страхование',
        'Карта РАТ Совкомбанк Gold',
        'Карта РАТ Совкомбанк Premium',
        'Потеря дохода',
        'Финансовый GAP DELETED',
        'GAP-страхование (СК "DELETED")',
      ].includes(credit?.additionalServices?.typeOfService)
    ) {
      await I.cFillField(
        this.#input(
          'Рамка_Оплата_за_дополнительные_услуги_партнеров',
          'Поле_ввода_с_шаблоном_Счет_получателя_валидация',
        ),
        credit.additionalServices.requisites.substr(credit.additionalServices.requisites.length - 5),
      )
    }
    await I.cFillField(
      this.#input('Рамка_Оплата_за_автомобиль', 'Поле_ввода_с_шаблоном_Счет_получателя_валидация'),
      credit.detailsOfRetailOrganization.substr(credit.detailsOfRetailOrganization.length - 5),
    )
    if (credit.auto.pts.vin !== 'Отсутствует') {
      await I.cFillField(
        this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_н_валидация'),
        credit.auto.pts.vin.substr(0, 3),
      )
      await I.cFillField(
        this.#input('Рамка_VIN_автомобиля', 'Поле_ввода_с_шаблоном_VIN_к_валидация'),
        credit.auto.pts.vin.substr(credit.auto.pts.vin.length - 4),
      )
    }
    await new TransitionTransactionParameters().transaction()
    await I.cFillField(this.#termCardHALVA, '1225')
    await I.cClick(this.#button('Кнопка_2'))
    I.waitForVisible(this.#input('', 'Поле_ввода_Номер_договора_для_проверки'), 160)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForText('Чтобы продолжить, введите важные данные', 5)
    await I.postToUdmConsole('Кредит.Договор.Номер_договора')
    const numberOfContract = await I.getFromUdmConsole()
    await I.cFillField(this.#input('', 'Поле_ввода_Номер_договора_для_проверки'), numberOfContract)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForVisible(this.#clientPhoto, 30)
  }
  /**
   * Метод проверки обязательности ввода данных договора при переформировании для товарного кредита
   * @param {object} credit - тестовые данные кредита
   */
  async checkEnteringNumberForComondityCredit(credit) {
    await I.cClick(this.#horizontalButtonGroup + this.#button('Кнопка_1'))
    await I.cClick(this.#button('Кнопка_Далее'))
    I.waitForText('Последние 5 цифр счета получателя', 150)
    if (credit.purchaseOfGoods) {
      let paymentInvoice = credit.purchaseOfGoods.requisites.substr(credit.purchaseOfGoods.requisites.length - 5)
      await I.cFillField(this.#invoiceForTheProduct, paymentInvoice)
    }
    if (credit.purchaseCASCO) {
      let paymentInvoice = credit.purchaseCASCO.requisites.substr(credit.purchaseCASCO.requisites.length - 5)
      await I.cFillField(this.#invoiceForTheCASCO, paymentInvoice)
    }
    if (credit.purchaseOfService) {
      let paymentInvoice = credit.purchaseOfService.requisites.substr(credit.purchaseOfService.requisites.length - 5)
      await I.cFillField(this.#invoiceForTheServices, paymentInvoice)
    }
    if (credit.additionalPurchase) {
      let paymentInvoice = credit.additionalPurchase.requisites.substr(credit.additionalPurchase.requisites.length - 5)
      await I.cFillField(this.#invoiceForTheAdditionalEquipment, paymentInvoice)
    }
    if (credit.anotherPurchase) {
      let paymentInvoice = credit.anotherPurchase.requisites.substr(credit.anotherPurchase.requisites.length - 5)
      await I.cFillField(this.#invoiceForTheOther, paymentInvoice)
    }
    await I.cClick(this.#button('Кнопка_замена'))
    I.waitForVisible(this.#input('', 'Поле_ввода_Номер_договора_для_проверки'), 30)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForText('Чтобы продолжить, введите важные данные', 5)
    await I.postToUdmConsole('Кредит.Договор.Номер_договора')
    let numberOfContract = await I.getFromUdmConsole()
    await I.cFillField(this.#input('', 'Поле_ввода_Номер_договора_для_проверки'), numberOfContract)
    await I.cClick(this.#button('Кнопка_Договор'))
    I.waitForVisible(this.#clientPhoto, 30)
  }
}

module.exports = CheckAgreements
