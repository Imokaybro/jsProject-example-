const ContextError = require('../helpers/ContextError')
const { I } = inject()

/**
 * Класс аунтефикации на стенде
 */
class Authentication {
  constructor() {
    //кнопки
    this.entrance = '//*[@class="auth-field"]//*[@id="submit"]'
    this.logoutButton = '//*[@class="authDropdown profile"]//*[@class="logout"]'
    this.removeAllProcess = '//*[@class="remove-iface-process"]'
    this.confirmRemove =
      '//*[@class="confirmMsgDialog ui-dialog-content ui-widget-content"]//*[@class="button okButton"]'
    this.userProfile = '//*[@class="VCMTopToolbar"]//*[@class="icon22 profile"]'
    this.runApplication = '//*[@class="button-run" or @class="magic-route button_1"]'
    this.refreshApplication =
      '//*[text()="Сейчас ваше приложение будет перезагружено."]/..//*[@class="button okButton"]'
    this.closeNotifications = '//*[@class="toast-element-tools"]//*[@class="ui-dialog-titlebar-close"]'
    this.applicationLayers = '//*[@class="icon22 forms"]'
    this.applicationLayersClose = '//*[@class="authDropdown formChecker"]//li[1]'
    //поля
    this.loginField = '//*[@id="login-wrapper"]//input'
    this.passwordField = '//*[@id="password-wrapper"]//input'
    //выпадающие списки
    this.pointList = '//*[@data-control-name="Раскрывающийся_список_ТО"]//*[@class="dropdown-trigger unselectable"]'
  }
  #anotherSession =
    '//*[@class="ui-dialogFR ui-widgetFR ui-widget-contentFR ui-corner-all ui-frontFR error vcmFront green"]'
  #anotherSessionButton = '//*[@class="button okButton"]'
  #button = name => {
    return `//*[@data-control-name="${name}"]//*[@class="ui-button-text ui-button-in-line"]`
  }
  /**
   * Метод входа на стенд
   * @param {Object} credit - объект тестовых данных кредита
   * @param {String} posts - наименование должности/ей
   */
  async login(credit, posts) {
    I.amOnPage(codeceptjs.config.get().urlAuto)
    const usernameAuto = await I.getFreeAutouserAuto()
    codeceptjs.container.support().usernameAuto = usernameAuto
    if (
      codeceptjs.config.get().urlAuto === 'DELETED' ||
      codeceptjs.config.get().urlAuto === 'DELETED'
    ) {
      await I.waitForElement(this.runApplication, 10)
      I.wait(3)
      I.click(this.runApplication)
    }
    const keycloakTurnedOff = await tryTo(() => I.waitForText('Вход', 40))
    if (keycloakTurnedOff) {
      await I.cFillField(this.loginField, usernameAuto)
      await I.fillField(
        this.passwordField,
        secret(codeceptjs.container.support().envConf[usernameAuto]) || secret(process.env[usernameAuto]),
      )
      await I.cClick(this.entrance)
    } else {
      I.waitForText('Авторизация', 120)
      I.fillField('//*[@id="username"]', usernameAuto)
      I.fillField(
        '//*[@id="password"]',
        secret(codeceptjs.container.support().envConf[usernameAuto]) || secret(process.env[usernameAuto]),
      )
      I.wait(5)
      I.forceClick('//*[@name="login"]')
    }
    if (process.profile === 'yandex') {
      I.wait(15)
    }
    const anotherSession = await tryTo(() => I.waitForEnabled(this.#anotherSession, 20))
    if (anotherSession) I.click(this.#anotherSessionButton)
    await this.prepareUser(credit, posts)
    await this.prepareScheme(credit?.parameters?.program)
  }

  /**
   * Метод разлогирования пользователя
   * @param {object} client - объект тестовых данных клиента
   * @param {object} credit - объект тестовых данных кредита
   */
  async unlogin(client, credit, title) {
    await new ContextError().grab()
    if (
      !tags.includes('@migration') &&
      !tags.includes('@back') &&
      !tags.includes('@negative') &&
      !tags.includes('@vtk_zapret') &&
      !tags.includes('@alert') &&
      !tags.includes('@admistration') &&
      !tags.includes('@vno')
    ) {
      const processIsCompleted = await tryTo(() => I.waitForText('Процесс выдачи кредита завершен', 120))
      if (!processIsCompleted) {
        let error = await tryTo(() => I.waitForVisible('//span[text()[contains(.,"Общая сумма комиссий")]]', 10))
        if (error) {
          await I.cClick('//*[text()="Завершить процесс"]')
        }
        I.refreshPage()
        let result = await tryTo(() => I.waitForEnabled('//div[@class="toast-element-tools"]', 10))
        if (result) {
          await I.cClick('//div[@class="toast-element-tools"]')
        }
      }
    }
    if (tags.includes('@vtk_zapret')) {
      I.click(this.#button('Кнопка_Отказаться'))
      I.waitForText('Процесс выдачи кредита завершен', 120)
    }
    if (!tags.includes('@admistration')) {
      if (tags.includes('@migration')) {
        await this.writeFile(
          title +
            ` Клиент: ${client.surname} ${client.firstName} ${client.patronymic}; Паспорт: ${client.passport.serial} ${client.passport.number}; Заявка: ${credit.applicationNumber}`,
        )
      }
      await this.goToMainForm()
    }
    I.waitForVisible(this.userProfile, 60)
    I.wait(5)
    I.click(this.userProfile)
    I.waitForVisible(this.logoutButton, 60)
    I.wait(1)
    I.click(this.logoutButton)
    I.waitForVisible('//*[@id="username" or @id="field-login"]', 180)
    if (!tags.includes('@vtk_zapret')) {
      await I.cSay(
        `Клиент: ${client.surname} ${client.firstName} ${client.patronymic}; Паспорт: ${client.passport.serial} ${client.passport.number}; Заявка: ${credit.applicationNumber}`,
      )
    }
  }
  /**
   * Подготовка автоюзера
   * @param {Object} credit - объект тестовых данных кредита
   * @param {Object} posts - должности, которые необходимо добавить
   */
  async prepareUser(credit, posts) {
    const context = 'Кредиты_фл.Формы.Для_процесса_оформления_кредита.Выбор_ТО'
    I.wait(10)
    await this.resetInterfaceProcesses()
    I.wait(20)
    if (posts) {
      //зачищать все данные автобота, только если есть особые должности
      await I.postToUdmConsole(
        `Кредиты_фл:suspend_user_auto("${codeceptjs.container.support().usernameAuto}")`,
        context,
      )
      await this.resetInterfaceProcesses()
    }
    await this.pointSelection(credit)
    await I.changeRBS(codeceptjs.container.support().usernameAuto)
    await I.addPosts(posts)
    let displayingNotifications = await tryTo(() => I.waitForEnabled('//div[@class="toast-element-tools"]', 10))
    if (displayingNotifications) {
      I.click('//div[@class="toast-element-tools"]')
    }
  }

  async prepareScheme(program) {
    if (program) {
      I.wait(5)
      await I.postToUdmConsole(
        `БанкоDELETEDий_базовый:Схема_кредитования:По_точному_наименованию('АВТОКРЕД ${program}').Актуальная:= true`,
      )
    }
  }
  /**
   * Удаление интерфейсных процессов
   */
  async resetInterfaceProcesses() {
    I.waitForVisible(this.userProfile, 60)
    I.wait(5)
    await I.cClick(this.userProfile)
    I.waitForVisible(this.removeAllProcess, 60)
    I.wait(1)
    await I.cClick(this.removeAllProcess)
    I.wait(1)
    await I.cClick(this.confirmRemove)
    I.waitForText('Сейчас ваше приложение будет перезагружено.', 10)
    await I.cClick(this.refreshApplication)
  }

  /**
   * Выбор точки оформления
   * @param {Object} credit - объект тестовых данных кредита
   */
  async pointSelection(credit) {
    I.waitForText('Выбор точки оформления', 20)
    await I.waitFormLoad()
    await I.cClickList(this.pointList, '<не выбрано>')
    await I.cClickList(this.pointList, credit.point)
    await I.cClick(this.#button('Кнопка_Далее'))
    const buttonNextClicked = await tryTo(() => I.waitForVisible(this.#button('Кнопка_Сменить_ТО'), 15))
    if (!buttonNextClicked) {
      I.cClick(this.#button('Кнопка_Далее'))
      I.waitForVisible(this.#button('Кнопка_Сменить_ТО'), 15)
    }
  }

  /**
   * Возвращение на главную форму
   */
  async goToMainForm() {
    I.waitForVisible(this.#button('Кнопка_Назад'), 10)
    I.forceClick(this.#button('Кнопка_Назад'))
  }

  async loginNewUser(user, credit) {
    I.amOnPage(codeceptjs.config.get().urlAuto)
    if (
      codeceptjs.config.get().urlAuto === 'DELETED' ||
      codeceptjs.config.get().urlAuto === 'DELETED'
    ) {
      I.click(this.runApplication)
    }
    let keycloakTurnedOff = await tryTo(() => I.waitForText('Вход', 20))
    if (keycloakTurnedOff) {
      await I.cFillField(this.loginField, user.login)
      await I.fillField(this.passwordField, secret(user.password))
      await I.cClick(this.entrance)
    } else {
      I.waitForText('Авторизация', 120)
      I.fillField('//*[@id="username"]', user.login)
      I.fillField('//*[@id="password"]', secret(user.password))
      I.wait(5)
      I.forceClick('//*[@name="login"]')
    }

    I.wait(5) //Срабатывает событие загрузки элемента, которое начинается после полной загрузки страницы
    await I.waitFormLoad()
    I.wait(1)
    await I.cClick(this.#button('Кнопка_Сменить_ТО'))
    await this.pointSelection(credit)
    await I.changeRBS(user.login)
    let displayingNotifications = await tryTo(() => I.waitForEnabled('//div[@class="toast-element-tools"]', 10))
    if (displayingNotifications) {
      I.click('//div[@class="toast-element-tools"]')
    }
  }

  async writeFile(data) {
    const fs = require('fs')
    // Открываем файл для дозаписи
    fs.open('./output/migration.txt', 'a+', (err, fd) => {
      if (err) {
        console.error(err)
        return
      }
      // Записываем данные в файл
      fs.write(fd, `${data}\n`, err => {
        if (err) {
          console.error(err)
          return
        }
        // Закрываем файл
        fs.close(fd, err => {
          if (err) {
            console.error(err)
            return
          }
        })
      })
    })
  }
}

module.exports = { Authentication }
