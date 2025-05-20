const ContextError = require('../../helpers/ContextError')
const { RBSError } = require('../RBSError')
const { I } = inject()
/**
 * Навигация с этапа заявки на выдачу
 */
class TransitionApplicationForIssuance {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #selectCardLimit = '//*[@data-control-name="Раскрывающийся_список_1"]//input'
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  #discountAlertYes =
    '//*[@data-control-name="Всплывающее_окно_Предупреждение"]//*[@data-control-name="окно_предупреждение_ДА"]//*[@class="ui-button-text ui-button-in-line"]'
  /**
   * Переход с заявки на выдачу
   * @param {object} credit - объект тестовых данных кредита
   */
  async transition(credit) {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@rejection') ||
      tags.includes('@back') ||
      tags.includes('@negative')
    ) {
      if (tags.includes('@alert')) {
        await I.cClick(this.#button('к_Расчет'))
        I.waitForVisible(this.#button('Кнопка_Сохранить'), 10)
        await I.cClick(this.#button('Кнопка_Сохранить'))
        await this.checkVINAlert()
        I.waitForText('Максимальная стоимость авто - 5000000 руб', 5)
      } else if (!tags.includes('@zv') && !tags.includes('@beforezv')) {
        await this.goToNextStage()
      }
    }
    if (tags.includes('@rejection') && tags.includes('@zv')) {
      if (tags.includes('@dess')) {
        await this.rejectionFromDess(credit)
      } else {
        await I.cClick(this.#button('Кнопка_отказ'))
      }
    }
    if (tags.includes('@rejection') && tags.includes('@beforezv')) {
      await this.goToNextStage()
      await I.cClick(this.#button('Кнопка_Отказ_1'))
    }
  }

  /**
   * Переход с заявки на выдачу для кредитных карт
   */
  async transitionCreditCard(credit) {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@negative') ||
      tags.includes('@rejection')
    ) {
      if (!tags.includes('@zv')) {
        await this.goToNextStageCreditCard(credit)
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@zv')) {
        if (tags.includes('@sno') || tags.includes('@vno')) {
          await this.rejectionFromDess(credit)
        } else {
          await I.cClick(this.#button('Кнопка_отказ'))
        }
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@zv_to_pa')) {
        await I.cClick(this.#button('Вернуться_на_полную_анкету'))
        I.waitForElement('//*[@class="active"]//*[text()="Полная анкета"]', 50)
      } else {
        await this.goToNextStageCreditCard(credit)
      }
    }
  }

  /**
   * Переход с заявки на выдачу для ТК
   */
  async transitionCommodityCredit() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@negative') ||
      tags.includes('@rejection')
    ) {
      if (!tags.includes('@zv')) {
        await I.cClick(this.#button('Кнопка_Далее'))
      }
    }
    if (tags.includes('@rejection')) {
      if (tags.includes('@zv')) {
        await I.cClick(this.#button('Кнопка_отказ'))
      }
    }
    if (tags.includes('@back')) {
      if (tags.includes('@zv_to_pa')) {
        await I.cClick(this.#button('Кнопка_назад'))
        I.waitForElement('//*[@class="active"]//*[text()="Полная анкета"]', 50)
      } else {
        await I.cClick(this.#button('Кнопка_Далее'))
      }
    }
  }

  async checkVINAlert() {
    const checkVIN = await tryTo(() =>
      I.waitForText('Контрольный символ VIN некорректен! Подтверждаете, что VIN введен верно?', 20),
    )
    if (checkVIN) {
      await I.cClick("//*[text()='ПРОДОЛЖИТЬ' or text()='Продолжить']")
    }
  }

  /**
   * Переход на следующий этап
   */
  async goToNextStage() {
    await I.cClick(this.#button('к_Расчет'))
    await new ContextError().grab()
    I.waitForVisible(this.#button('Кнопка_Сохранить'), 20)
    await I.cClick(this.#button('Кнопка_Сохранить'))
    await this.checkVINAlert()
    I.wait(2)
    const leasingDiscount = await tryTo(() => I.waitForElement(this.#discountAlertYes, 5))
    if (leasingDiscount) {
      await I.cClick(this.#discountAlertYes)
    }
    await new RBSError().connectionError()
    const answerFromDess = await tryTo(() => I.waitForText('Заявка на выдачу кредита - одобрена', 250))
    if (!answerFromDess) {
      I.waitForText('Идет обработка...', 2)
      I.refreshPage()
      I.wait(5)
      I.waitForText('Заявка на выдачу кредита - одобрена', 5)
    }
  }
  /**
   * Переход на следующий этап для процесса оформления кредитной карты
   */
  async goToNextStageCreditCard(credit) {
    await I.cClick(this.#button('Кнопка_Сохранить'))
    await new ContextError().grab()
    await new RBSError().connectionError()
    await new RBSError().invalidCard(credit)
    I.waitForText('Оценка заявки на выдачу кредитной карты - одобрена', 250)
    await I.cClickFillList(this.#selectCardLimit, credit.cardHALVA.limit)
    await I.cClick(this.#button('Кнопка_Продолжить'))
  }

  /**
   * Подмена ответа от ДЕСС на отказ
   */
  async rejectionFromDess(credit) {
    if (tags.includes('@vno') || tags.includes('@sno')) {
      let rejectionType = ''
      if (tags.includes('@vno')) {
        rejectionType = 'Временный отказ'
      }
      if (tags.includes('@sno')) {
        rejectionType = 'Нет'
      }
      if (credit.typeCredit !== 'Кредитные карты') {
        await I.cClick(this.#button('к_Расчет'))
      }
      I.waitForVisible(this.#button('Кнопка_Сохранить'), 10)
      await I.cClick(this.#button('Кнопка_Сохранить'))
      await this.checkVINAlert()
      if (credit.typeCredit === 'Кредитные карты') {
        I.waitForText('Оценка заявки на выдачу кредитной карты - одобрена', 250)
      } else {
        const answerFromDess = await tryTo(() => I.waitForText('Заявка на выдачу кредита - одобрена', 250))
        if (!answerFromDess) {
          I.waitForText('Идет обработка...', 2)
          I.refreshPage()
          I.wait(5)
          I.waitForText('Заявка на выдачу кредита - одобрена', 5)
        }
      }
      await I.replacingResponseFromDESS(rejectionType)
      if (tags.includes('@vno')) {
        if (credit.typeCredit === 'Кредит наличными на покупку Авто' || credit.typeCredit === 'Автокредитование') {
          await I.cClick(this.#button('Кнопка_возврата'))
        } else {
          await I.cClick('//*[@class="element group horizontal-group __cell-noflex__"]' + this.#button('Кнопка_Назад'))
        }
        if (credit.typeCredit === 'Кредитные карты') {
          I.waitForElement(this.#activeStage('Заявка на выдачу кредитных карт'), 50)
        } else if (
          credit.typeCredit === 'Кредит наличными на покупку Авто' ||
          credit.typeCredit === 'Автокредитование'
        ) {
          I.waitForElement(this.#activeStage('Заявка на выдачу кредита'), 50)
        } else {
          I.waitForElement(this.#activeStage('Заявка на рассмотрение'), 50)
        }
      } else {
        await I.cClick(this.#button('Кнопка_Завершить_процесс'))
      }
    }
  }
}

module.exports = { TransitionApplicationForIssuance }
