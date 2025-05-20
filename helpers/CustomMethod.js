const Helper = require('@codeceptjs/helper')
/**
 * Класс кастомных методов, адаптированных для платформы
 */
class CustomMethod extends Helper {
  /**
   * Вывод в лог, замена стандартного I.say, он не читается в шагах testIt
   * @param {String} msg - строка вывода логи
   * @param {String} color - цвет
   */
  async cSay(msg, color = 'cyan') {
    codeceptjs.actor().say(msg, color)
  }

  /**
   * Блок ожидания загрузки элементов формы
   */
  async waitFormLoad() {
    const { Puppeteer } = this.helpers

    await Puppeteer.wait(0.5)
    // possible form status
    const fSt = {
      saving: 'contains(@data-form-status,"saving")',
      reloading: 'contains(@data-form-status,"reloading")',
      submitted: 'contains(@data-form-status,"submitted")',
      'lazy-loading': 'contains(@data-form-status,"lazy-loading")',
      'in-event': 'contains(@data-form-status,"in-event")',
    }
    await Puppeteer.waitForDetached(
      `//*[${fSt.saving} and ${fSt.reloading} and ${fSt.submitted} and ${fSt['in-event']}]`,
      30,
    )
    await Puppeteer.wait(0.1)
  }

  /**
   * Клик по элементу
   * @param {String} locator - локатор элемента
   */
  async cClick(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForVisible(locator, 180)
    await CustomMethod.waitFormLoad()
    await Puppeteer.click(locator)
  }

  /**
   * Force Клик по элементу
   * @param {String} locator - локатор элемента
   */
  async cForceClick(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForVisible(locator, 150)
    await CustomMethod.waitFormLoad()
    await Puppeteer.forceClick(locator)
  }

