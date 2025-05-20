const ContextError = require('../../helpers/ContextError')
const Loader = require('../../helpers/Loader')
const { RBSError } = require('../RBSError')
const { I } = inject()

/**
 * Навигация с этапа заявки на рассмотрение
 */
class TransitionApplicationForConsideration {
  #buttonClass = '//*[@class="ui-button-text ui-button-in-line"]'
  #back = `//*[@data-control-name="Кнопка_2" or @data-control-name="Вернуться_на_оценку_залога"]${this.#buttonClass}`
  #button = name => `//*[@data-control-name="${name}"]${this.#buttonClass}`
  #activeStage = name => `//*[@class="active"]//*[text()="${name}"]`
  #rejectButton = '//*[@data-control-name="Кнопка_Отказ_1"]//*[@class="ui-button-text ui-button-in-line"]'
  #discountAlertYes =
    '//*[@data-control-name="Всплывающее_окно_Предупреждение"]//*[@data-control-name="окно_предупреждение_ДА"]//*[@class="ui-button-text ui-button-in-line"]'

  /**
   * Переход с заявки на рассмотрение
   */
  async transition() {
    await new ContextError().grab()
    if (
      tags.includes('@migration') ||
      tags.includes('@line') ||
      tags.includes('@rejection') ||
      tags.includes('@back') ||
      tags.includes('@negative')
    ) {
      if (tags.includes('@alert')) {
        await this.calculate()
        I.waitForText('Максимальная стоимость авто - 5000000 руб', 5)
      } else if (tags.includes('@zr_to_pa')) {
        await I.cClick(this.#button('Кнопка_Возврат_на_анкету'))
        I.waitForElement(this.#activeStage('Полная анкета'), 50)
      } else if (!tags.includes('@zr')) {
        await this.goToNextStage()
      }
    }

    if (tags.includes('@rejection') && tags.includes('@zr')) {
      if (tags.includes('@dess')) {
        await this.rejectionFromDess()
      } else {
        await I.cClick(this.#button('Кнопка_отказ'))
      }
    }
  }

  /**
   * Переход на следующий этап
   */
  async goToNextStage() {
    await this.calculate()
    await new RBSError().connectionError()
    await new Loader().reload('Заявка на оценку залога - одобрена')
    await I.cClick(this.#button('Кнопка_Продолжить'))
    I.waitForText('Перейти на выдачу кредита?', 180)
    await I.cClick(this.#button('Кнопка_Да'))
    I.waitForText('Уведомление для партнеров', 180)
    await I.cClick(this.#button('Кнопка_Договор'))
  }

  /**
   * Подмена ответа от ДЕСС на отказ
   */
  async rejectionFromDess() {
    if (tags.includes('@vno') || tags.includes('@sno')) {
      let rejectionType = ''
      if (tags.includes('@vno')) {
        rejectionType = 'Временный отказ'
      }
      if (tags.includes('@sno')) {
        rejectionType = 'Нет'
      }
      await this.calculate()
      await new Loader().reload('Заявка на оценку залога - одобрена')
      await I.replacingResponseFromDESS(rejectionType)
      if (tags.includes('@vno')) {
        await I.cClick(this.#back)
        I.waitForElement(this.#activeStage('Заявка на рассмотрение'), 50)
      } else {
        await I.cClick(this.#button('Кнопка_Завершить_процесс'))
      }
    } else {
      await this.calculate()
      await new RBSError().connectionError()
      await new Loader().reload('Заявка на оценку залога - одобрена')
      await I.cClick(this.#rejectButton)
    }
  }

  async calculate() {
    await I.cClick(this.#button('к_Расчет'))
    I.waitForVisible(this.#button('Кнопка_Сохранить'), 20)
    await new ContextError().grab()
    await I.cClick(this.#button('Кнопка_Сохранить'))
    const schemeBan = await tryTo(() =>
      I.waitForText(
        'Схема кредитования запрещена в выбранном Автосалоне. Обратитесь в Отдел сопровождения каналов продаж.',
        5,
      ),
    )
    if (schemeBan) {
      await I.cSay('Схема кредитования запрещена в выбранном Автосалоне')
      throw new Error('Схема кредитования запрещена в выбранном Автосалоне')
    }
    const leasingDiscount = await tryTo(() =>
      I.waitForText('Оформление ЛФЛ со скидкой на автомобили Hyundai возможно только с полисом КиберКАСКО', 5),
    )
    if (leasingDiscount) {
      await I.cClick(this.#discountAlertYes)
    }
  }
}

module.exports = { TransitionApplicationForConsideration }
