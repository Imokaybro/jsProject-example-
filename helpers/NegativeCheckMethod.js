const Helper = require('@codeceptjs/helper')

class NegativeCheckMethod extends Helper {
  /**
   * Проверка отчества на гендерную принадлежность клиента
   * @param {Object} client объект данных клиента
   * @param {String} locator локатор поля
   */
  async patronymicGenderCheck(client, locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers

    if (client.gender === 'Женский') {
      this.patronymic = 'Александрович'
    }
    if (client.gender === 'Мужской') {
      this.patronymic = 'Александровна'
    }
    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, this.patronymic)
    await CustomMethod.cClick(
      '//*[@class="element group horizontal-group __cell-noflex__"]//*[@data-control-name="Кнопка_1"]//*[@class="ui-button-text ui-button-in-line"]',
    )
    await Puppeteer.waitForText('Проверьте правильность заполнения пола клиента', 50)
    await CustomMethod.cClick(
      '//*[@data-control-name="Всплывающее_окно_проверить_пол"]//*[@data-control-name="Кнопка_исправить"]//*[@class="ui-button-text ui-button-in-line"]',
    )
    await CustomMethod.cFillField(locator, client.patronymic)
  }

  /**
   * Проверка просрочки паспорта
   * @param {String} locator локатор поля
   * @param {String} date дата рождения клиента
   * @param {String} value возраст который необходимо проверить (20 или 45 лет)
   */
  async passportExpiry(locator, date, value) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers

    let birthdayDateArray = date.split('.')
    let formatDate = new Date(`${birthdayDateArray[2]} ${birthdayDateArray[1]} ${birthdayDateArray[0]}`)

    formatDate.setDate(formatDate.getDate() - 1)
    formatDate.setFullYear(formatDate.getFullYear() + value)
    let resultDate = formatDate.toLocaleString('ru').split(',')[0]

    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, resultDate)
    await CustomMethod.lossOfFocus()
    await Puppeteer.waitForVisible('//*[text()="Срок действия паспорта РФ истек, "]', 5)
    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, date)
  }

  /**
   * Проверка обязательности поля
   * @param {String} fieldLocator локатор поля
   * @param {String} check текст проверки
   * @param {String} initialValue - значение поля, которое будет введено после проверки(не обязательнй параметр)
   */
  async checkFieldMandatory(fieldLocator, check = 'Обязательно к заполнению', initialValue) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers
    if (!initialValue) {
      initialValue = await Puppeteer.grabValueFrom(fieldLocator)
    }
    await NegativeCheckMethod.cClearField(fieldLocator)
    await Puppeteer.click(fieldLocator)
    await CustomMethod.lossOfFocus()
    await Puppeteer.waitForVisible(`//*[text()="${check}"]`, 5)
    await CustomMethod.cFillField(fieldLocator, initialValue)
  }

  /**
   * Проверка обязательности поля с шаблоном
   * @param {String} fieldLocator локатор поля
   * @param {String} check текст проверки
   * @param {String} initialValue - значение поля, которое будет введено после проверки(не обязательнй параметр)
   */
  async checkTemplateFieldMandatory(fieldLocator, check = 'Обязательно к заполнению', initialValue) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers
    if (!initialValue) {
      initialValue = await Puppeteer.grabValueFrom(fieldLocator)
    }
    await NegativeCheckMethod.cClearField(fieldLocator)
    await Puppeteer.click(fieldLocator)
    await CustomMethod.lossOfFocus()
    if (check === 'Год указан некорректно. Правильное значение больше 1900!') {
      await CustomMethod.cFillField(fieldLocator, '01.01.1900')
    }
    await Puppeteer.waitForVisible(`//*[text()="${check}"]`, 5)
    await CustomMethod.cFillField(fieldLocator, initialValue)
  }
  /**
   * Кастомный метод очистки поля через backspace
   * @param {string} fieldLocator
   */
  async cClearField(fieldLocator) {
    const { Puppeteer } = this.helpers
    let initialValue = await Puppeteer.grabValueFrom(fieldLocator)

    await Puppeteer.clearField(fieldLocator)
    await Puppeteer.wait(0.3)
    await Puppeteer.executeScript(() => {
      document.activeElement.focus()
    })
    for (let i = 0; i < initialValue.length + 1; i++) {
      await Puppeteer.pressKey('Backspace')
      await Puppeteer.wait(0.5)
    }
  }

  /**
   * Проверка граничных значений дат
   * @param {String} locator локатор поля
   * @param {String} lowerBound нижняя граница проверки
   * @param {String} upperBound верхняя граница проверки
   * @param {String} lowerBoundText текст нижней границы проверки
   * @param {String} upperBoundText текст верхней границы проверки
   */
  async checkDate(locator, lowerBound, upperBound, lowerBoundText, upperBoundText) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers

    let initialValue = await Puppeteer.grabValueFrom(locator)

    let lowerDateArray = lowerBound.split('.')
    let formatLowerDate = new Date(`${lowerDateArray[2]} ${lowerDateArray[1]} ${lowerDateArray[0]}`)
    formatLowerDate.setDate(formatLowerDate.getDate() - 1)
    let resultLowerDate = formatLowerDate.toLocaleString('ru').split(',')[0]

    let upperDayArray = upperBound.split('.')
    let formatUpperDate = new Date(`${upperDayArray[2]} ${upperDayArray[1]} ${upperDayArray[0]}`)
    formatUpperDate.setDate(formatUpperDate.getDate() + 1)
    let resultUpperDate = formatUpperDate.toLocaleString('ru').split(',')[0]

    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, resultLowerDate)
    await CustomMethod.lossOfFocus()
    await Puppeteer.waitForVisible(`//*[text()="${lowerBoundText}"]`, 5)
    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, initialValue)
    await CustomMethod.lossOfFocus()
    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, resultUpperDate)
    await CustomMethod.lossOfFocus()
    await Puppeteer.waitForVisible(`//*[text()="${upperBoundText}"]`, 5)
    await NegativeCheckMethod.cClearField(locator)
    await CustomMethod.cFillField(locator, initialValue)
    await CustomMethod.lossOfFocus()
  }
  /**
   * Метод проверки поля на граничные значения(цифры)
   * @param {string} locator - локатор поля
   * @param {number} lowerBound - значение нижней границы
   * @param {string} lowerBoundText - текст уведомления нижней границы
   * @param {number} upperBound - значение верхней границы
   * @param {string} upperBoundText - текст уведомления верхней границы
   */
  async checkInputDigits(locator, lowerBound, lowerBoundText, upperBound, upperBoundText) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers

    let initialValue = await Puppeteer.grabValueFrom(locator)

    if (lowerBound) {
      await NegativeCheckMethod.cClearField(locator)
      await CustomMethod.cFillField(locator, +lowerBound - 1)
      await CustomMethod.lossOfFocus()
      await Puppeteer.waitForVisible(`//*[text()="${lowerBoundText}"]`, 5)
    }
    if (upperBound) {
      await NegativeCheckMethod.cClearField(locator)
      await CustomMethod.cFillField(locator, +upperBound + 1)
      await CustomMethod.lossOfFocus()
      await Puppeteer.waitForVisible(`//*[text()="${upperBoundText}"]`, 5)
    }
    await CustomMethod.cFillField(locator, initialValue)
  }
  /**
   * Метод, при котором выполняется проверка, что без заполнения обязательных полей нельзя перейти далее
   * @param {string} fieldLocator - локатор поля, которое нужно проверить
   * @param {string} buttonLocator - кнопка ухода с формы
   * @param {String} initialValue - значение поля, которое будет введено после проверки(не обязательнй параметр)
   */
  async checkingTransition(fieldLocator, buttonLocator, initialValue) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { NegativeCheckMethod } = this.helpers
    if (!initialValue) {
      initialValue = await Puppeteer.grabValueFrom(fieldLocator)
    }

    await NegativeCheckMethod.cClearField(fieldLocator)
    await CustomMethod.cClick(buttonLocator)
    await Puppeteer.waitForText('Чтобы продолжить, введите важные данные', 5)
    await CustomMethod.cFillField(fieldLocator, initialValue)
  }
}

module.exports = NegativeCheckMethod
