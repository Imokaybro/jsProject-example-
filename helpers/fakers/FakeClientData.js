const maleName = require('../json/maleName.json')
const femaleName = require('../json/femaleName.json')
const maleSurname = require('../json/maleSurname.json')
const femaleSurname = require('../json/femaleSurname.json')
const malePatronymic = require('../json/malePatronymic.json')
const femalePatronymic = require('../json/femalePatronymic.json')
const countryOfBirth = require('../json/countryOfBirth.json')
const placeOfBirth = require(`../json/placeOfBirth.json`)
const maritalStatus = require('../json/maritalStatus.json')
const arrayAddress = require('../json/arrayAddress.json')
const secondDocument = require('../json/secondDocument.json')
const issuedBy = require('../json/issuedBy.json')
const reasonChangeName = require('../json/reasonChangeName.json')
const actualPlacement = require('../json/actualPlacement.json')
const education = require('../json/education.json')
const socialStatus = require('../json/socialStatus.json')
const nameOfTheOrganizationSovcombank = require('../json/nameOfTheOrganizationSovcombank.json')
const nameOfTheOrganization = require('../json/nameOfTheOrganization.json')
const organizationType = require('../json/organizationType.json')
const industry = require('../json/industry.json')
const profession = require('../json/profession.json')
const busyness = require('../json/busyness.json')
const source = require('../json/source.json')
const frequency = require('../json/frequency.json')
const frequencyWages = require('../json/frequencyWages.json')
const typeOfDating = require('../json/typeOfDating.json')
/**
 * Генераторы данных
 */
class FakeClientData {
  randomChoice(min = 0, max = 1) {
    return Math.round(Math.random() * (max - min) + min)
  }

  randomString(len) {
    let str = ''
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')
    const randomAlphabet = alphabet => {
      return alphabet[this.randomChoice(0, alphabet.length - 1)]
    }
    for (let i = 0; i < len - 1; i++) {
      str += randomAlphabet(alphabet)
    }
    return str
  }

