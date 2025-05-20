const { I } = inject()
/**
 * @param {Object} client - объект тестовых данных клиента
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.sub_Доходы_СВК}.
 * SubFormName: sub_Доходы_СВК (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.sub_Доходы_СВК)
 */
class IncomeAndExpenses {
  constructor(client) {
    const formLocate = '//*[@data-control-name="Доходы"]'
    //Поля
    this.mainIncome = `${formLocate}//*[@data-control-name="Основной"]//input`
    this.firstIncomeDate = `${formLocate}//*[@data-control-name="Периодичность_выплаты_дохода"]//*[@data-control-name="Первое_число"]//input`
    this.secondIncomeDate = `${formLocate}//*[@data-control-name="Периодичность_выплаты_дохода"]//*[@data-control-name="Второе_число"]//input`
    this.incomeComment = `${formLocate}//*[@data-control-name="Периодичность_выплаты_дохода"]//*[@data-control-name="Другое_поле_ввода"]//input`
    this.otherIncomeStatus = `${formLocate}//*[@data-control-name="Другие_доходы"]//*[@class='checkbox']/../..`
    this.otherIncome = `${formLocate}//*[@data-control-name="Другие_доходы"]//*[@class='checkbox']`
    this.firstOtherIncomeAmount = `${formLocate}//*[@data-control-name="Сумма_1"]//input`
    this.secondOtherIncomeAmount = `${formLocate}//*[@data-control-name="Сумма_2"]//input`
    this.thirdOtherIncomeAmount = `${formLocate}//*[@data-control-name="Сумма_3"]//input`
    this.firstOtherIncomeSource = `${formLocate}//*[@data-control-name="Источник_дохода_1"]//input`
    this.secondOtherIncomeSource = `${formLocate}//*[@data-control-name="Источник_дохода_2"]//input`
    this.thirdOtherIncomeSource = `${formLocate}//*[@data-control-name="Источник_дохода_3"]//input`
    this.firstOtherIncomeFrequency = `${formLocate}//*[@data-control-name="Периодичность_1"]//input`
    this.secondOtherIncomeFrequency = `${formLocate}//*[@data-control-name="Периодичность_2"]//input`
    this.thirdOtherIncomeFrequency = `${formLocate}//*[@data-control-name="Периодичность_3"]//input`
    this.pensionFirstIncomeDate = `${formLocate}//*[@data-control-name="Периодичность_выплаты_пенсии"]//*[@data-control-name="Первое_число"]//input`
    this.pensionSecondIncomeDate = `${formLocate}//*[@data-control-name="Периодичность_выплаты_пенсии"]//*[@data-control-name="Второе_число"]//input`
    this.pensionIncomeComment = `${formLocate}//*[@data-control-name="Периодичность_выплаты_пенсии"]//*[@data-control-name="Другое_поле_ввода"]//input`
    //Выпадающие списки
    this.pensionFrequency = `${formLocate}//*[@data-control-name="Периодичность_выплаты_пенсии"]//span[text()='${client.incomeAndExpenses.frequency}']`
    this.frequency = `${formLocate}//*[@data-control-name="Периодичность_выплаты_дохода"]//*[@data-control-name="Количество_выплат"]//span[text()='${client.incomeAndExpenses.frequency}']`
  }
  /**
   * Заполнение блока Сведения о доходах и расходах (за вычетом налога 13%)
   * @param {Object} client - объект тестовых данных клиента
   */
  async fillPageFragment(client) {
    await I.cFillField(this.mainIncome, client.incomeAndExpenses.mainIncome)
    if (client.otherPersonalInformation.socialStatus === 'Работающий пенсионер') {
      I.wait(5)
      await I.cFillField(this.firstOtherIncomeAmount, client.incomeAndExpenses.firstOtherIncome.amount)
      await I.cFillField(this.firstOtherIncomeFrequency, client.incomeAndExpenses.firstOtherIncome.frequency)
      await I.cClick(this.frequency)
      await I.cClick(this.pensionFrequency)
      if (client.incomeAndExpenses.frequency === 'Один раз в месяц') {
        await I.cFillField(this.firstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
        await I.cFillField(this.pensionFirstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
      }
      if (client.incomeAndExpenses.frequency === 'Два раза в месяц') {
        await I.cFillField(this.firstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
        await I.cFillField(this.pensionFirstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
        await I.cFillField(this.secondIncomeDate, client.incomeAndExpenses.secondIncomeDate)
        await I.cFillField(this.pensionSecondIncomeDate, client.incomeAndExpenses.secondIncomeDate)
      }
      if (client.incomeAndExpenses.frequency === 'Другое') {
        await I.cFillField(this.incomeComment, client.incomeAndExpenses.incomeComment)
        await I.cFillField(this.pensionIncomeComment, client.incomeAndExpenses.incomeComment)
      }
    } else {
      if (client.incomeAndExpenses.otherIncome) {
        let checkBoxStatus = await I.cGrabAttributeFrom(this.otherIncomeStatus, 'class')
        if (checkBoxStatus.indexOf('checked') === -1) {
          await I.cClick(this.otherIncome)
          I.wait(5)
          await I.cFillField(this.firstOtherIncomeAmount, client.incomeAndExpenses.firstOtherIncome.amount)
          await I.cClickFillList(this.firstOtherIncomeSource, client.incomeAndExpenses.firstOtherIncome.source)
          await I.cFillField(this.firstOtherIncomeFrequency, client.incomeAndExpenses.firstOtherIncome.frequency)
          if (client.incomeAndExpenses?.secondOtherIncome) {
            await I.cFillField(this.secondOtherIncomeAmount, client.incomeAndExpenses.secondOtherIncome.amount)
            await I.cClickFillList(this.secondOtherIncomeSource, client.incomeAndExpenses.secondOtherIncome.source)
            await I.cFillField(this.secondOtherIncomeFrequency, client.incomeAndExpenses.secondOtherIncome.frequency)
            if (client.incomeAndExpenses?.thirdOtherIncome) {
              await I.cFillField(this.thirdOtherIncomeAmount, client.incomeAndExpenses.thirdOtherIncome.amount)
              await I.cClickFillList(this.thirdOtherIncomeSource, client.incomeAndExpenses.thirdOtherIncome.source)
              await I.cFillField(this.thirdOtherIncomeFrequency, client.incomeAndExpenses.firstOtherIncome.frequency)
            }
          }
        }
      }
      if (client.otherPersonalInformation.socialStatus === 'Пенсионер') {
        await I.cClick(this.pensionFrequency)
      } else {
        await I.cClick(this.frequency)
      }
      if (client.incomeAndExpenses.frequency === 'Один раз в месяц') {
        if (client.otherPersonalInformation.socialStatus === 'Пенсионер') {
          await I.cFillField(this.pensionFirstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
        } else {
          await I.cFillField(this.firstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
        }
      }
      if (client.incomeAndExpenses.frequency === 'Два раза в месяц') {
        if (client.otherPersonalInformation.socialStatus === 'Пенсионер') {
          await I.cFillField(this.pensionFirstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
          await I.cFillField(this.pensionSecondIncomeDate, client.incomeAndExpenses.secondIncomeDate)
        } else {
          await I.cFillField(this.firstIncomeDate, client.incomeAndExpenses.firstIncomeDate)
          await I.cFillField(this.secondIncomeDate, client.incomeAndExpenses.secondIncomeDate)
        }
      }
      if (client.incomeAndExpenses.frequency === 'Другое') {
        if (client.otherPersonalInformation.socialStatus === 'Пенсионер') {
          await I.cFillField(this.pensionIncomeComment, client.incomeAndExpenses.incomeComment)
        } else {
          await I.cFillField(this.incomeComment, client.incomeAndExpenses.incomeComment)
        }
      }
    }
  }
}

module.exports = { IncomeAndExpenses }
