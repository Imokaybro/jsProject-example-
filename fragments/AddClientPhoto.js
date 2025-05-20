const { I } = inject()
/**
 * Добавление фото клиента
 */
class AddClientPhoto {
  #photo = "//div[@data-control-name='Фото_клиента']//span[text()='КАМЕРА']"
  #takePictureButton = '//span[contains(text(), "СДЕЛАТЬ СНИМОК")]'
  #save = '//*[contains(@class, "videoStreamWindow")]//span[contains(text(), "СОХРАНИТЬ")]'
  /**
   * Метод делающий и сохраняющий фото клиента
   */
  async takePicture() {
    I.waitForElement(this.#photo, 30)
    I.wait(3)
    await I.cClick(this.#photo)
    I.wait(1)
    await I.cClick(this.#takePictureButton)
    await I.cClick(this.#save)
  }
}

module.exports = { AddClientPhoto }
