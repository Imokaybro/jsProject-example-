const FakeClientData = require('../fakers/FakeClientData')
/**
 * Генератор данных для АРМ Администратор
 */
class GenerateDataFromARM {
  /**
   * Метод генерации данных точки оформления
   * @returns возвращает объект с данными точки оформления
   */
  async generatePoint() {
    let data = {}

    data.name = `autotest${await this.randomNumber(5)}`
    data.address = 'Саратов'
    data.type = 'Точка оформления'
    data.regionCode = '640001'
    data.buisnesLine = 'Совкомбанк'
    data.codeRBS = `${await this.randomNumber(9)}`
    data.ruleRegistration = 'Проверка Автокред'
    data.preficsRuleRegistation = 'autotest'
    return data
  }

  /**
   * Метод генерации данных нового пользователя
   * @returns возвращает объект с данными нового пользователя
   */
  async generateUser() {
    let user = {}

    user.login = `Autouser${await this.randomNumber(8)}`
    user.password = `XCvbnm${await this.randomNumber(8)}QWer`
    user.firstName = 'Автоюзер'
    user.lastName = 'Автоюзер'
    user.patronymic = 'Автоюзер'

    return user
  }

  /**
   * Метод генерации данных новой должности
   * @returns возвращает объект с данными новой должности
   */
  async generatePost() {
    let post = {}

    post.name = `Ааа${await this.randomNumber(3)}`
    post.comment = `Проверка сохранения комментария ${await this.randomNumber(2)}`

    return post
  }

  /**
   * Метод генерации данных новой роли
   * @returns возвращает объект с данными новой роли
   */
  async generateRole() {
    let role = {}

    role.name = `Специалист${await this.randomNumber(3)}`
    role.url = `ссылка на пайрус${await this.randomNumber(3)}`
    role.comment = `Проверка сохранения комментария ${await this.randomNumber(2)}`

    return role
  }

  /**
   * Случайное число
   * @param {number} len - длина возвращаемого числа
   * @param {string} charSet - набор символов
   * @returns возвращает строку с сгенерированным числом заданной длины
   */
  async randomNumber(len, charSet) {
    charSet = charSet || '0123456789'
    let randomNumber = ''
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length)
      randomNumber += charSet.substring(randomPoz, randomPoz + 1)
    }
    return randomNumber
  }

  /**
   * Метод генерации данных розничной организации
   * @returns возвращает объект с данными новой розничной организации
   */
  async generateRetailOrganization() {
    const faker = new FakeClientData()
    let organization = {}

    organization.type = 'Точка продаж'
    organization.name = `РозничнаяОрганизация${await this.randomNumber(3)}`
    organization.recipient = `Получатель 1`
    organization.inn = await this.randomNumber(12)
    organization.tutor = 'куратор'
    organization.bik = '044525453'
    organization.account = await this.randomNumber(20)

    if (typeof organization.address === 'undefined') {
      organization.address = new Object()
      organization.address = faker.address()
    }
    return organization
  }
}

module.exports = { GenerateDataFromARM }
