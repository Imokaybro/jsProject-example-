const { I } = inject()
const { CarParameters } = require('../fragments/applicationMetcomCalculation/CarParameters')
const { CreditParameters } = require('../fragments/applicationMetcomCalculation/CreditParameters')
const { LendingScheme } = require('../fragments/applicationMetcomCalculation/LendingScheme')
const { PreferentialPayment } = require('../fragments/applicationMetcomCalculation/PreferentialPayment')
const { CheckAlerts } = require('../fragments/CheckAlerts')
const { GoldKeyCard } = require('../fragments/applicationMetcomCalculation/GoldKeyCard')
const { HalvaCard } = require('../fragments/applicationMetcomCalculation/HalvaCard')
const { TransitionApplicationForIssuance } = require('../fragments/transition/TransitionApplicationForIssuance')
const Casco = require('../fragments/applicationMetcomCalculation/additionalPurchase/Casco')
const { Conclusion } = require('../fragments/applicationForScoring/Conclusion')

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_Метком_расчет}.
 * FormName: Заявка с расчетом (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_Метком_расчет)
 */
class ApplicationForIssuance {
  #checkBoxMilitaryRetiree =
    '//*[text()="Подтверждаю, что заемщик является пенсионером, ранее проходившим военную службу"]'
  #checkBoxMilitary =
    '//*[text()="Подтверждаю, что заемщик является гражданином, проходящим военную службу по контракту или военную службу по призыву в соответствии с Федеральным законом «О воинской обязанности и военной службе», либо проживающим совместно с таким гражданином супругом (супругой), сыном (дочерью), родителем"]'
  #checkBoxTeacher = '//*[text()="Подтверждаю, что заемщик работает в государственной системе образования"]'
  #checkBoxMedic = '//*[text()="Подтверждаю, что заемщик работает в государственной системе здравоохранения"]'
  #disabledPerson = '//*[text()="Подтверждаю, что заемщик является инвалидом"]'
  #next = '//*[@data-control-name="к_Расчет"]//*[@class="ui-button-text ui-button-in-line"]'
  #nextStage = '//*[@data-control-name="Кнопка_Сохранить"]//*[@class="ui-button-text ui-button-in-line"]'
  #attachButton = name => {
    return `//div[text()="${name}"]/..//*[@class="attach-button"]`
  }
  #vin = '//*[@data-control-name="Автомобили_метком"]//*[@data-control-name="Поле_ввода_VIN"]//input'
  #bodyNumber = '//*[@data-control-name="Поле_ввода_номер_кузова"]//input'
  #alert =
    '//*[contains(text(), "Не указан ни один из параметров: укажите VIN. Если нет VIN, укажите № кузова.") or contains(text(), "VIN должен содержать 17 буквенных и числовых символов, включая тире. ")]'
  #dropDown = '//*[@class="dropdown-trigger unselectable"]'
  #element = (name, type = 'dropDown') => {
    let locate
    if (type === 'field') locate = `//*[@data-control-name="${name}"]//input`
    if (type === 'dropDown') locate = `//*[@data-control-name="${name}"]${this.#dropDown}`
    return locate
  }
  #prepaidExpenseDealer = '//*[@data-control-name="гп_Тип_аванса"]//*[text()="Аванс в кассу дилера"]'

  /**
   * Заполнение этапа "Заявка на выдачу" для типа кредита "Автокредитование"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageAuto(credit) {
    await new CheckAlerts().applicationForIssuance(credit)
    await I.cSay('----------Осуществлен переход на этап: "Заявка на выдачу"----------')
    await new LendingScheme().fillPageFragment(credit)
    await new PreferentialPayment().fillPageFragment(credit)
    if (tags.includes('@eCredit')) {
      await new Casco().fill(credit)
    }
    await new CreditParameters().fillCreditParameters(credit)
    await new CarParameters().fill(credit)
    await new HalvaCard().fillPageFragment(credit)
    await this.documentsForSubsidy(credit)
    if (credit.parameters.program === 'Кредит сотрудникам Совкомбанка') {
      await I.scanDocumentLoad(this.#attachButton('Справка о доходах'))
    }
    if (credit.setYourBet) {
      await I.cClickList(this.#element('Рамка_НСС'), credit.setYourBet)
    }
    await new Conclusion().decisionOnTheApplication(credit)
    if (credit.typeCredit == 'АвтоЛизинг физических лиц') {
      await I.cFillField(this.#element('Поле_ввода_Гарантия_год', 'field'), credit.auto.warrantyYear ?? '5')
      await I.cFillField(this.#element('Поле_ввода_Гарантия_пробег', 'field'), credit.auto.warrantyMillage ?? '50000')
      await I.cFillField(this.#element('Поле_ввода_цвет_кузова', 'field'), credit.auto.color ?? 'Черный')
      await I.cFillField(this.#element('Поле_ввода_номер_двигателя', 'field'), credit.auto.pts.vin)
      await I.cFillField(this.#element('Поле_ввода_номер_шасси', 'field'), credit.auto.pts.vin)
      await I.cFillField(this.#element('Поле_ввода_Предприятие_изготовитель', 'field'), credit.auto.company ?? 'Завод')
      await I.cCheckOption('//*[@data-control-name="Флажок_подтверждаю_остаток"]//*[@class="checkbox"]')
      await I.cCheckOption('//*[@data-control-name="Флажок_подтверждение_1"]//*[@class="checkbox"]')
      await I.cCheckOption('//*[@data-control-name="Флажок_подтверждение_2"]//*[@class="checkbox"]')
      await I.cCheckOption('//*[@data-control-name="тбл_Опции"]//*[@class="checkbox"]')
      credit.prepaidExpense = credit.prepaidExpense ?? 'Аванс в кассу дилера'
      if (credit.prepaidExpense === 'Аванс в кассу дилера') {
        await I.cClick(this.#prepaidExpenseDealer)
      }
    }
    await new TransitionApplicationForIssuance().transition(credit)
  }
  /**
   * Заполнение этапа "Заявка на выдачу" для типа кредита "Кредит наличными под залог авто"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillPageKNPA(credit) {
    await new CheckAlerts().applicationForIssuance(credit)
    await I.cSay('----------Осуществлен переход на этап: "Заявка на выдачу"----------')
    await new LendingScheme().fillPageFragment(credit)
    await new Casco().fill(credit)
    await new CreditParameters().fillCreditParameters(credit)
    await new CarParameters().fill(credit)
    await new GoldKeyCard().fill(credit)
    await new HalvaCard().fillPageFragment(credit)
    await new Conclusion().decisionOnTheApplication(credit)
    await new TransitionApplicationForIssuance().transition(credit)
  }

  async checkVINField(credit) {
    await I.cClearField(this.#vin)
    I.wait(3)
    I.waitForElement(this.#alert, 5)
    await I.cClick(this.#next)
    I.waitForText('Чтобы продолжить, введите важные данные', 5)
    await I.cFillField(this.#vin, credit.auto.pts.vin)
    await I.cClick(this.#nextStage)
    const checkVIN = await tryTo(() =>
      I.waitForText('Контрольный символ VIN некорректен! Подтверждаете, что VIN введен верно?', 20),
    )
    if (checkVIN) {
      await I.cClick("//*[text()='ПРОДОЛЖИТЬ' or text()='Продолжить']")
    }
    I.waitForText('Ожидание ответа от Банка', 10)
  }

  async checkBodyNumberField(credit) {
    await I.cClearField(this.#vin)
    I.wait(3)
    I.waitForElement(this.#alert, 5)
    await I.cClick(this.#next)
    I.waitForText('Чтобы продолжить, введите важные данные', 5)
    await I.cFillField(this.#bodyNumber, credit.auto.pts.vin)
    await I.cClick(this.#nextStage)
    const checkVIN = await tryTo(() =>
      I.waitForText('Контрольный символ VIN некорректен! Подтверждаете, что VIN введен верно?', 20),
    )
    if (checkVIN) {
      await I.cClick("//*[text()='ПРОДОЛЖИТЬ' or text()='Продолжить']")
    }
    I.waitForText('Ожидание ответа от Банка', 10)
  }

  async documentsForSubsidy(credit) {
    if (credit.auto.stateSubsidy) {
      if (credit.auto.stateSubsidy === 'Семейный автомобиль') {
        await I.scanDocumentLoad(this.#attachButton('Документ для программы Семейный автомобиль'))
      }
      if (credit.auto.stateSubsidy === 'Автомобиль в Trade-in') {
        await I.scanDocumentLoad(this.#attachButton('ПТС на автомобиль в трейд-ин'))
      }
      if (credit.auto.stateSubsidy === 'Автомобиль государственному медицинскому персоналу') {
        await I.scanDocumentLoad(this.#attachButton('Документ для медицинского сотрудника'))
        await I.cClick(this.#checkBoxMedic)
      }
      if (credit.auto.stateSubsidy === 'Автомобиль учителям') {
        await I.scanDocumentLoad(this.#attachButton('Документ для программы Автомобиль учителям'))
        await I.cClick(this.#checkBoxTeacher)
      }
      if (credit.auto.stateSubsidy === 'Автомобиль военнослужащим и их родственникам') {
        await I.scanDocumentLoad(
          this.#attachButton('Документ для программы Автомобиль военнослужащим и их родственникам'),
        )
        await I.cClick(this.#checkBoxMilitary)
      }
      if (credit.auto.stateSubsidy === 'Автомобиль ранее служившим пенсионерам') {
        await I.scanDocumentLoad(this.#attachButton('Документ для программы Автомобиль ранее служившим пенсионерам'))
        await I.cClick(this.#checkBoxMilitaryRetiree)
      }
      if (credit.auto.stateSubsidy === 'Автомобиль инвалидам') {
        await I.scanDocumentLoad(this.#attachButton('Документ для программы Автомобиль инвалидам'))
        await I.cClick(this.#disabledPerson)
      }
    }
  }
}

module.exports = { ApplicationForIssuance }
