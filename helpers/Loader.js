const { I } = inject()
//Костыль для перезагрузки страницы, если не
class Loader {
  async reload(waitForText) {
    const answerFromDess = await tryTo(() => I.waitForText(waitForText, 250))
    if (!answerFromDess) {
      I.waitForText('Идет обработка...', 2)
      I.refreshPage()
      I.wait(5)
      I.waitForText(waitForText, 5)
    }
  }
}

module.exports = Loader
