const fs = require('fs')
const path = require('path')
const directoryPath = './tests/' // Путь к директории с тестами
const { workerData, parentPort } = require('worker_threads') // Импортируем модуль для работы с потоками
const tags = workerData.parameters.tests // Получаем параметры тестов из данных потока

/**
 * Поиск путей к файлам, которые содержат шаблон
 * @param {*} directory - директория для поиска файлов
 * @param {*} patterns - массив шаблонов для поиска
 * @returns массив путей к файлам, которые содержат шаблоны
 */
function findFilesWithPatterns(directory, patterns) {
  let results = [] // Массив для хранения результатов

  /**
   * Рекурсивная функция для поиска файлов по директории
   * @param {*} dir - текущая директория для поиска
   */
  function searchFiles(dir) {
    const files = fs.readdirSync(dir) // Получаем список файлов в текущей директории
    files.forEach(file => {
      const filePath = path.join(dir, file) // Формируем полный путь к файлу
      const stat = fs.statSync(filePath) // Получаем информацию о файле
      if (stat && stat.isDirectory()) {
        searchFiles(filePath) // Рекурсивно вызываем функцию для поддиректории
      } else {
        const content = fs.readFileSync(filePath, 'utf8') // Читаем содержимое файла
        if (patterns.some(pattern => content.includes(pattern))) {
          results.push(filePath) // Если содержимое файла содержит шаблон, добавляем путь к файлу в результаты
        }
      }
    })
  }

  searchFiles(directory) // Запускаем поиск файлов в указанной директории
  return results // Возвращаем массив найденных файлов
}

// Массив путей к файлам, содержащим теги
const foundFiles = findFilesWithPatterns(directoryPath, tags)

/**
 * Поиск тегов внутри списка файлов
 * @param {Array} files - массив путей к файлам
 * @returns массив тегов
 */
async function searchTags(files) {
  return await new Promise((resolve, reject) => {
    const allMatches = [] // Массив для хранения всех найденных тегов
    let filesProcessed = 0 // Счетчик обработанных файлов

    files.forEach(path => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          reject(`Error reading file ${path}: ${err}`) // Отклоняем промис с ошибкой при чтении файла
          return
        }
        const matches = data.match(/@.*/g) // Ищем все теги в содержимом файла
        if (matches) {
          allMatches.push(...matches) // Добавляем найденные теги в общий массив
        }
        filesProcessed++
        if (filesProcessed === files.length) {
          resolve(allMatches) // Разрешаем промис, когда все файлы обработаны
        }
      })
    })
  })
}

let array
;(async () => {
  await searchTags(foundFiles) // Выполняем поиск тегов в найденных файлах
    .then(matches => {
      const externalIds = matches.filter(obj => obj !== null) // Фильтруем массив тегов, удаляя null значения
      array = externalIds
        .map(element => element.split(',')[0].replaceAll("'", '')) // Из каждого тега извлекаем первое слово и удаляем кавычки
        .sort((a, b) => {
          // Сортируем теги по приоритету
          const priority = { '@slow': 1, '@medium': 2, '@fast': 3 } // Определяем приоритеты тегов
          const getPriority = str => {
            if (str.includes('@slow')) return priority['@slow']
            if (str.includes('@medium')) return priority['@medium']
            if (str.includes('@fast')) return priority['@fast']
            return 0
          }
          return getPriority(b) - getPriority(a)
        })
        .map(item => item.split(' ')[0]) // Из каждого тега извлекаем первое слово
    })
    .catch(error => {
      console.error('Error:', error) // Выводим ошибку при обработке
    })
    .then(() => {
      parentPort.postMessage(array) // Возвращаем результат в родительский поток
    })
})()
