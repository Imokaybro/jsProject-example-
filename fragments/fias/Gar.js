const { I } = inject()

/**
 * Базовый класс ГАР
 * form.Интеграция_с_дадата.Формы.Адрес_по_ГАР
 */
class Gar {
  countryLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Страна"]//input`
  regionLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Регион"]//input`
  regionUiWidgetLocate = region =>
    `//*[contains(@class, "ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all vcm-dropdown")][not(contains(@style, "display: none;"))]//*[text()="${region}"]` //[contains(@style, "display: block")] - куда-то пропал кусок
  areaLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Район"]//input`
  areaTypeLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_тип_Района"]//input`
  cityLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Город"]//input`
  cityTypeLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_тип_Города"]//input`
  settlementLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Населенный_пункт"]//input`
  settlementTypeLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_тип_Населенного_пункта"]//input`
  planningStructureLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Планировочная_структура"]//input`
  planningStructureTypeLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_тип_Планировочной_структуры"]//input`
  streetLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Улица"]//input`
  streetTypeLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_тип_Улицы"]//input`
  houseLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Дом"]//input`
  frameLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Корпус"]//input`
  structureLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Строение"]//input`
  flatLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Квартира"]//input`
  postIndexLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Поле_ввода_Индекс"]//input`
  visibleFiasLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="Рамка_Адрес_по_полям"][@style="display: none;"]`
  showFiasLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@class="ui-button-text ui-button-in-line"]`
  disabledFiasLocate = () => `//*[@data-control-name="${this.subFormLocator}"]//*[@name="disable-kladr"]/..`
  checkAndSaveButtonLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@data-control-name="Рамка_Адрес_по_полям"]//*[@data-control-name="Кнопка_Проверить_адрес_по_полям" and not(contains(@style, "display: none"))]//span[text()="ПРОВЕРИТЬ И СОХРАНИТЬ"]`
  validateWindowLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[text()="Внимание! Данные были изменены"]`
  closeValidateWindowLocate = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//*[@type="button" and @value="Закрыть"]`
  helperField = () =>
    `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="Поле_ввода_адреса_с_подсказками"]//input`
  firstAddress = () => `//ul[not(contains(@style, "display: none"))]//a//span[@class="ui-menu-item-label"]`
  constructor(subFormLocator) {
    this.subFormLocator = subFormLocator
    this.garControlName = 'Адрес_по_ГАР_1'
  }
  /**
   * Метод заполнения полей ГАР
   * @param {Object} address - объект с тестовыми данными по адресу
   */
  async fillPageFragment(address) {
    await I.cFillField(this.helperField(), address.searchAddress)
    I.wait(3)
    I.pressKey('Enter')
    I.wait(3)
    await I.cClick(this.firstAddress())
    I.wait(1)
    /*     if (address.country) {
      await I.cFillField(this.countryLocate(), address.country)
    }
    await I.cFillField(this.regionLocate(), address.region)
    await I.cClick(this.regionUiWidgetLocate(address.region))
    if (address.area) {
      await I.cFillField(this.areaLocate(), address.area)
      await I.cFillField(this.areaTypeLocate(), address.areaType)
    }
    if (address.city) {
      await I.cFillField(this.cityLocate(), address.city)
      await I.cFillField(this.cityTypeLocate(), address.cityType)
    }
    if (address.settlement) {
      await I.cFillField(this.settlementLocate(), address.settlement)
      await I.cFillField(this.settlementTypeLocate(), address.placeType)
    }
    if (address.planningStructure) {
      await I.cFillField(this.planningStructureLocate(), address.planningStructure)
      await I.cFillField(this.planningStructureTypeLocate(), address.planningStructureType)
    }
    await I.cFillField(this.streetLocate(), address.street)
    await I.cFillField(this.streetTypeLocate(), address.streetType)
    await I.cFillField(this.houseLocate(), address.house)
    if (address.frame) {
      await I.cFillField(this.frameLocate(), address.frame)
    }
    if (address.structure) {
      await I.cFillField(this.structureLocate(), address.structure)
    }
    if (address.flat) {
      await I.cFillField(this.flatLocate(), address.flat)
    }
    await I.cFillField(this.postIndexLocate(), address.postIndex)
    await I.cClick(this.checkAndSaveButtonLocate()) */
  }

  /**
   * Метод, определяющий, развернут или свернут блок Гар
   * @returns - true/false - развернут или свернут блок Гар
   */
  async checkedVisibleGarBlock() {
    // Если блок свернут, то он не добавляет в дом локатор который проверяет доступность полей для заполнения. Проверяем что есть кнопка раскрытия
    const openGarBlock = await tryTo(() =>
      I.waitForEnabled(
        `//*[@data-control-name="${this.subFormLocator}"]//*[@data-control-name="${this.garControlName}"]//div[@class="edit_button"]//*[@id="Capa_1"]`,
        3,
      ),
    )
    const garIsNotVisible = await tryTo(() => I.waitForEnabled(this.visibleFiasLocate(), 3))
    return openGarBlock || garIsNotVisible
  }
}

module.exports = { Gar }
