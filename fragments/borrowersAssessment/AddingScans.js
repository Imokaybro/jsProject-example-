const { I } = inject()
/**
 * {@link DELETED:8080/web/conf/#application.DELETED:form.БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Прикрепление_сканов_пдф}.
 * FormName: Прикрепление_сканов_пдф (БанкоDELETEDий_базовый.Кредиты_фл.Формы.Формы_метком.Прикрепление_сканов_пдф)
 */
class AddingScans {
  #attachButton = scanName => `//div[text()="${scanName}"]/..//*[@class="attach-button"]`
  #file = 'data/test.jpg'
  #questionnaire = 'Компонента_Документ_сканы_1'
  #passport = 'Компонента_Документ_сканы_2'
  #passportCertificate = 'Компонента_Документ_сканы_3'
  /**
   * Метод заполнения блока "3. Сканы" для кредитных карт
   */
  async fillPageFragmentCreditCard() {
    if (!tags.includes('@negative')) {
      await I.scanDocumentLoadByButton(this.#questionnaire, '1 страница', this.#file)
      await I.scanDocumentLoadByButton(this.#passport, '2-3 страница', this.#file)
      await I.scanDocumentLoadByButton(this.#passport, 'Регистрация', this.#file)
      await I.scanDocumentLoadByButton(this.#passportCertificate, 'Справка о действительности паспорта', this.#file)
    }
  }
  /**
   * Метод заполнения блока "3. Сканы" для КНПА и товарного кредита
   */
  async fillPageFragment() {
    await I.scanDocumentLoad(this.#attachButton('Анкета'), 'data/test.jpg')
    await I.scanDocumentLoad(this.#attachButton('Справка о действительности паспорта'), 'data/test.jpg')
  }
}

module.exports = { AddingScans }
