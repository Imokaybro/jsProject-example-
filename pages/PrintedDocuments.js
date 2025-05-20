const { RBSError } = require('../fragments/RBSError')
const CheckAgreements = require('../fragments/negativeChecks/CheckAgreements')
const { TransitionConfirmationOfSigning } = require('../fragments/transition/TransitionConfirmationOfSigning')
const { TransitionPrintedDocs } = require('../fragments/transition/TransitionPrintedDocs')
const { TransactionParameters } = require('./TransactionParameters')
const { I } = inject()

class PrintedDocuments {
  #attachButton = name => {
    return `//div[text()='${name}']/..//*[@class='attach-button']`
  }
  #paymentDocument = '//*[@data-control-name="Поле_ввода_1"]//input'
  #datePaymentDocument = '//*[@data-control-name="Дата_1"]//input'
  /**
   * Этап "Печатные документы" для автокредита
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForAutocredit(credit) {
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Анкета заемщика',
      'Опросник для клиента',
      'Бланк почтового перевода',
      'Титульный лист КД',
      'Уведомление для партнеров',
      'Чек заявка',
      'Условия предоставления ПТС',
    ])
    await this.checkDocumentsForCASKO(credit)
    await this.checkDocumentsForInstallment(credit)
    await this.checkDocumentsForCard(credit)
    await this.checkDocumentsForAdditionalServices(credit)
    await new TransitionPrintedDocs().transition()
  }
  /**
   * Этап "Печатные документы" для КНПА
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForKNPA(credit) {
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await this.checkDocumentsForCard(credit)
    await I.checkDocuments([
      'Анкета заемщика',
      'Заявление о предоставлении кредита',
      'Индивидуальные условия',
      'Заявление на транш',
      'График-памятка',
    ])
    if (credit.parameters.program == 'Из рук в руки Лайт С БЛОКИРОВКОЙ') {
      I.waitForText('Заявление на блокировку дс', 30)
      I.waitForText('Заявление оферта на открытие счета с блокировкой', 30)
    }
    await new TransitionPrintedDocs().transition()
  }
  /**
   * Этап "Печатные документы" для лизинга физических лиц
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForAutolizingFl(credit) {
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Опросник для клиента',
      'Анкета Предварительная лизинг',
      'Доверенность на управление',
      'Доверенность на учет',
      'Договор Купли-Продажи',
      'Договор Лизинга',
      'Письмо для оплаты',
      'Памятка по погашению лизинга для клиента',
      'Заявление на заключение сделки финансовой аренды',
      'Памятка по постановке на учет ТС',
    ])
    //await this.checkDocumentsForCard(credit)
    if (credit?.financialProtection?.company) {
      if (credit.financialProtection.company === 'DELETED') {
        I.waitForText('Сертификат DELETED', 30)
        const ratioDMS = await I.selectDMSRatio(credit)
        if (ratioDMS > 0) {
          I.waitForText('Пакет ФЗ DELETED', 30)
        }
      }
    }
    if (credit?.additionalServices?.typeOfService == 'DELETED') {
      I.waitForText('DELETED', 30)
    }
    await I.cFillField(this.#paymentDocument, credit.documentOfInitialPayment ?? (await I.randomNumber(5)))
    let datePaymentDocument = new Date()
    await I.cFillField(this.#datePaymentDocument, datePaymentDocument.toLocaleDateString('ru-RU'))
    await new TransitionPrintedDocs().transitionLFL(credit)
  }

  /**
   * Этап "Печатные документы" для кредитных карт
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForCreditCard(credit) {
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Анкета заемщика (Халва)',
      'Анкета заемщика Карта Халва',
      'Индивидуальные условия КК',
      //'Памятка по установке Мобильного приложения Халва', убрали по бизнес задаче
      'Опросник для клиента',
    ])
    await I.scanDocumentLoad(this.#attachButton('Анкета_заемщика'))
    await I.scanDocumentLoad(this.#attachButton('Паспорт'))
    await I.scanDocumentLoad(this.#attachButton('Индивидуальные_условия'))
    await I.scanDocumentLoad(this.#attachButton('Заявление о предоставлении потребительского кредита(Халва)'))
    await new TransitionPrintedDocs().transitionCreditCard()
  }

  /**
   * Этап "Печатные документы" для товарного кредита
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForCommodityCredit(credit) {
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Анкета заемщика (предварительная)',
      'Индивидуальные условия товарный кредит',
      'Анкета заемщика',
      'Титульный лист КД',
      'График памятка',
      'Опросник для клиента',
    ])
    if (credit.financialProtection.company === 'DELETED') {
      await I.checkDocuments(['Полис DELETED'])
    }
    if (credit.financialProtection.company === 'САО "DELETED"') {
      I.waitForText('Сертификат DELETED', 30)
      I.waitForText('Пакет ФЗ DELETED', 30)
    }
    if (credit.financialProtection.company === 'ООО "DELETED"') {
      I.waitForText('Пакет ФЗ Капитал', 30)
    }
    await new TransitionPrintedDocs().transitionTK()
  }

  /**
   * Печатные документы для пролонгация полиса
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForLongPolis(credit) {
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    if (credit.insuranceProduct.lifeInsurance) {
      if (credit.insuranceProduct.company === 'АО "DELETED"') {
        await I.checkDocuments(['Полис DELETED'])
      }
      if (credit.insuranceProduct.company === 'САО "DELETED"') {
        I.waitForText('Сертификат DELETED', 30)
        I.waitForText('Пакет ФЗ DELETED', 30)
      }
      I.waitForText('Заявл.о вкл. в ФЗ пролонгация', 30)
    }
    if (credit.insuranceProduct.gpk) {
      I.waitForText('Пакет_ГПК', 30)
      I.waitForText('Заявление о пролонгации ГПК', 30)
    }
    if (credit.insuranceProduct.dms) {
      I.waitForText('Пакет Добровольное медицинское страхование', 30)
    }
    await I.scanDocumentLoad(this.#attachButton('Страховая документация'))
    await new TransitionPrintedDocs().transitionLongPolis()
  }

  /*
   * Печатные документы для постановки авто в залог
   */
  async checkDocumentsForCarPledge() {
    await new RBSError().connectionError()
    await I.checkDocuments([
      'Анкета заемщика (предварительная)',
      'Договор залога движимого имущества',
      'Заявление на перечисление дс',
      'График платежей',
    ])
    if (!tags.includes('@car_pledge_docs_test')) {
      await new TransitionPrintedDocs().transitionCarPledge()
    }
  }

  /**
   * Проверка формирования печатных документов для КАСКО
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForCASKO(credit) {
    if (credit.parameters.program !== 'Без полиса КАСКО') {
      if (credit?.insurancePolicy?.type === 'КАСКО в кредит') {
        I.waitForText('Заявление на списание платы за страхование', 120)
      }
    }
    if (credit?.insurancePolicy?.type === 'DELETED') {
      I.waitForText('DELETED', 60)
    }
    if (credit?.insurancePolicy?.type === 'Многолетнее КАСКО') {
      I.waitForText('Многолетнее КАСКО', 60)
    }
    if (credit?.insurancePolicy?.type === 'КАСКО в подарок') {
      I.waitForText('Сертификат КАСКО в подарок', 60)
    }
    if (credit?.insurancePolicy?.type === 'EGAP') {
      I.waitForText('Полис EGAP Росгосстрах', 60)
    }
  }
  /**
   * Проверка формирования печатных документов для Авторассрочки
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForInstallment(credit) {
    //проверка что программа кредитования содержит часть слова рассрочка
    if (credit.parameters.program.includes('рассрочк')) {
      await I.checkDocuments(['Допсоглашение Авторассрочка', 'Заявление Авторассрочка', 'Памятка по рассрочке'])
    } else {
      await I.checkDocuments([
        'Индивидуальные условия потребительского кредита',
        'Заявление на предоставление потребительского кредита',
        'График памятка',
      ])
    }
    if (
      credit.parameters.program === 'DELETED' ||
      credit.parameters.program === 'DELETED'
    ) {
      await I.checkDocuments(['Заявление добровольной страховой защиты'])
    }
  }
  /**
   * Проверка формирования печатных документов для Карт
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForCard(credit) {
    if (credit?.cardHALVA?.card) {
      await I.checkDocuments([
        'Анкета заемщика (Халва)',
        //'Памятка по установке Мобильного приложения Халва', убрали по бизнес задаче
        'Индивидуальные условия Халва',
        'Анкета Халва',
        'Титульный лист Халва',
      ])
    } else {
      await I.checkDocuments(['Анкета заемщика (предварительная)'])
    }
    if (credit?.goldKeyCard?.card) {
      await I.checkDocuments(['Заявление оферта ЗК'])
    }
  }
  /**
   * Проверка формирования печатных документов для дополнительных услуг(ФЗ, акции, подключенные доп услуги)
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkDocumentsForAdditionalServices(credit) {
    await this.checkDocumentsForFinancialProtection(credit)
    if (credit?.additionalServices?.typeOfService) {
      if (credit?.additionalServices?.typeOfService === 'Карта РАТ Совкомбанк Gold') {
        await I.checkDocuments(['Памятка PAT Gold'])
      }
      if (credit?.additionalServices?.typeOfService === 'Карта РАТ Совкомбанк Premium') {
        await I.checkDocuments(['Памятка PAT Premium'])
      }
      if (credit?.additionalServices?.typeOfService === 'Гарантия минимальной ставки') {
        await I.checkDocuments(['Памятка по ГОС'])
      }
      if (credit?.additionalServices?.typeOfService === 'Финансовый GAP РЕСО-Гарантия') {
        await I.checkDocuments(['Пакет_Финансовый_ГАП_РЕСО-Гарантия'])
      }
      if (credit?.additionalServices?.typeOfService === 'Помощь на дорогах КАР АССИСТАНС') {
        await I.checkDocuments(['Пакет_документов_КАР_АССИСТАНС'])
      }
      if (
        credit.additionalServices.typeOfService === 'Программа Premium НС+помощь на дорогах' ||
        credit.additionalServices.typeOfService === 'Программа Gold НС+помощь на дорогах'
      ) {
        await I.checkDocuments(['Пакет НС+помощь на дорогах'])
      }
      if (credit?.additionalServices?.typeOfService === 'Страхование жизни') {
        await I.checkDocuments(['Памятка_полис_для Авторассрочки'])
      }
      if (credit?.additionalServices?.typeOfService === 'GAP-страхование') {
        await I.checkDocuments(['Полис GAP'])
      }
      if (credit?.additionalServices?.typeOfService === 'Финансовый GAP DELETED') {
        await I.checkDocuments(['Пакет Финансовый ГАП DELETED'])
      }
      if (credit?.additionalServices?.typeOfService === 'Гарантия погашения кредита') {
        await I.checkDocuments(['Пакет ГПК'])
      }
      if (credit?.additionalServices?.typeOfService === 'Добровольное медицинское страхование') {
        await I.checkDocuments(['Пакет Добровольное медицинское страхование'])
      }
      if (credit?.additionalServices?.typeOfService === 'Потеря дохода') {
        await I.checkDocuments(['Пакет Потеря дохода'])
      }
      if (credit?.additionalServices?.typeOfService === 'ДМС Экспресс Доктор') {
        await I.checkDocuments(['Пакет ДМС Экспресс доктор'])
      }
    }
    if (credit.promotion === 'Автокред под 0') {
      await I.checkDocuments(['Автокред под 0'])
    }
    if (credit.promotion === 'Продленная гарантия в подарок') {
      await I.checkDocuments(['Продленная гарантия в подарок'])
    }
    if (credit.giftPayment) {
      await I.checkDocuments(['Памятка по ПвП'])
    }
    if (credit.excellentBet) {
      await I.checkDocuments(['Памятка по ГОС'])
    }
    if (credit.parameters.program == 'Hyundai Finance Cyber') {
      await I.checkDocuments(['Пакет КиберАвто'])
    }
  }

  async checkDocumentsForFinancialProtection(credit) {
    const financialProtection = credit.financialProtection

    if (financialProtection?.company && credit.parameters.program !== 'DELETED') {
      const ratioDMS = await I.selectDMSRatio(financialProtection)

      if (financialProtection.company === 'ООО "DELETEDСтрахование-Жизнь"') {
        await I.checkDocuments(['Заявление DELETED', 'Информационный сертификат DELETED', 'DELETED'])
      }
      if (financialProtection.company === 'ООО "DELETED"') {
        await I.checkDocuments(['Пакет ФЗ Капитал'])
        if (ratioDMS === 0) await I.checkDocuments(['Памятка Капитал Лайф', 'Заявление Капитал Лайф'])
      }
      if (financialProtection.company === 'АО "DELETED"') {
        await I.checkDocuments(['Полис DELETED'])
        if (ratioDMS > 0) await I.checkDocuments(['Пакет ФЗ DELETED'])
      }
      if (financialProtection.company === 'САО "DELETED"') {
        I.waitForText('Сертификат DELETED', 30)
        if (ratioDMS > 0) await I.checkDocuments(['Пакет ФЗ DELETED'])
      }
    }
  }

  /**
   * Проверка ввода номера договора на этапе "Печатные документы" для автокредита
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkEnteringNumberOfAgreements(credit) {
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Анкета заемщика',
      'Опросник для клиента',
      'Бланк почтового перевода',
      'Титульный лист КД',
      'Уведомление для партнеров',
      'Чек заявка',
      'Условия предоставления ПТС',
    ])
    await this.checkDocumentsForCASKO(credit)
    await this.checkDocumentsForInstallment(credit)
    await this.checkDocumentsForCard(credit)
    await this.checkDocumentsForAdditionalServices(credit)
    await new CheckAgreements().checkEnteringNumberForAuto(credit)
  }
  /**
   * Проверка ввода номера договора на этапе "Печатные документы" для товарного кредита
   * @param {object} credit - объект тестовых данных кредита
   */
  async checkContractNumberForCommodityCredit(credit) {
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Печатные документы"----------')
    await I.checkDocuments([
      'Анкета заемщика (предварительная)',
      'Индивидуальные условия товарный кредит',
      'Анкета заемщика',
      'Титульный лист КД',
      'График памятка',
      'Опросник для клиента',
    ])
    if (credit.financialProtection.company === 'DELETED') {
      await I.checkDocuments(['Полис DELETED'])
    }
    if (credit.financialProtection.company === 'САО "DELETED"') {
      await I.checkDocuments(['Сертификат DELETED', 'Пакет ФЗ DELETED'])
    }
    if (credit.financialProtection.company === 'ООО "DELETED"') {
      await I.checkDocuments(['Пакет ФЗ Капитал'])
    }
    await I.cClick('//*[@data-control-name="Кнопка_1"]//*[@class="ui-button-text ui-button-in-line"]')
    I.waitForElement('//*[@class="active"]//*[text()="Заявка на рассмотрение"]', 50)
    await I.cClick('//*[@data-control-name="Кнопка_Далее"]//*[@class="ui-button-text ui-button-in-line"]')
    I.waitForText('Заявка на выдачу кредита - одобрена', 250)
    await new TransactionParameters().fillDecisionOnTheApplication(credit)
    I.waitForVisible('//*[@data-control-name="Поле_ввода_Номер_договора_для_проверки"]//input', 180)
    await I.cClick('//*[@data-control-name="Кнопка_Договор"]//*[@class="ui-button-text ui-button-in-line"]')
    I.waitForText('Чтобы продолжить, введите важные данные', 5)
  }

  /**
   * Этап "Подтверждение подписания" для товарного кредита
   */
  async confirmationOfSigningCommodityCredit() {
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Подтверждение подписания"----------')
    await I.checkDocuments([
      'Чек лист',
      'Анкета заемщика (предварительная)',
      'Индивидуальные условия товарный кредит',
      'Анкета заемщика',
      'Титульный лист КД',
      'График памятка',
      'Опросник для клиента',
    ])
    await new TransitionConfirmationOfSigning().transition()
  }
}

module.exports = { PrintedDocuments }
