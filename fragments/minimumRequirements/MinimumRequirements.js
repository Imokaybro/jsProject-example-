const { I } = inject()

/**
 * FormName: Денежные_кредиты.Формы.Параметры_кредита
 * SubForm: Денежные_кредиты.Формы.sub_Минимальные_требования
 * issue: FIS-6707, FIS-6184
 */
class MinimumRequirements {
  constructor() {
    const baseNameAttrForm = '//*[@data-control-name="Соответствие_минимальным_требованиям"]'
    this.meetsTheMinReqLocate = `${baseNameAttrForm}//*[@data-control-name="Группа_переключателей_2"]//*[text()="да"]/..//*[@class="radiobutton"]`
    this.notMeetsTheMinReqLocate = `${baseNameAttrForm}//*[@data-control-name="Группа_переключателей_2"]//*[text()="нет"]/..//*[@class="radiobutton"]`
    this.permRegistrationLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_1"]//*[text()="да"]/..//*[@class="radiobutton"]`
    this.notPermRegistrationLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_1"]//*[text()="нет"]/..//*[@class="radiobutton"]`
    this.actuallyLivesLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_2"]//*[text()="да"]/..//*[@class="radiobutton"]`
    this.notActuallyLivesLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_2"]//*[text()="нет"]/..//*[@class="radiobutton"]`
    this.employedLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_3"]//*[text()="да"]/..//*[@class="radiobutton"]`
    this.notEmployedLocate = `${baseNameAttrForm}//*[@data-control-name="Повторитель_вертикальный_1"]//*[@data-control-name="Cells.Item_3"]//*[text()="нет"]/..//*[@class="radiobutton"]`
  }

  /**
   * Заполнение минимальных требований по клиенту
   * @param {Object} client - объект с тестовыми данными клиента
   */
  async fillPageFragment(client) {
    switch (client.minimumRequirements) {
      case true:
        await I.cClick(this.meetsTheMinReqLocate)
        break
      case false:
        await I.cClick(this.notMeetsTheMinReqLocate)
        I.wait(1)
        client.permRegistration
          ? await I.cClick(this.permRegistrationLocate)
          : await I.cClick(this.notPermRegistrationLocate)
        client.actuallyLives ? await I.cClick(this.actuallyLivesLocate) : await I.cClick(this.notActuallyLivesLocate)
        client.employed ? await I.cClick(this.employedLocate) : await I.cClick(this.notEmployedLocate)
        break
      default:
        null
        break
    }
  }
}

module.exports = { MinimumRequirements }
