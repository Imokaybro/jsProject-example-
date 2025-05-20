const { I } = inject()

class ContextError {
  async grab() {
    if (codeceptjs.config.get().fatalContextError) {
      const contextError = await tryTo(() => I.waitForElement('//*[@class="errors-content"]//*[@class="text"]', 1))
      if (contextError) {
        const valueError = +(await I.grabTextFrom('//*[@class="errors-content"]//*[@class="text"]'))
        if (valueError > 0) {
          await I.cClick('//*[@class="errors-content"]//*[@class="text"]')
          const error = await I.grabTextFromAll('//*[@class="wrapperInner"]//*[contains(@class, "errorMsg ")]')
          await I.cSay(error)
          throw new Error(error)
        }
      }
    }
  }
}

module.exports = ContextError
