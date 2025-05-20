const { Worker } = require('worker_threads')
/**
 * Для того что бы запустить воркер локально, достаточно изменить объект parameters
 * Пример:
 * const parameters = {
 *  stand: 'kb',
 *  tests: ['@125639'],
 *  workers: 5,
 *  plugins: getParameter(args, 'plugins', 8),
 *  override: '"tags": "", "helpers": {"Puppeteer": {"chrome": {"headless": "new"}}}', //getParameter(args, 'override', 9).replaceAll("'", '\\"'),
 * }
 */
//---------------------------------Парсинг параметров запуска----------------------------------------
// Получаем аргументы командной строки, исключая первые два аргумента (node и путь к скрипту)
const args = process.argv.slice(2)

// Создаем объект parameters, который будет содержать все необходимые параметры для запуска
const parameters = {
  stand: getParameter(args, 'stand', 6), // Получаем значение параметра stand
  tests: getParameter(args, 'tests', 6)
    .split('|') // Разделяем значение параметра tests по символу '|'
    .filter(el => el.trim().length > 0), // Фильтруем пустые строки
  workers: parseInt(getParameter(args, 'workers', 8), 10), // Получаем значение параметра workers и преобразуем его в число
  plugins: getParameter(args, 'plugins', 8), // Получаем значение параметра plugins
  override: getParameter(args, 'override', 9).replaceAll("'", '\\"'), // Получаем значение параметра override и заменяем одинарные кавычки на двойные
}

// Выводим параметры запуска
console.log('Запуск воркеров со следующими параметрами:')
console.log(parameters)

//---------------------------------Запуск воркера для поиска по репозиторию нужных тестов и их сортировка----------------------------------------
// Создаем воркер, который будет выполнять поиск тестов

const worker = new Worker('./bin/search.js', { workerData: { parameters: parameters } })

const workers = parameters.workers // Получаем количество воркеров из параметров
let data // Переменная для хранения результатов поиска

// Обрабатываем ошибки воркера
worker.on('error', error => {
  console.log(error)
})

// Обрабатываем сообщения от воркера
worker.on('message', array => {
  data = array // Сохраняем результаты поиска
  worker.terminate().then(() => {
    // Завершаем работу воркера после получения результатов
    // После того, как завершается работа воркера search, начинаем группировать очереди к воркерам
    // Сначала идут самые быстрые тесты с тегом @fast, потом тесты @medium, затем @slow. Тесты, у которых нет таких тегов идут самыми последними
    //------------------------------Группировка по количеству воркеров-------------------------------------------
    let testGroup
    if (workers > 1) {
      testGroup = Array.from({ length: workers }, () => []) // Создаем массив для группировки тестов
      for (let index = 0; index < data.length; index++) {
        testGroup[index % workers].push(data[index]) // Группируем тесты по количеству воркеров
      }
    } else {
      testGroup = [data] // Если воркеров 1, то все тесты попадают в одну группу
    }
    testGroup = testGroup.filter(test => test.length > 0) // Фильтруем пустые группы

    // После формирования очередей, начинаем запускать воркеры
    //---------------------------------Запуск многопоточки----------------------------------------
    let countFailedTests = 0 // Счетчик неудачных тестов
    let completedWorkers = 0 // Счетчик завершенных воркеров

    // Обрабатываем сообщения от воркеров
    const handleWorkerMessage = failedTests => {
      countFailedTests = countFailedTests + +JSON.stringify(failedTests.failedTests) // Обновляем счетчик неудачных тестов
    }

    // Обрабатываем завершение воркеров
    const handleWorkerExit = (i, code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`) // выводим ошибку, если воркер завершился с ненулевым кодом
      console.log(`Завершена работа воркера №${i + 1}`) // Выводим сообщение о завершении воркера
      completedWorkers++ // Увеличиваем счетчик завершенных воркеров
      if (completedWorkers === testGroup.length) {
        // Если все воркеры завершены
        console.log(`Всего тестов запущено: ${data.length}`) // Выводим общее количество тестов
        console.log(`Пройдено успешно: ${data.length - +countFailedTests}`) // Выводим количество успешно пройденных тестов
        console.log(`Провалено тестов: ${+countFailedTests}`) // Выводим количество неудачных тестов
        if (countFailedTests > 0) {
          process.exit(1) // Завершаем процесс с кодом 1, если есть неудачные тесты
        }
      }
    }

    // Запускаем воркеры для выполнения тестов
    for (let i = 0; i < testGroup.length; i++) {
      let group = testGroup[i] // Получаем группу тестов

      const worker = new Worker('./bin/parallel.js', { workerData: { group, parameters } }) // Создаем воркер для выполнения тестов
      worker.on('error', error => {
        console.log(error) // Обрабатываем ошибки воркера
      })
      worker.on('exit', code => handleWorkerExit(i, code)) // Обрабатываем завершение воркера
      worker.on('message', handleWorkerMessage) // Обрабатываем сообщения от воркера
    }
  })
})

/**
 * Поиск параметров в аргументах запуска
 * @param {Array} array - массив аргументов из env
 * @param {String} key - то, что ищем
 * @param {Number} offset - с какого символа забираем значение параметра
 * @returns
 */
function getParameter(array, key, offset) {
  const index = array.findIndex(arg => arg.includes(key)) // Находим индекс аргумента, содержащего ключ
  return index !== -1 ? array[index].substring(offset) : '' // Возвращаем значение параметра, если ключ найден, иначе пустую строку
}
