const Helper = require('@codeceptjs/helper')

class ErrorMonitor extends Helper {
  // Отслеживание контекстных ошибок в процессе выполнения сценария
  async errorMonitor() {
    const { page } = this.helpers.Puppeteer
    var ContextError = []
    await page.exposeFunction('errorContext', async () => {
      ContextError.push(await this.getError())
      const allure = codeceptjs.container.plugins('allure')
      allure.addLabel('ContextError', ContextError.join())
      allure.createStep(ContextError.join())
    })
    await page.evaluate(() => {
      $('.icon22.errors').bind('DOMSubtreeModified', function () {
        window.errorContext()
      })
    })
  }

  // Получаем текст ошибки и добавляем в массив ContextError
  async getError() {
    const { page } = this.helpers.Puppeteer
    await page.waitForSelector('.errors-content')
    await page.click('.errors-content')
    try {
      let value = await page.evaluate(() => document.getElementsByClassName('wrapperInner')[0].innerText)
      console.log(value)
      return value
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = ErrorMonitor
