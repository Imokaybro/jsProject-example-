const { I } = inject()

/**
 * Загрузка сканов документов клиента
 */
class LoadScans {
  constructor(typeScan) {
    this.scanLocate = `//div[text()="${typeScan}"]/..//div[@class="attach-button"]`
  }

  async fillPageFragment() {
    await I.cClick(this.scanLocate)
    I.attachFile('//input[@type="file"][position()=last()]', 'scan.pdf')
  }
}
module.exports = { LoadScans }
