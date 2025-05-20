const { I } = inject()
const { CheckAlerts } = require('../fragments/CheckAlerts')
const { AdditionalPurchase } = require('../fragments/applicationMetcomCalculation/AdditionalPurchase')
const { AdditionalService } = require('../fragments/applicationMetcomCalculation/AdditionalService')
const { CarParameters } = require('../fragments/applicationMetcomCalculation/CarParameters')
const { CreditParameters } = require('../fragments/applicationMetcomCalculation/CreditParameters')
const { GoldKeyCard } = require('../fragments/applicationMetcomCalculation/GoldKeyCard')
const { RBSError } = require('../fragments/RBSError')
const {
  TransitionApplicationForConsideration,
} = require('../fragments/transition/TransitionApplicationForConsideration')
const Casco = require('../fragments/applicationMetcomCalculation/additionalPurchase/Casco')

/**
 * @param {Object} credit - объект тестовых данных кредита
 * {@link http://urt-fis-app01.sovcombank.group:8080/web/conf/#application.Кредитование_физлиц.Кредитный_фронт:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_Метком_расчет}.
 * FormName: Заявка с расчетом (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Заявка_Метком_расчет)
 */
class ApplicationForConsideration {
  #smsInfoType = type => {
    return `//*[@data-control-name="Группа_переключателей_смс_информирование"]//*[text()="${type}"]`
  }
  #decision = '//*[@data-control-name="Решение_по_заявке"]//input'
  #organization = '//*[@data-control-name="Раскрывающийся_список_РО"]//*[@class="dropdown-trigger unselectable"]'
  #dboAlready =
    '//*[@data-control-name="Рамка_СМС_информирование"]//*[contains (text(), "Уже подключено SMS-информирование типа")]'
  #calculation = '//*[@data-control-name="к_Расчет_и_валидация"]//*[@class="ui-button-text ui-button-in-line"]'
  #tariffNSS = '//*[@data-control-name="рс_Тариф_НСС"]//*[@class="dropdown-trigger unselectable"]'
  #notProvided = '//*[@data-control-name="Группа_переключателей_Гос_субсидия"]//*[text()="Не предоставляется"]'
  #field = name => `//*[@data-control-name="${name}"]//input`
  #prepaidExpenseDealer = '//*[@data-control-name="гп_Тип_аванса"]//*[text()="Аванс в кассу дилера"]'

  /**
   * Заполнение этапа "Заявка на рассмотрение"
   * @param {Object} credit - объект тестовых данных кредита
   */
  async fillGeneralApplicationForConsideration(credit) {
    I.wait(3)
    await new CheckAlerts().applicationForConsideration(credit)
    await new RBSError().connectionError()
    await I.cSay('----------Осуществлен переход на этап: "Заявка на рассмотрение"----------')
    I.wait(3)
    await I.cClickList(this.#organization, credit.organization)
    await new CarParameters().fill(credit)
    await new CreditParameters().fillCreditParameters(credit)
    await new Casco().fill(credit)
    await new AdditionalPurchase().fillAdditionalServices(credit)
    await new AdditionalService().addAdditionalService(credit)
    if (credit.smsInfoType) {
      const dboAlreadyExist = await tryTo(() => I.waitForElement(this.#dboAlready, 2))
      if (!dboAlreadyExist) {
        await I.cClick(this.#smsInfoType(credit.smsInfoType))
      }
    }
    await I.cClickFillList(this.#decision, credit.decision)
    if (credit.typeCredit === 'АвтоЛизинг физических лиц') {
      await I.cFillField(this.#field('Поле_ввода_Подписант_Лизинг'), 'Иванов Иван Иванович')
      await I.cFillField(this.#field('Поле_ввода_Подписант_Лизинг_доверенность'), 'доверенности №1 от 01.11.2023')
    }
    await new GoldKeyCard().fill(credit)
    const valueOfTheSubsidy = (await I.selectFromDataBase('systemParameter.sql', 'subsidy')).rows[0][0]

    if (
      valueOfTheSubsidy.toLowerCase() === 'нет' &&
      credit.typeCredit != 'АвтоЛизинг физических лиц' &&
      !credit.auto.stateSubsidy
    ) {
      await I.cClick(this.#notProvided)
    }
    if (credit.typeCredit == 'АвтоЛизинг физических лиц') {
      credit.prepaidExpense = credit.prepaidExpense ?? 'Аванс в кассу дилера'
      if (credit.prepaidExpense === 'Аванс в кассу дилера') {
        await I.cClick(this.#prepaidExpenseDealer)
      }
    }
    await new TransitionApplicationForConsideration().transition()
  }

  /**
   * Метод получающий ставку по кредиту
   * @returns FLOAT возвращает ставку по кредиту
   */
  async grabCreditPercent() {
    await I.cClick(this.#calculation)
    I.wait(5)
    await I.postToUdmConsole('Кредит.заявка.ставка')
    return parseFloat(await I.getFromUdmConsole())
  }

  /**
   * Метод для получения значения ставки после выбора НСС
   * @param {String} tariffNSS - тариф НСС
   * @returns FLOAT ставка по заявке
   */
  async setNSSAndGrabPercent(tariffNSS) {
    await I.cClickList(this.#tariffNSS, tariffNSS)
    return await this.grabCreditPercent()
  }
}

module.exports = { ApplicationForConsideration }
