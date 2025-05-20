/**
 * @file creditParametersChecker.js
 * @description Этот модуль предоставляет функциональность для проверки параметров кредитов с использованием событий CodeceptJS.
 * Он включает функции для выполнения SQL-запросов и записи данных в файлы, а также слушатели событий для событий начала и прохождения теста.
 */

const event = require('codeceptjs').event
const fs = require('fs')
const oracledb = require('oracledb')

/**
 * Выполняет SQL-запрос и возвращает результат.
 * @async
 * @param {string} query - SQL-запрос для выполнения.
 * @returns {Array} - Строки, возвращенные запросом.
 */
async function executeQuery(query) {
  let connection
  try {
    // Устанавливаем соединение с базой данных
    connection = await oracledb.getConnection({
      user: codeceptjs.container.support().envConf.REPORTS_LOGIN || process.env.REPORTS_LOGIN,
      password: codeceptjs.container.support().envConf.REPORTS_PASS || process.env.REPORTS_PASS,
      connectString: codeceptjs.config.get().dataBaseString,
    })
    // Выполняем SQL-запрос и получаем результат
    const result = await connection.execute(query)
    return result.rows[0] // Возвращаем первую строку результата
  } catch (err) {
    console.log(err) // Обрабатываем ошибку при выполнении запроса
  } finally {
    if (connection) {
      try {
        await connection.close() // Закрываем соединение
      } catch (err) {
        console.log(err) // Обрабатываем ошибку при закрытии соединения
      }
    }
  }
}

/**
 * Записывает данные в файл.
 * @param {string} fileName - Имя файла для записи.
 * @param {string} data - Данные для записи в файл.
 */
function writeFile(fileName, data) {
  // Открываем файл для записи или создаем его, если он не существует
  fs.open(`./output/${fileName}.txt`, 'a+', (err, fd) => {
    if (err) {
      console.log(err) // Обрабатываем ошибку при открытии файла
      return
    }
    // Записываем данные в файл
    fs.write(fd, data, err => {
      if (err) {
        console.log(err) // Обрабатываем ошибку при записи данных
        return
      }
      // Закрываем файл
      fs.close(fd, err => {
        if (err) {
          console.log(err) // Обрабатываем ошибку при закрытии файла
          return
        }
      })
    })
  })
}

/**
 * Экспортируемая функция модуля для инициализации слушателей событий.
 */
