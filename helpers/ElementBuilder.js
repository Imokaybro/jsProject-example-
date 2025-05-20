class ElementBuilder {
  constructor(form, fragment) {
    this.form = form ? form : ''
    this.fragment = fragment ? fragment : ''
  }

  /**
   * Создание локатора элемента формы
   * @param {*} element - data-control-name элемента, только само название
   * @param {*} type - тип элемента (button, field и т.д.)
   * @returns возвращает строку локатора
   */
  async element(element, type = 'field') {
    let typeOfClass = ''
    if (type === 'button') {
      typeOfClass = '//*[@class="ui-button-text ui-button-in-line"]'
    }
    if (type === 'field') {
      typeOfClass = '//input'
    }
    if (type === 'dropDown') {
      typeOfClass = '//*[@class="dropdown-trigger unselectable"]'
    }
    if (type === 'checkbox') {
      typeOfClass = '//*[@class="checkbox"]'
    }

    const locator = `${this.form}${this.fragment}//*[@data-control-name="${element}"]${typeOfClass}`
    return locator
  }
}

module.exports = ElementBuilder
