const arrayAddress = require('../json/arrayAddress.json')

class FakeCreditData {
  randomChoice(min = 0, max = 1) {
    return Math.round(Math.random() * (max - min) + min)
  }

  randomString(len) {
    let str = ''
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')
    const randomAlphabet = alphabet => {
      return alphabet[this.randomChoice(0, alphabet.length - 1)]
    }
    for (let i = 0; i < len; i++) {
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

  pts() {
    return this.randomChoice() ? 'ПТС' : 'ЭПТС'
  }

  currentDate() {
    let date = new Date()
    date = date.toLocaleDateString('ru-RU')
    return date
  }

  futureDate(days, months, years) {
    let futureDate = new Date()
    if (days) futureDate.setDate(futureDate.getDate() + days)
    if (months) futureDate.setMonth(futureDate.getMonth() + months)
    if (years) futureDate.setFullYear(futureDate.getFullYear() + years)
    futureDate = futureDate.toLocaleDateString('ru-RU')
    return futureDate
  }

  // Address object
  address() {
    return arrayAddress[this.randomChoice(0, arrayAddress.length - 1)]
  }

  vin() {
    let vin = ''
    let arr1 = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'M',
      'N',
      'P',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ]
    let arr1_1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let arr2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9]
    let pos1 = 'Z'
    let pos2 = '0'
    let pos3 = 'X'
    let pos4 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos5 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos6 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos7 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos8 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos10 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos11 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos12 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos13 = arr1[Math.floor(Math.random() * (32 - 0)) + 0]
    let pos14 = arr1_1[Math.floor(Math.random() * (9 - 0)) + 0]
    let pos15 = arr1_1[Math.floor(Math.random() * (9 - 0)) + 0]
    let pos16 = arr1_1[Math.floor(Math.random() * (9 - 0)) + 0]
    let pos17 = arr1_1[Math.floor(Math.random() * (9 - 0)) + 0]
    let total = 0
    let ostatok = 0
    let pos9 = ''

    let arr3 = [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos10, pos11, pos12, pos13, pos14, pos15, pos16, pos17]
    let arr4 = [8, 7, 6, 5, 4, 3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < arr3.length; i++) {
      total = total + arr2[arr1.indexOf(arr3[i])] * arr4[i]
    }
    ostatok = total % 11
    if (ostatok == 10) {
      pos9 = 'X'
    } else pos9 = ostatok
    if (vin == '') {
      vin =
        pos1 +
        pos2 +
        pos3 +
        pos4 +
        pos5 +
        pos6 +
        pos7 +
        pos8 +
        pos9 +
        pos10 +
        pos11 +
        pos12 +
        pos13 +
        pos14 +
        pos15 +
        pos16 +
        pos17
    }
    return vin
  }
}

module.exports = FakeCreditData
