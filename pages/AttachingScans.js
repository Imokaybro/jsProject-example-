const { AddClientPhoto } = require('../fragments/AddClientPhoto')
const CheckRegistrationOfCollateral = require('../fragments/negativeChecks/CheckRegistrationOfCollateral')
const { TransitionConfirmationOfSigning } = require('../fragments/transition/TransitionConfirmationOfSigning')
const { TransitionPrintedDocs } = require('../fragments/transition/TransitionPrintedDocs')
const { I } = inject()
/**
 * Этап регистрации залога
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Прикрепление_сканов_новое_метком}.
 * FormName: Прикрепление сканов (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Прикрепление_сканов_новое_метком)
 */
class AttachingScans {
  #scan = name => {
    return `//*[text()="${name}"]/..//*[@class='attach-button']`
  }
  #next = '//*[@data-control-name="Кнопка_Далее"]//*[@class="ui-button-text ui-button-in-line"]'
  /**
   * Заполнение этапа регистрации залога
   * @param {object} credit - объект тестовых данных кредита
   */
  async fillPage(credit) {
    await I.cSay('----------Осуществлен переход на этап: "Регистрация залога"----------')
    await new AddClientPhoto().takePicture()
    if (!credit?.parameters?.program?.includes('рассрочк')) {
      await I.scanDocumentLoad(this.#scan('Заявление о предоставлении кредита автокредита'))
    }
    const insurance = await tryTo(() => I.waitForText('Заявление на списание платы за страхование', 5))
    if (insurance) {
      await I.scanDocumentLoad(this.#scan('Заявление на списание платы за страхование'))
    }
    if (credit.cardHALVA?.limit && credit.cardHALVA.limit !== '0.1') {
      if (!credit?.cardHALVA?.existingHalva) {
        await I.scanDocumentLoad(this.#scan('Заявление о предоставлении потребительского кредита(Халва)'))
      }
    }
    if (credit.auto?.contract) {
      await I.scanDocumentLoad(this.#scan('Договор купли продажи'))
      await I.scanDocumentLoad(this.#scan('Заявление на аккредитив'))
    }
    await new TransitionPrintedDocs().transitionRegistrationCollateral(credit)
  }

  async checkPhoto(credit) {
    await I.cSay('----------Осуществлен переход на этап: "Регистрация залога"----------')
    if (!credit.parameters.program.includes('рассрочк')) {
      await I.scanDocumentLoad(this.#scan('Заявление о предоставлении кредита автокредита'))
    }
    const insurance = await tryTo(() => I.waitForText('Заявление на списание платы за страхование', 5))
    if (insurance) {
      await I.scanDocumentLoad(this.#scan('Заявление на списание платы за страхование'))
    }
    await I.cClick(this.#next)
    I.waitForText('Необходимо добавить фото клиента', 5)
  }
  /**
   * Негативная проверка на прикрепление сканов
   */
  async checkScan() {
    await I.cSay('----------Осуществлен переход на этап: "Регистрация залога"----------')
    await new AddClientPhoto().takePicture()
    await new CheckRegistrationOfCollateral().advancedCheck()
  }
  /**
   * Заполнение формы для процесса оформления КНПА
   */
  async fillPageKNPA() {
    await new AddClientPhoto().takePicture()
    await I.scanDocumentLoad(this.#scan('Анкета'))
    await new TransitionConfirmationOfSigning().transition()
  }
}

module.exports = { AttachingScans }