  randomNumber(len, charSet) {
    charSet = charSet || '0123456789'
    let randomNumber = ''
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length)
      randomNumber += charSet.substring(randomPoz, randomPoz + 1)
    }
    return randomNumber
  }

  gender() {
    return this.randomChoice() ? 'Мужской' : 'Женский'
  }

  surname(gender) {
    let listOfSurname
    if (!gender) gender = this.gender()
    switch (gender) {
      case 'Мужской':
        listOfSurname = maleSurname
        break
      case 'Женский':
        listOfSurname = femaleSurname
        break
    }
    return listOfSurname[this.randomChoice(0, listOfSurname.length - 1)]
  }

  name(gender) {
    let listOfName
    if (!gender) gender = this.gender()
    switch (gender) {
      case 'Мужской':
        listOfName = maleName
        break
      case 'Женский':
        listOfName = femaleName
        break
    }
    return listOfName[this.randomChoice(0, listOfName.length - 1)]
  }

  patronymic(gender) {
    let listOfPatronymic
    if (!gender) gender = this.gender()
    switch (gender) {
      case 'Мужской':
        listOfPatronymic = malePatronymic
        break
      case 'Женский':
        listOfPatronymic = femalePatronymic
        break
    }
    return listOfPatronymic[this.randomChoice(0, listOfPatronymic.length - 1)]
  }
  // Семейное положение
  maritalStatus() {
    return maritalStatus[this.randomChoice(0, maritalStatus.length - 1)]
  }
  // Страна рождения
  countryOfBirth() {
    return countryOfBirth[this.randomChoice(0, countryOfBirth.length - 1)]
  }
  // Место рождения
  placeOfBirth() {
    return placeOfBirth[this.randomChoice(0, placeOfBirth.length - 1)]
  }
  // Второй документ
  secondDocument() {
    return secondDocument[this.randomChoice(0, secondDocument.length - 1)]
  }
  // Причина смена имени
  reasonChangeName() {
    return reasonChangeName[this.randomChoice(0, reasonChangeName.length - 1)]
  }
  // Кем выдан
  issuedBy() {
    return issuedBy[this.randomChoice(0, issuedBy.length - 1)]
  }
  // passport data
  departmentCode() {
    let departmentCode = `${this.randomChoice(111, 999)}-${this.randomChoice(111, 999)}`
    return departmentCode
  }

  previousPassport() {
    return this.randomChoice()
  }
  // Генерация СНИЛС
  snils() {
    const leftPad = (str, len, ch) => {
      const length = len - str.length + 1
      return length > 0 ? new Array(length).join(ch) + str : str
    }
    const rnd = Math.floor(Math.random() * 999999999)
    const number = leftPad('' + rnd, 9, '0')
    let sum = number
      .split('')
      .map((val, i) => parseInt(val) * (9 - i))
      .reduce((a, b) => a + b)
    if (sum > 101) sum = sum % 101
    const checkSum = sum == 100 || sum == 101 ? '00' : leftPad('' + sum, 2, '0')
    return number + checkSum
  }
  // Генерация ИНН
  inn() {
    /* add zeros to string */
    function zeros(str, lng) {
      var factlength = str.length
      if (factlength < lng) {
        for (var i = 0; i < lng - factlength; i++) {
          str = '0' + str
        }
      }
      return str
    }
    var region = zeros(String(Math.floor(Math.random() * 92 + 1)), 2)
    var inspection = zeros(String(Math.floor(Math.random() * 99 + 1)), 2)
    var numba = zeros(String(Math.floor(Math.random() * 999999 + 1)), 6)
    var rezult = region + inspection + numba
    var kontr = String(
      ((7 * rezult[0] +
        2 * rezult[1] +
        4 * rezult[2] +
        10 * rezult[3] +
        3 * rezult[4] +
        5 * rezult[5] +
        9 * rezult[6] +
        4 * rezult[7] +
        6 * rezult[8] +
        8 * rezult[9]) %
        11) %
        10,
    )
    kontr == 10 ? (kontr = 0) : kontr
    rezult = rezult + kontr
    kontr = String(
      ((3 * rezult[0] +
        7 * rezult[1] +
        2 * rezult[2] +
        4 * rezult[3] +
        10 * rezult[4] +
        3 * rezult[5] +
        5 * rezult[6] +
        9 * rezult[7] +
        4 * rezult[8] +
        6 * rezult[9] +
        8 * rezult[10]) %
        11) %
        10,
    )
    kontr == 10 ? (kontr = 0) : kontr
    rezult = rezult + kontr
    return rezult
  }
  // Address object
  address() {
    return JSON.parse(JSON.stringify(arrayAddress[this.randomChoice(0, arrayAddress.length - 1)]))
  }
  // Случайная дата
  randomDate() {
    let date = new Date()
    let randomNumber = Math.floor(Math.random() * 200)
    date.setDate(date.getDate() - randomNumber)
    date = date.toLocaleDateString('ru-RU')
    return date
  }
  // Дата выдачи старого паспорта
  oldPassportDate(dateOfBirth) {
    dateOfBirth = new Date(dateOfBirth.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'))
    let date = new Date(dateOfBirth)
    date.setFullYear(date.getFullYear() + 15)
    date = date.toLocaleDateString('ru-RU')
    return date
  }
  // Дата рождения клиента
  age(min, max) {
    const interval = point => {
      return new Date(new Date().setFullYear(new Date().getFullYear() - point)).getTime()
    }
    const intervalStart = interval(max ?? 40)
    const intervalEnd = interval(min ?? 21)
    const resultDate = new Date(this.randomChoice(intervalStart, intervalEnd))
    return resultDate.toLocaleString('ru').split(',')[0]
  }
  // Генерация номера телефона
  // Передаем в метод маску, где символ по умолчанию - # указывает на необходимость генерации числа.
  // faker.phoneNumber('501-###-###') // '501-039-841'
  // faker.phoneNumber('+48 91 ### ## ##') // '+48 91 463 61 70'
  phoneNumber(string, symbol = '#') {
    let str = ''
    for (let i = 0; i < string.length; i++) {
      if (string.charAt(i) === symbol) {
        str += this.randomChoice(0, 9)
      } else {
        str += string.charAt(i)
      }
    }
    return str
  }

  actualPlacement() {
    return actualPlacement[this.randomChoice(0, actualPlacement.length - 1)]
  }

  education() {
    return education[this.randomChoice(0, education.length - 1)]
  }

  socialStatus() {
    return socialStatus[this.randomChoice(0, socialStatus.length - 1)]
  }

  nameOfTheOrganizationSovcombank() {
    return nameOfTheOrganizationSovcombank[this.randomChoice(0, nameOfTheOrganizationSovcombank.length - 1)]
  }

  nameOfTheOrganization() {
    return nameOfTheOrganization[this.randomChoice(0, nameOfTheOrganization.length - 1)]
  }

  organizationType() {
    return organizationType[this.randomChoice(0, organizationType.length - 1)]
  }

  industry() {
    return industry[this.randomChoice(0, industry.length - 1)]
  }

  profession() {
    return profession[this.randomChoice(0, profession.length - 1)]
  }

  busyness() {
    return busyness[this.randomChoice(0, busyness.length - 1)]
  }

  source() {
    return source[this.randomChoice(0, source.length - 1)]
  }

  frequency() {
    return frequency[this.randomChoice(0, frequency.length - 1)]
  }

  frequencyWages() {
    return frequencyWages[this.randomChoice(0, frequencyWages.length - 1)]
  }

  typeOfDating() {
    return typeOfDating[this.randomChoice(0, typeOfDating.length - 1)]
  }

  ogrnip() {
    let part = Math.floor(Math.random() * 99999999999999 + 1)
    let rez_del = part % 13
    let part2
    if (rez_del > 9) {
      part2 = String(rez_del).substring(1, 2)
    } else {
      part2 = String(rez_del)
    }
    let rezult = String(part) + part2
    return rezult
  }

  /*
        passportDateIssue(fromDate, toDate) {
            fromDate = fromDate.split('.');
            const endInterval = toDate ? new Date(toDate[2], toDate[1] - 1, toDate[0]).getTime() : new Date().getTime();
            const personFullYears = new Date().getFullYear() - new Date(fromDate[2], fromDate[1] - 1, fromDate[0]).getFullYear();

            const intervalStart = (toTime) => {
                return new Date(
                    new Date().setFullYear(
                        new Date(fromDate[2], fromDate[1] - 1, fromDate[0]).getFullYear() + toTime)
                ).getTime();
            };

            let startInterval;
            switch (true) {
                case (personFullYears >= 14 && personFullYears < 20):
                    startInterval = intervalStart(14);
                    break;
                case (personFullYears >= 20 && personFullYears < 45):
                    startInterval = intervalStart(20);
                    break;
                case (personFullYears >= 45):
                    startInterval = intervalStart(45);
                    break;
            };

            return new Date(this.randomChoice(startInterval, endInterval)).toLocaleString('ru').split(',')[0];
        };

        betweenDates(fromDate, toDate) {
            fromDate = fromDate.split('.');
            toDate = toDate.split('.');

            const endInterval = toDate ? new Date(toDate[2], toDate[1] - 1, toDate[0]).getTime() : new Date().getTime();
            const startInterval = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]).getTime()
            return new Date(this.randomChoice(startInterval, endInterval)).toLocaleString('ru').split(',')[0];

        };
    */
}

module.exports = FakeClientData