module.exports = async function () {
  /**
   * Слушатель события начала теста.
   * Проверяет, соответствует ли имя теста параметрам кредитов в DataCase.
   * @param {Object} test - Объект теста.
   */
  event.dispatcher.on(event.test.started, async function (test) {
    // Создаем регулярное выражение для извлечения номера теста из имени файла
    const regex = new RegExp(`id_(\\d+)\\.js`)
    // Формируем идентификатор теста
    const testId = `id_${test.opts.externalId}`
    // Формируем путь к файлу DataCase.js, заменяя номер теста в имени файла
    const dataCasePath = test.file.replace(regex, 'DataCase.js')
    // Импортируем модуль DataCase из указанного файла
    const DataCase = require(dataCasePath)
    // Получаем данные теста из модуля DataCase
    const module = DataCase[testId]

    // Проверяем, соответствует ли тег теста условию и путь к файлу
    if (
      (test.tags.includes('@line') && dataCasePath.indexOf('line') > 0) ||
      (test.tags.includes('@eCreditAPI') && dataCasePath.indexOf('api') > 0) ||
      (test.tags.includes('@interception') && dataCasePath.indexOf('front') > 0)
    ) {
      // Проверяем, совпадает ли наименование теста с параметром программы в DataCase
      if (test.title.indexOf(module.credit.parameters.program) == -1) {
        console.error('\x1b[41m\x1b[30m', '============WARNING============', '\x1b[0m')
        console.log('\x1b[33m', `Наименование теста ${testId} не совпадает с наименованием схемы в DataCase`, '\x1b[0m')
        // Записываем ошибку в файл
        await writeFile('dataCaseError', `Ошибка входных данных в ${testId} нужно проверить наименование схемы\n`)
      }

      // Формируем SQL-запрос для проверки актуальности схемы кредитования
      const sqlQuery = `select AKTUALNAJA from FISLOCAL.EUB_SHEMA_KREDITO_A1PF where naimenovanie = 'АВТОКРЕД ${module.credit.parameters.program}'`
      // Выполняем SQL-запрос и получаем результат
      let data = await executeQuery(sqlQuery)

      // Проверяем, выключена ли схема кредитования
      if (data[0] === 0) {
        console.error('\x1b[41m\x1b[30m', '============WARNING============', '\x1b[0m')
        console.log(
          '\x1b[33m',
          `У теста ${testId} выключена схема кредитования ${module.credit.parameters.program}`,
          '\x1b[0m',
        )
        // Записываем информацию о выключенной схеме в файл
        await writeFile('disabledSchema', `Тест ${testId} выключенна схема ${module.credit.parameters.program}\n`)
      }
    }
  })

  /**
   * Слушатель события прохождения теста.
   * Проверяет соответствие выданных данных кредитов ожидаемым параметрам.
   * @param {Object} test - Объект теста.
   */
  event.dispatcher.on(event.test.passed, async function (test) {
    // Функция для строгого сравнения двух значений
    async function strictEqual(actual, expected, message) {
      if (actual !== expected) {
        return `Необходимо проверить ${message} в параметрах кредита`
      } else return ''
    }

    // Создаем регулярное выражение для извлечения номера теста из имени файла
    const regex = new RegExp(`id_(\\d+)\\.js`)
    // Формируем идентификатор теста
    const testId = `id_${test.opts.externalId}`
    // Формируем путь к файлу DataCase.js, заменяя номер теста в имени файла
    const dataCasePath = test.file.replace(regex, 'DataCase.js')
    // Импортируем модуль DataCase из указанного файла
    const DataCase = require(dataCasePath)
    // Получаем данные теста из модуля DataCase
    const module = DataCase[testId]
    // Получаем идентификатор запроса из данных теста
    const reqID = module.credit.reqID

    // Проверяем, соответствует ли тег теста условию и путь к файлу
    if (
      (test.tags.includes('@line') && dataCasePath.indexOf('line') !== 0) ||
      (test.tags.includes('@eCreditAPI') && dataCasePath.indexOf('api') !== 0) ||
      (test.tags.includes('@interception') && dataCasePath.indexOf('front') !== 0)
    ) {
      // Создаем регулярное выражение для извлечения номеров кредитов из строки
      const regex1 = /М\d*-/g
      // Получаем текст номеров кредитов из данных теста
      const text = module.credit.applicationNumber
      // Массив для хранения найденных номеров кредитов
      const matches = []
      let match
      // Ищем все соответствия регулярному выражению
      while ((match = regex1.exec(text)) !== null) {
        matches.push(match[0].slice(1, -1))
      }
      // Получаем первый найденный номер кредита
      const creditNumber = matches[0]

      // Формируем строку для поиска в SQL-запросе
      let searchString
      if (reqID) {
        searchString = `kred.VNESHNIJ_IDENTIFIKATOR = '${reqID}'`
      } else {
        searchString = `kred.id = '${creditNumber}'`
      }

      // Формируем SQL-запрос для получения данных о кредите
      const sqlQuery = `select kred.arhivnyj, kred.oformlen, kred.tip_stadii, kred.halva_oformlena, kred.status, kred.sostojanie, kred.finalnyj_status_dess,
                        zajavka.NEOPLACHENNAJA_CH_A5EE, zajavka.STAVKA, zajavka.SUMMA, zajavka.PERVONACHALNYJ_VZNOS, zajavka.SROK_KREDITA, zajavka.HALVA,
                        schem.NAIMENOVANIE
                        from FISLOCAL.EUB_KREDIT kred
                        join FISLOCAL.EUB_ZAJAVKA zajavka on kred.zajavka = zajavka.id
                        join FISLOCAL.EUB_SHEMA_KREDITO_A1PF schem on zajavka.SHEMA_KREDITOVANI_A1UF = schem.id
                        where ${searchString}`
      // Выполняем SQL-запрос и получаем результат
      let data = await executeQuery(sqlQuery)

      // Создаем объект для хранения данных кредита
      const creditData = {
        credit: {
          archived: data[0],
          successfullyIssued: data[1],
          stage: data[2],
          halvaSuccessfullyIssued: data[3],
          status: data[4],
          condition: data[5],
          finalStatusDess: data[6],
        },
        application: {
          unpaidPart: data[7],
          rate: data[8],
          amount: data[9],
          initialPayment: data[10],
          term: data[11],
          halva: data[12],
          program: data[13],
        },
      }

      // Массив для хранения ошибок
      const errors = []
      try {
        // Проверяем соответствие данных из базы данных ожидаемым значениям
        errors.push(await strictEqual(creditData.credit.archived, 1, 'Архивный'))
        errors.push(await strictEqual(creditData.credit.successfullyIssued, 1, 'Состояние'))
        if (module.credit?.cardHALVA?.card) {
          errors.push(await strictEqual(creditData.credit.halvaSuccessfullyIssued, 1, 'Халва успешно выдана'))
          errors.push(await strictEqual(creditData.application.halva, 1, 'Халва успешно выдана в заявке'))
        }
        errors.push(await strictEqual(creditData.credit.status, 'Выдача успешно завершена', 'Статус'))
        errors.push(await strictEqual(creditData.credit.condition, 'Выдача завершена', 'Состояние'))
        errors.push(await strictEqual(creditData.credit.finalStatusDess, 'Одобрено и выдано', 'Финальный статус десс'))
        errors.push(
          await strictEqual(
            creditData.application.unpaidPart, //2500000
            +module.credit.parameters.cost - +module.credit.parameters.initialPayment, //4000000 - 1500000
            'Неоплаченная часть',
          ),
        )
        errors.push(
          await strictEqual(
            +creditData.application.initialPayment,
            +module.credit.parameters.initialPayment,
            'Первоначальный взнос',
          ),
        )
        errors.push(await strictEqual(+creditData.application.term, +module.credit.parameters.term, 'Срок кредита'))
        errors.push(
          await strictEqual(
            creditData.application.program,
            `АВТОКРЕД ${module.credit.parameters.program}`,
            'Схема кредитования',
          ),
        )
        if (creditData.application.rate <= 0) {
          errors.push(`Необходимо проверить Ставку в параметрах кредита`)
        }
      } catch (err) {
        console.log(err)
      }
      // Если есть ошибки, выводим WARNING и записываем ошибки в файл
      const filteredArr = errors.filter(value => value !== '')
      if (filteredArr.length > 0) {
        console.error('\x1b[41m\x1b[30m', '============WARNING============', '\x1b[0m')
        console.log('\x1b[33m', `У теста ${testId} зафиксированы ошибки после выдачи`, '\x1b[0m')
        await writeFile('creditIssueError', `Ошибка данных в тесте ${testId}\n ${errors}\n`)
      }
    }
  })
}