  /**
   * Заполнение значения в поле
   * @param {String} locator локатор элемента
   * @param {String} data данные для ввода
   */
  async cFillField(locator, data) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await CustomMethod.cClick(locator)
    await Puppeteer.fillField(locator, data)
    await CustomMethod.waitFormLoad()
  }

  /**
   * Выбор элемента из выпадающего списка через клик в элемент из выпадающего списка
   * @param {String} listLocate локатор кнопки раскрытия списка
   * @param {String} dataLocate локатор варианта из списка
   */
  async cClickList(listLocate, dataLocate) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await CustomMethod.cClick(listLocate)
    await Puppeteer.waitForVisible(
      `//*[contains(@class, "dropdown") and not(contains(@style, "display: none"))]//*[text()[contains(.,'${dataLocate}')]]`,
      10,
    )
    await Puppeteer.wait(1)
    await CustomMethod.cClick(
      `//*[contains(@class, "dropdown") and not(contains(@style, "display: none"))]//*[text()[contains(.,'${dataLocate}')]]`,
    )
  }

  /**
   * Проверка формирования печатных документов
   * @param {Array} documents - ввод массива документов для проверки
   */
  async checkDocuments(documents) {
    const { Puppeteer } = this.helpers

    for (const document of documents) {
      await Puppeteer.waitForText(document, 200)
    }
  }

  /**
   * Выбор элемента из выпадающего списка через заполнение поля и нажатия enter
   * @param {String} locator локатор поля списка
   * @param {String} data данные для ввода
   */
  async cFillList(locator, data) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await CustomMethod.cClick(locator)
    await CustomMethod.cFillField(locator, data)
    await Puppeteer.pressKey('ArrowDown')
    await Puppeteer.wait(0.1)
    await Puppeteer.waitForVisible(
      '//*[contains(@class, "ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all vcm-dropdown")][contains(@style, "display: block")]',
      10,
    )
    await Puppeteer.pressKey('Enter')
    await CustomMethod.waitFormLoad()
  }

  /**
   * Выбор элемента из выпадающего списка через заполнение поля и нажатия enter
   * @param {String} locator локатор поля списка
   * @param {String} data данные для ввода
   */
  async cFillListFIAS(locator, data) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await CustomMethod.cClick(locator)
    await CustomMethod.cFillField(locator, data)
    await Puppeteer.waitForVisible('//*[contains(@class, "dropdown") and not(contains(@style, "display: none"))]', 10)
    await Puppeteer.pressKey('Enter')
  }

  /**
   * Выбор элемента из выпадающего списка через заполнение поля и нажатия на элемент
   * @param {String} locator локатор поля списка
   * @param {String} data данные для ввода
   */
  async cClickFillList(locator, data) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await CustomMethod.cClick(locator)
    await Puppeteer.clearField(locator)
    await CustomMethod.cFillField(locator, data)
    await CustomMethod.cClick(
      `//*[contains(@class, "dropdown") and not(contains(@style, "display: none"))]//*[text()[contains(.,'${data}')]]`,
    )
    await CustomMethod.lossOfFocus()
  }

  /**
   * Двойной клик по элементу
   * @param {String} locator локатор элемента
   */
  async cDoubleClick(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForEnabled(locator, 150)
    await Puppeteer.scrollTo(locator)
    await Puppeteer.waitForVisible(locator, 150)
    await CustomMethod.waitFormLoad()
    await Puppeteer.waitForClickable(locator, 50)
    await Puppeteer.click(locator)
    await Puppeteer.doubleClick(locator)
  }

  /**
   * Получение данных из консоли udm после ввода команды, консоль должна быть очищена перед вводом последней команды1
   */
  async getFromUdmConsole() {
    const { Puppeteer } = this.helpers
    const { GrabData } = this.helpers

    await Puppeteer.pressKey(['Control', 'q'])
    await Puppeteer.waitForVisible("//*[@class='response']", 150)
    await Puppeteer.wait(0.5)
    let udmData = await GrabData.cGrabTextFromAll("//*[@class='response']")
    udmData = udmData[0].split(']')[1]
    await Puppeteer.pressKey(['Control', 'q'])
    return udmData
  }

  /**
   * Selects a checkbox
   * @param {String} locator локатор элемента (чек-бокса / радиобатона)
   */
  async cCheckOption(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { GrabData } = this.helpers

    await Puppeteer.waitForVisible(locator, 150)
    if ((await GrabData.cGrabAttributeFrom(`${locator}/../..`, 'class')).indexOf('checked') === -1) {
      await CustomMethod.cClick(locator)
    }
  }
  /**
   * Unselects a checkbox
   * @param {String} locator локатор элемента (чек-бокса)
   */
  async cUnCheckOption(locator) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    const { GrabData } = this.helpers

    await Puppeteer.waitForVisible(locator, 150)
    if ((await GrabData.cGrabAttributeFrom(`${locator}/../..`, 'class')).indexOf('checked') >= 0) {
      await CustomMethod.cClick(locator)
    }
  }

  /**
   * Загрузка скана документа по локатору
   * @param {String} locator - локатор кнопки добавления скана
   * @param {String} file - выбор формата прикладываемого файла (доступно data/test.jpg и scan.pdf)
   */
  async scanDocumentLoad(locator, file = 'data/scan.pdf') {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    if (!codeceptjs.config.get().skipChooser)
      await Puppeteer.usePuppeteerTo('catch file chooser', async ({ page }) => {
        page.waitForFileChooser()
      })
    await CustomMethod.cClick(locator)
    await Puppeteer.attachFile('//input[@type="file"][position()=last()]', file)
    await CustomMethod.waitFormLoad()
    await Puppeteer.wait(1)
  }

  /**
   * загрузка скана через кнопку с предварительным выбором слота(для многостраничных документов)
   * @param {String} block - наименование блока скана
   * @param {String} page - наименование страницы скана
   * @param {String} file - выбор формата прикладываемого файла (доступно data/test.jpg и scan.pdf)
   */
  async scanDocumentLoadByButton(block, page, file = 'data/scan.pdf') {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    if (!codeceptjs.config.get().skipChooser)
      await Puppeteer.usePuppeteerTo('catch file chooser', async ({ page }) => {
        page.waitForFileChooser()
      })
    await CustomMethod.cClick(`//*[@data-control-name="${block}"]//div[@class="row-inner"][text()="${page}"]`)
    await CustomMethod.cClick(`//*[@data-control-name="${block}"]//span[@class="ui-button-text"][text()='ФАЙЛ']`)
    await Puppeteer.attachFile('//input[@type="file"][position()=last()]', file)
    await CustomMethod.waitFormLoad()
    await Puppeteer.wait(1)
  }

  /**
   * Выбор стенда РБС для автоюзера
   * @param {String} login - логин автоюзера, например autouser1
   * @param {String} rbs - выбранный рбс, например RBSSUP2
   */
  async changeRBS(login, rbs) {
    const { CustomMethod } = this.helpers

    rbs = rbs || process.env.RBS || codeceptjs.config.get().rbs
    await CustomMethod.postToUdmConsole(
      `Базовый:Пользователь:По_логину_не_удаленные(ТЕКУЩИЙПОЛЬЗОВАТЕЛЬ())[0].выбранный_рбс := "${rbs}"`,
    )
    await CustomMethod.postToUdmConsole(`Базовый:Пользователь:По_логину("${login}")[0].ид_в_рбс := "13662868"`)
  }

  /**
   * Ввод команд в UDM консоль
   * @param {string} command - команда, которую требуется ввести в консоль.
   * @param {string} context - локатор из атрибута data-form-name во вкладке "структура формы" консоли.
   */
  async postToUdmConsole(command, context) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers
    await CustomMethod.waitFormLoad()
    await Puppeteer.pressKey(['Control', 'q'])
    await Puppeteer.waitForVisible('//*[@class="console-container"]//input', 150)
    await Puppeteer.click("//*[@class='VCMConsole']//*[@data-action-name='clear']")

    if (context) {
      await Puppeteer.click('//*[@class="VCMConsole"]//*[@data-action-name="context"]')
      await Puppeteer.wait(1)
      await Puppeteer.click('//*[@class="update-widget-btn"]')
      await Puppeteer.waitForVisible(`//*[@class="forms"]//*[@data-form-name="${context}"]`, 150)
      await Puppeteer.click(`//*[@class="forms"]//*[@data-form-name="${context}"]`)
    }

    await Puppeteer.click('//*[@class="VCMConsole"]//*[@data-action-name="console"]')
    await Puppeteer.waitForVisible('//*[@class="console-container"]//input', 150)
    await Puppeteer.fillField('//*[@class="console-container"]//input', command)
    await Puppeteer.wait(0.5)
    await Puppeteer.pressKey('Enter')
    await Puppeteer.waitForVisible('//*[@class="response"]', 150)
    await Puppeteer.dontSeeElement('//*[@class="console-container"]//*[@class="error"]')
    await Puppeteer.pressKey(['Control', 'q'])
  }

  /**
   * Подмена ответа от ДЕСС
   * @param {string} response - строка, в которой передаем нужное решение от ДЕСС(Да, Нет, Временный отказ)
   */
  async replacingResponseFromDESS(response) {
    const { Puppeteer } = this.helpers

    await Puppeteer.pressKey(['Control', 'q'])
    await Puppeteer.waitForVisible('//*[contains (text(), "Структура формы")]', 150)
    await Puppeteer.click('//*[contains (text(), "Структура формы")]')
    await Puppeteer.waitForVisible(
      '//p[text()="Результат_ответа_системы (Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Результат_ответа_диспетчерской)"]',
      150,
    )
    await Puppeteer.click(
      '//p[text()="Результат_ответа_системы (Кредиты_фл.Формы.Для_процесса_оформления_кредита.DESS.Результат_ответа_диспетчерской)"]',
    )
    await Puppeteer.waitForVisible('//*[text()="Консоль"]', 150)
    await Puppeteer.click('//*[text()="Консоль"]')
    await Puppeteer.waitForVisible('input.input', 150)
    await Puppeteer.fillField('input.input', `Ответ:='${response}'`)
    await Puppeteer.pressKey('Enter')
    await Puppeteer.pressKey(['Control', 'q'])
    await Puppeteer.refreshPage()
  }

  /**
   * Добавление должностей для автоюзера
   * @param {String} posts - наименование должности/ей
   */
  async addPosts(posts) {
    const { CustomMethod } = this.helpers
    const { Puppeteer } = this.helpers

    if (posts) {
      for (let index of posts) {
        await CustomMethod.postToUdmConsole(
          `Кредиты_юл:add_position_to_user("${
            codeceptjs.container.support().usernameAuto || codeceptjs.container.support().usernameLA
          }", "${index}")`,
        )
      }
      await Puppeteer.refreshPage()
      await CustomMethod.waitFormLoad()
    }
  }

  /**
   * Вывод сообщения с данными заявки
   * @param {object} client - объект с тестовыми данными клиента
   * @param {object} credit - объект с тестовыми данными кредита
   */
  async grabAndSayApplicationData(client, credit) {
    const { Puppeteer } = this.helpers
    const { CustomMethod } = this.helpers

    await Puppeteer.waitForVisible('//*[@data-control-name="Стадии_анкеты_1"]', 30)
    await Puppeteer.waitForVisible(
      '//*[@data-control-name="Текст_атрибуты"]//*[@class="jq_text_wrapper txtstyle-normal runtime"]',
      5,
    )
    await CustomMethod.waitFormLoad()
    const applicationNumber = await Puppeteer.grabTextFrom(
      '//*[@data-control-name="Текст_атрибуты"]//*[@class="jq_text_wrapper txtstyle-normal runtime"]//span',
    )
    credit.applicationNumber = applicationNumber
    await CustomMethod.cSay(
      `Клиент: ${client.fullName}; Паспорт: ${client.passport.serialAndNumber}; Заявка: ${credit.applicationNumber}`,
    )
  }

  /**
   * Обертка для уменьшения длины кода в проекте
   * Потеря фокуса
   */
  async lossOfFocus() {
    const { Puppeteer } = this.helpers
    await Puppeteer.executeScript(() => {
      document.activeElement.blur()
    })
    await Puppeteer.wait(0.5)
  }

  /**
   * @param {String} head Locator of table head
   * @param {String} body Locator of table body
   * @returns list of objects. Where object keys = table head. Example:
   * ```js
   * [{"name": "firstName", "surname": "surname"},{"name": "firstName1", "surname": "surname1"}]
   * ```
   */
  async grabDataFromTable(head, body) {
    const page = this.helpers.Puppeteer
    const method = this.helpers['CustomMethod']

    await page.wait(1)
    await method.waitFormLoad()
    await page.wait(1)

    const tableHead = await page.grabTextFromAll(head)
    const tableBody = await page.grabTextFromAll(body)

    const cellsCount = tableBody.length
    const columnsCount = tableHead.length
    const rowsCount = Math.floor(cellsCount / columnsCount)

    const table = []
    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
      const row = tableBody.slice(rowNumber * columnsCount, rowNumber * columnsCount + columnsCount)

      const rowObj = {}
      tableHead.forEach((columnName, columnIndex) => {
        rowObj[columnName] = row[columnIndex].replaceAll(/\xa0/g, ' ')
      })
      table.push(rowObj)
    }

    return table
  }
}

module.exports = CustomMethod
