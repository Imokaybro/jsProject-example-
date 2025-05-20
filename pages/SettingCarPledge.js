const { TransitionCarPledge } = require('../fragments/transition/TransitionCarPledge')
const { I } = inject()

class SettingCarPledge {
  #scanSlot = name => {
    return `//div[text()="${name}"]/..//*[@class="attach-button"]`
  }
  /*
   * Этап "Данные по залогу"
   */
  async settingCarPledge() {
    await I.scanDocumentLoad(this.#scanSlot('ПТС'))
    await I.scanDocumentLoad(this.#scanSlot('Договор купли-продажи'))
    if (!tags.includes('@setCarPledge')) {
      await new TransitionCarPledge().transition()
    }
  }
}

module.exports = { SettingCarPledge }
