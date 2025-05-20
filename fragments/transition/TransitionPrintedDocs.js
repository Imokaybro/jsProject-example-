const ContextError = require('../../helpers/ContextError')
const { AddClientPhoto } = require('../AddClientPhoto')
const { RBSError } = require('../RBSError')
const { I } = inject()
/**
 * Навигация с этапа печатных документов
 */
class TransitionPrintedDocs {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #backToZV = `//*[@data-control-name="Кнопка_1"]//*[@class="button ui-button ui-widget  main"]${this.#buttonClass}`
  #next = `${this.#buttonClass}[text()="Далее"]`
  #reject = '//*[@data-control-name="Группа_кнопок_Вернуться"]//*[text()="Вернуться на регистрацию залога"]'
  #openContract = `//*[@data-control-name="Кнопка_Договор" or @data-control-name="Кнопка_Далее"]${this.#buttonClass}`
  currentStage = stage => `//*[@class="active"]//*[text()="${stage}"]`
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #text = text => `//span[text()="${text}"]`
  #attachButton = name => `//div[text()='${name}']/..//*[@class='attach-button']`

  /**
   * Переход с печатных документов для кредитных карт
   */
  async transitionCreditCard() {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line') || tags.includes('@rejection')) {
      if (!tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await I.cClick(this.#button('к_Отказ'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Отказ'))
      }
    }
    if (tags.includes('@back') && tags.includes('@pd_to_zv')) {
      await I.cClick(this.#button('Кнопка_3'))
      I.waitForElement(this.currentStage('Заявка на выдачу кредитных карт'), 50)
    }
  }
  /**
   * Переход с печатных документов для автокредита, кредита наличными на покупку авто
   */
  async transition() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@rejection') ||
      tags.includes('@negative')
    ) {
      if (!tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await I.cClick(this.#button('Кнопка_Отказ'))
        I.waitForText('Вы действительно хотите отказаться от текущего кредита?', 10)
        await I.cClick(this.#button('Удалить'))
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@pd_to_zr')) {
        await I.cClick(this.#button('Кнопка_2'))
        I.waitForElement(this.currentStage('Заявка на рассмотрение'), 50)
      } else if (tags.includes('@pd_to_zv')) {
        await I.cClick(this.#backToZV)
        I.waitForElement(this.currentStage('Заявка на выдачу кредита'), 100)
      } else if (tags.includes('@pdscan_to_zv')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await I.cClick(this.#button('Кнопка_назад'))
        I.waitForElement(this.currentStage('Заявка на выдачу кредита'), 100)
      } else {
        await I.cClick(this.#button('Кнопка_Договор'))
      }
    }
  }

  /**
   * Переход с печатных документов для автолизинга физлиц
   * @param {object} credit - объект тестовых данных кредита
   */
  async transitionLFL(credit) {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line') || tags.includes('@rejection')) {
      if (!tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await this.documentLoad()
        await I.cClick(this.#button('Кнопка_Далее_лизинг'))
        I.waitForText('Регистрация залога - одобрена', 250)
        await I.cClick(this.#button('Подтвердить_подписание'))
        if (credit.cardHALVA.card && !credit?.secondHALVA?.halvaAlreadyExist) {
          await new RBSError().connectionError()
          const loader = await tryTo(() => I.waitForText('Выбранные подписки', 250))
          if (!loader) {
            I.refreshPage()
            I.waitForText('Выбранные подписки', 30)
          }
          if (credit.cardHALVA.subscription) {
            await this.addSubscription(credit)
            await I.cClick('//*[text()="Далее"][@class="ui-button-text ui-button-in-line"]') //(this.#button('Кнопка_Договор'))
          } else {
            await I.cClick(this.#button('к_Отказ'))
          }
          await I.checkDocuments(['Индивидуальные условия Халва', 'Анкета Халва', 'Анкета заемщика (Халва)'])
          await I.cClick('//*[@data-control-name="Кнопка_Договор"]//*[@class="ui-button-text ui-button-in-line"]')
          I.waitForText('Способ получения', 180)
          await I.cClick(this.#button('Кнопка_Далее_лизинг'))
        }
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await I.cClick(this.#text('ОТКАЗ ОТ ВЫДАЧИ КРЕДИТА'))
        I.waitForText('Вы действительно хотите отказаться от текущего кредита? ', 150)
        await I.cClick(this.#text('ДА, РАСТОРГНУТЬ'))
      }
    }
  }
  /**
   * Загрузка фото и документов
   */
  async documentLoad() {
    await new AddClientPhoto().takePicture()
    await I.scanDocumentLoad(this.#attachButton('Платежный документ об авансе'))
    await I.scanDocumentLoad(this.#attachButton('Договор купли-продажи по трейд-ин'))
    await I.scanDocumentLoad(this.#attachButton('КАСКО'))
    await new ContextError().grab()
  }
  /**
   * Получение и ввод данных смс кода
   */
  async fillSMSCode() {
    await I.postToUdmConsole('Сформированный_код')
    const smsCode = await I.getFromUdmConsole()
    await I.cFillField(`${this.#text('Код подтверждения')}/..//input`, smsCode)
    await I.cClick('//*[@data-control-name="Кнопка_2"]//*[@class="ui-button-text ui-button-in-line"]')
  }
  /**
   * Добавление подписки для халвы
   * @param {object} credit - объект тестовых данных кредита
   */
  async addSubscription(credit) {
    await I.cClick(this.#button('к_Добавить'))
    await I.cClickFillList(`${this.#text('Подписка')}/..//input`, credit.cardHALVA.subscription)
    await I.cClick(this.#button('Кнопка_3'))
    await this.fillSMSCode()
    I.wait(2)
    await I.cClick(this.#button('к_Подписки'))
    await I.checkDocuments(['Заявление на подписку Халва.Десятка', 'Памятки к заявлению на подписку Халва.Десятка'])
    await new ContextError().grab()
  }
  /**
   * Переход с печатных документов для товарного кредита
   */
  async transitionTK() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@rejection') ||
      tags.includes('@back')
    ) {
      if (!tags.includes('@pd') && !tags.includes('@pd_to_zr')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        I.waitForText('Способ получения', 150)
        await I.scanDocumentLoad(this.#attachButton('Заявление о предоставлении кредита автокредита'))
        await I.cClick(this.#next)
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Договор'))
        await I.cClick(this.#button('Кнопка_Отказ'))
        I.waitForElement(this.#text('Вы действительно хотите отказаться от текущего кредита? '))
        await I.cClick(this.#button('Удалить'))
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@pd_to_zr')) {
        await I.cClick(this.#backToZV)
        I.waitForElement(this.currentStage('Заявка на рассмотрение'), 50)
      }
    }
  }
  /**
   * Переход с печатных документов для пролонгации полиса
   */
  async transitionLongPolis() {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line')) {
      if (!tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Далее'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@pd')) {
        await I.cClick(this.#button('Кнопка_Отказ'))
      }
    }
  }

  /**
   * Переход с регистрации залога для автокреда
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async transitionRegistrationCollateral(credit) {
    await new ContextError().grab()
    if (tags.includes('@migration') || tags.includes('@line')) {
      if (!tags.includes('@rz')) {
        await I.cClick(this.#next)
        if (credit.parameters.program != 'Без полиса КАСКО') {
          if (credit.cardHALVA.card && !credit?.secondHALVA?.halvaAlreadyExist) {
            await new RBSError().connectionError()
            const loader = await tryTo(() => I.waitForText('Выбранные подписки', 250))
            if (!loader) {
              I.refreshPage()
              I.waitForText('Выбранные подписки', 30)
            }
            if (credit.cardHALVA.subscription || credit.cardHALVA.existingHalva) {
              await this.addSubscription(credit)
              await I.cClick(this.#next)
            } else {
              await I.cClick(this.#button('к_Отказ'))
            }
          }
        }
        if (
          !credit.parameters.program.includes('рассрочк') &&
          !credit.parameters.program.includes('Правильный автокредит')
        ) {
          I.waitForText('Платежное поручение авто', 150)
        }
        if (credit?.cardHALVA?.existingHalva) {
          await I.cClick(this.#button('к_Отказ'))
        }
        if (credit.parameters.program !== 'DELETED') {
          I.waitForText('Гарантийное письмо', 150)
        }
        if (credit.parameters.program !== 'DELETED') {
          await I.cClick(this.#next)
        }
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@rz')) {
        if (tags.includes('@return')) {
          await I.cClick(this.#next)
          I.waitForText('Регистрация залога - получен временный отказ', 150)
          await I.cClick(this.#reject)
          I.waitForVisible('//div[@data-control-name="Фото_клиента"]//span[text()="КАМЕРА"]', 150)
          const context = 'БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Прикрепление_сканов_новое_метком'
          await I.postToUdmConsole(
            "Базовый:Организация:поИд(идобъекта(кредит.точка_оформления))[0].url_для_запроса_dess := 'https://wrdc-dess-ftest.sovcombank.group:443/CabinetIntegration/put_request.aspx'",
            context,
          )
          await I.postToUdmConsole(
            "Базовый:Организация:поИд(идобъекта(кредит.точка_оформления))[0].url_для_ответа_dess := 'https://wrdc-dess-ftest.sovcombank.group:443/CabinetIntegration/get_status.aspx'",
            context,
          )
          await I.cClick(this.#next)
          await I.checkDocuments(['Платежное поручение авто', 'Гарантийное письмо'])
          await I.cClick(this.#next)
        } else {
          await I.cClick(this.#button('Кнопка_Отказ'))
          I.waitForText('Вы действительно хотите отказаться от текущего кредита? ', 150)
          await I.cClick(this.#button('Удалить'))
        }
      }
    }
  }

  /**
   * Переход с этапа Печатных документов для постановки авто в залог
   */
  async transitionCarPledge() {
    await new ContextError().grab()
    await I.cClick(this.#openContract)
    I.waitForText('Договор залога движимого имущества', 180)
    if (tags.includes('@rejection') && tags.includes('@pd')) {
      await I.cClick(this.#button('Кнопка_Отказ'))
      await I.cClick(this.#button('Удалить'))
    } else if (tags.includes('@pdscan_to_pd')) {
      await I.cClick(this.#button('Кнопка_назад'))
      await I.checkDocuments([
        'Анкета заемщика (предварительная)',
        'Договор залога движимого имущества',
        'Заявление на перечисление дс',
        'График платежей',
      ])
    } else {
      await I.scanDocumentLoad(this.#attachButton('Договор залога движимого имущества'))
      await I.cClick(this.#openContract)
    }
  }
}

module.exports = { TransitionPrintedDocs }
