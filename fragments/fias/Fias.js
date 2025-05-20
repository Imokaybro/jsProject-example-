const { I } = inject()

/**
 * @param {String} formLocate waits for the input name of sub form date-control-form.
 * //*[@data-control-name="${formLocate}"]
 */
class Fias {
  /**
   * Set location for all object on this form. XPath, CSS.
   */
  constructor(formLocate) {
    this.region = `//*[@data-control-name="${formLocate}"]//input[@name="region"]`
    this.area = `//*[@data-control-name="${formLocate}"]//input[@name="district"]`
    this.city = `//*[@data-control-name="${formLocate}"]//input[@name="city"]`
    this.settlement = `//*[@data-control-name="${formLocate}"]//input[@name="locality"]`
    this.street = `//*[@data-control-name="${formLocate}"]//input[@name="street"]`
    this.house = `//*[@data-control-name="${formLocate}"]//input[@name="house"]`
    this.frame = `//*[@data-control-name="${formLocate}"]//input[@name="build"]`
    this.structure = `//*[@data-control-name="${formLocate}"]//input[@name="struc"]`
    this.room = `//*[@data-control-name="${formLocate}"]//input[@name="room"]`
    this.postIndex = `//*[@data-control-name="${formLocate}"]//input[@name="index"]`
    this.disableFias = `//*[@data-control-name="${formLocate}"]//*[@class="checkbox "]`
    this.streetSocr = `//*[@data-control-name="${formLocate}"]//*[@data-input="streetsocr"]//input`
  }

  async fillPageFragment(address) {
    await I.retry(3).cFillListFIAS(this.region, address.region)
    if (address.area) {
      await I.retry(3).cFillListFIAS(this.area, address.area)
    }
    if (address.city) {
      await I.retry(3).cFillListFIAS(this.city, address.city)
    }
    if (address.settlement) {
      await I.retry(3).cFillListFIAS(this.settlement, address.settlement)
    }
    await I.retry(3).cFillListFIAS(this.street, address.street)
    if (address.corp) {
      await I.retry(3).cFillListFIAS(this.house, address.corp)
    }
    await I.retry(3).cFillListFIAS(this.house, address.house)
    if (address.frame) {
      await I.retry(3).cFillListFIAS(this.frame, address.frame)
    }
    if (address.structure) {
      await I.retry(3).cFillListFIAS(this.structure, address.structure)
    }
    if (address.room) {
      await I.retry(3).cFillListFIAS(this.flat, address.room)
    }
    if (address.postIndex) {
      await I.retry(3).cFillField(this.postIndex, address.postIndex)
    }
    //Отключение фиаса, в случае когда блок не хочет искать улицу
    const streetNotFilled = await tryTo(() => I.waitForText('Поле заполнено не по ФИАС', 1))
    if (streetNotFilled) {
      await I.cClick(this.disableFias)
      await I.retry(3).cFillListFIAS(this.street, address.street)
      await I.retry(3).cFillListFIAS(this.streetSocr, 'ул')
    }
  }
}

module.exports = { Fias }
