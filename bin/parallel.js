const { Worker, workerData, parentPort } = require('worker_threads')
const testsGroup = workerData.group // Получаем группу тестов из переданных данных
const parameters = workerData.parameters // Получаем параметры из переданных данных
let thread = 0 // Инициализируем переменную для управления состоянием потока

/**
 * Запуск воркера
 * @param {String} test - идентификатор теста
 * @returns промис
 */
async function runTask(test) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./bin/worker.js', { workerData: { test, parameters } }) // Создаем воркер для выполнения теста

    worker.on('online', () => {
      console.log('Worker is online and has started execution.') // Выводим сообщение о запуске воркера
    })

    worker.on('message', msg => {
      let failedTests = 0 // Инициализируем счетчик неудачных тестов
      let message = msg.output.split(' × ') // Разделяем сообщение на части по символу ' × '
      message = message[1] ? '× ' + message[1] : message[0] // Выбираем вторую часть сообщения, если она существует, иначе первую

      if (message.includes('× ') || message.includes('1 failed')) {
        // Проверяем, содержит ли сообщение ошибки
        failedTests++ // Увеличиваем счетчик неудачных тестов
      }

      console.log(message.replaceAll('#StandWithUkraine', '')) // Выводим сообщение без хэштега '#StandWithUkraine'
      console.log('--------------------------------------------------------------------------') // Выводим разделитель

      parentPort.postMessage({ failedTests: failedTests }) // Отправляем сообщение родительскому потоку о количестве неудачных тестов
      resolve() // Разрешаем промис
    })

    worker.on('exit', code => {
      if (code !== 0) console.log(code) // Выводим код завершения воркера, если он не равен 0
      thread = 0 // Сбрасываем состояние потока
      resolve() // Разрешаем промис
    })

    worker.on('error', err => {
      thread = 0 // Сбрасываем состояние потока
      reject(err) // Отклоняем промис с ошибкой
    })
  })
}

;(async () => {
  for (let test of testsGroup) {
    // Проходим по всем тестам в группе
    while (thread !== 0) {
      // Ожидаем освобождения потока
      await new Promise(resolve => setTimeout(resolve, 100)) // Ждем 100 миллисекунд перед следующей проверкой
    }
    thread = 1 // Занимаем поток
    try {
      await runTask(test) // Запускаем выполнение теста
    } catch (err) {
      console.error(`Ошибка выполнения задачи ${test}:`, err) // Выводим ошибку при выполнении теста
    }
  }
})()
