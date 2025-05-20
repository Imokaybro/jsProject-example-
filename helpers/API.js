const Helper = require('@codeceptjs/helper')
const axios = require('axios')
const https = require('https')
//const fs = require('fs')
//https.globalAgent = new https.Agent({ ca: fs.readFileSync('./configs/CA/ru_cert_bundle.pem') })
class API extends Helper {
  /**
   * Отправка XML запроса
   * @param {string} url - endPoint сервиса
   * @param {string} xmls - XML в строковом виде
   * @param {string} soapAction - soapAction
   * @returns возвращает ответ в виде объекта
   */
  async sendXML(url, xmls, soapAction) {
    const response = await axios({
      method: 'POST',
      url: url,
      data: xmls,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: { 'Content-Type': 'text/xml; charset=UTF-8', SOAPAction: soapAction },
    })
    return response.data
  }

  /**
   * Отправка JSON запроса
   * @param {string} url - endPoint сервиса
   * @param {string} json - текст запроса
   * @returns возвращает ответ в виде объекта
   */
  async sendJSON(url, json) {
    try {
      const response = await axios({
        method: 'POST',
        url: url,
        data: json,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      })
      return response.data
    } catch (thrown) {
      const { data } = thrown.response
      return data
    }
  }
}

module.exports = API
