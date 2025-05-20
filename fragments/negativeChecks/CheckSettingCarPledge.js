const { I } = inject()

class CheckSettingCarPledge {
  #input = name => {
    return `//*[@data-control-name="${name}"]//input`
  }
  #list = name => {
    return `//*[@data-control-name="${name}"]//*[@class="dropdown-trigger unselectable"]`
  }
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  #currentStage = name => {
    return `//*[@data-control-name="Стадии_анкеты_1"]//*[@class="active"]//div[text()="${name}"]`
  }
  #carType = type => {
    return `//*[@data-control-name="Группа_переключателей_характеристика_авто"]//*[text()="${type}"]/../*[@class="radiobutton"]`
  }
  #errorContent = text => {
    return `//*[@class="tt-content"][text()="${text}"]`
  }

  /**
   * Негативные проверки на этапе "Данные по залогу"
   */
  async check() {
    await I.cClickList(this.#list('Раскрывающийся_список_договор'), '<не выбрано>')
    await I.cClick(this.#button('Кнопка_Далее'))
    I.wait(5)
    I.waitForVisible(this.#currentStage('Данные по залогу'))
    await I.cClickList(this.#list('Раскрывающийся_список_договор'), 'КнК на покупку Авто')
    await I.cClick(this.#carType('Подержанный'))
    I.waitForVisible(this.#errorContent('Пробег подержанного автомобиля должен быть более 1000 км'), 3)
    await I.cClick(this.#button('Кнопка_Далее'))
    I.wait(5)
    I.waitForVisible(this.#currentStage('Данные по залогу'))
    await I.cClick(this.#carType('Новый'))
    await I.cClearField(this.#input('Поле_ввода_VIN'))
    await I.lossOfFocus()
    await I.cClick(this.#button('Кнопка_Далее'))
    I.wait(5)
    I.waitForVisible(this.#currentStage('Данные по залогу'))
  }
}

module.exports = CheckSettingCarPledge
