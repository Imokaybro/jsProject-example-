const Helper = require('@codeceptjs/helper')

class GrabData extends Helper {
  /**
   * Считывание текста внутри указанного локатора
   * @param {String} locator - локатор элемента
   */
  async cGrabTextFrom(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabTextFrom(locator)
    return result
  }

  async cGrabTextFromAll(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabTextFromAll(locator)
    return result
  }

  async cGrabValueFrom(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabValueFrom(locator)
    return result
  }

  async cGrabValueFromAll(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabValueFromAll(locator)
    return result
  }

  async cGrabAttributeFrom(locator, attribute) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabAttributeFrom(locator, attribute)
    return result
  }

  async cGrabNumberOfVisibleElements(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await CustomMethod.waitFormLoad()
    let result = await Puppeteer.grabNumberOfVisibleElements(locator)
    return result
  }
}

module.exports = GrabData
