const fs = require('fs')
const path = require('path')
const Vault = require('../../vault/vault')

/**
 * Получение секретов из VAULT
 */
async function bootstrapSetEnv() {
  const pathToEnv = path.join(__dirname, path.normalize('../../.env')) //присваиваем переменной pathToEnv путь, полученный путем объединения текущего абсолютного пути с файлом .env из корня проекта
  let envConf
  if (fs.existsSync(pathToEnv)) {
    //проверяем, существует ли файл .env в указанном каталоге
    if (process.env.CI) {
      envConf = await new Vault().request()
    } else {
      envConf = require('dotenv').config({ path: '.env' }).parsed //записываем в переменную envConf результат парсинга  локального файла .env
    }
  } else {
    //если локально файл отсутствует, делаем запрос в Vault
    try {
      envConf = await new Vault().request()
    } catch (error) {
      console.log(error)
      throw new Error("Can't get secret from vault")
    }
  }
  codeceptjs.container.append({
    support: { envConf },
  })
}
module.exports = { bootstrapSetEnv }
