/// <reference path="../configs/steps.d.ts" />
'use strict'
var oracledb = require('oracledb')
const Helper = codeceptjs.helper

class AdditionalServices extends Helper {
  async randomChoice(min = 0, max = 1) {
    return Math.round(Math.random() * (max - min) + min)
  }
  /**
   * Генерация даты(сегодня)
   * @returns дата(сегодня)
   */
  async toDayDate() {
    let date = new Date()
    date = date.toLocaleDateString('ru-RU')
    return date
  }
  /**
   * Генерация даты окончания действия полиса(сегодня + 1год)
   * @returns дата(сегодня + 1 год)
   */
  async endDate() {
    let date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    date = date.toLocaleDateString('ru-RU')
    return date
  }
  /**
   * Сортировка массива с данными по доп. услугам
   * @param {Array} array - массив данных с доп услугами
   * @returns - возвращает отсортированый массив доступных доп. услуг по заявке
   */
  async sortArray(array) {
    let tmpArr = []
    for (let i = 0; i < array.length; i++) {
      if (!array[i].match(/---|Помощь на дорогах КАР АССИСТАНС|Маяк/i)) {
        tmpArr.push(array[i])
      }
    }
    return tmpArr
  }
  /**
   * Метод нахождения массива доступных доп. услуг для схемы кредитования
   * @param {Object} credit - объект тестовых данных кредита
   * @returns - возвращает массив доп. услуг
   */
  async getAdditionalServices(credit) {
    let connection
    try {
      connection = await oracledb.getConnection({
        user: codeceptjs.container.support().envConf.REPORTS_LOGIN || process.env.REPORTS_LOGIN,
        password: codeceptjs.container.support().envConf.REPORTS_PASS || process.env.REPORTS_PASS,
        connectString: codeceptjs.config.get().dataBaseString,
      })
      //Получаем айди схемы кредитования
      let lendingSchemeID = await connection.execute(`select sc.id
            from FISLOCAL.EUB_SHEMA_KREDITO_A1PF sc
            where sc.NAIMENOVANIE like '%${credit.parameters.program}'`)
      lendingSchemeID = lendingSchemeID.rows[0][0]

      //получаем айди услуг которые доступны для схемы
      let servicesOfScheme = await connection.execute(`
            select ds.USLUGA
            from FISLOCAL.EUB_DOPUSLUGI_PO_A9U6 ds
            where ds.SHEMA_KREDITOVANIJA = ${lendingSchemeID}`)
      servicesOfScheme = servicesOfScheme.rows
      servicesOfScheme = servicesOfScheme.flat()
      servicesOfScheme = servicesOfScheme.join(', ')

      //получаем айди розничной организации
      let organizationID = await connection.execute(`
            select ro1.id
            from FISLOCAL.EUB_ROZNICHNAJA_O_ASWA ro1
            where ro1.NAIMENOVANIE = '${credit.organization}'
            and ro1.AKTUALNOE = 1`)
      organizationID = organizationID.rows[0][0]

      //получаем доступные услуги для розничной организации
      let servicesOfOrganization = await connection.execute(`
            select ru.value_mtype
            from FISLOCAL.EUB_ROZNICHNAJA_O_ASWA ro,
            FISLOCAL.EUB_TIP_USLUGI_AJUV ru
            where ro.id = ${organizationID}
            and ru.host_mtype = ${organizationID}
            `)
      servicesOfOrganization = servicesOfOrganization.rows
      servicesOfOrganization = servicesOfOrganization.flat()
      servicesOfOrganization = servicesOfOrganization.join(', ')

      //Находим услуги которые доступны и для схемы и для розничной
      let availableServices = await connection.execute(`
            select u.NAIMENOVANIE
            from FISLOCAL.EUB_TIP_USLUGI u
            where u.id in (${servicesOfOrganization})
            and u.id in (${servicesOfScheme})
            and u.ARHIVNYJ != 1`)
      availableServices = availableServices.rows
      availableServices = availableServices.flat()

      return availableServices
    } catch (err) {
      console.error(err)
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
  /**
   * Метод добавления доп услуги(с необходимыми данными) в объект кредита
   * @param {Object} credit - объект с тестовыми данными кредита
   */
  async chooseAdditionalServices(credit) {
    if (codeceptjs.config.get().generateAdditionalService) {
      const { AdditionalServices } = this.helpers
      if (!credit?.additionalServices?.typeOfService) {
        let haveAdditionalService = await AdditionalServices.randomChoice(0, 1)
        if (
          haveAdditionalService &&
          credit?.insurancePolicy?.type !== 'КАСКО не оформляется' &&
          credit?.insurancePolicy?.type !== 'КАСКО в подарок Max'
        ) {
          let additionalServicesArray = await AdditionalServices.getAdditionalServices(credit)
          let additionalServicesSortArray = await AdditionalServices.sortArray(additionalServicesArray)
          let selectedAdditionalService =
            additionalServicesSortArray[
              await AdditionalServices.randomChoice(0, additionalServicesSortArray.length - 1)
            ]

          credit.additionalServices.typeOfService = selectedAdditionalService

          if (selectedAdditionalService === 'ДМС Экспресс Доктор') {
            credit.additionalServices.typeOfService = null
          }
          if (selectedAdditionalService === 'Потеря дохода') {
            credit.additionalServices.typeOfService = null
          }
          if (selectedAdditionalService === 'Программа Gold НС+помощь на дорогах') {
            credit.additionalServices.typeOfService = 'Программа Gold НС+помощь на дорогах (DELETED+Этнамед)'
          }
          if (selectedAdditionalService === 'Программа Premium НС+помощь на дорогах') {
            credit.additionalServices.typeOfService = 'Программа Premium НС+помощь на дорогах (DELETED+Этнамед)'
          }
          if (selectedAdditionalService === 'GAP-страхование') {
            credit.additionalServices.typeOfService = 'GAP-страхование (СК "DELETED")'
          }
          if (
            selectedAdditionalService === 'Продленная гарантия' ||
            selectedAdditionalService === 'Потеря ценных вещей' ||
            selectedAdditionalService === 'Страхование шин и дисков' ||
            selectedAdditionalService === 'Сервисный контракт' ||
            selectedAdditionalService === 'Страхование автомобиля от поломок' ||
            selectedAdditionalService === 'Страхование автомобиля' ||
            selectedAdditionalService === 'Индивидуальное страхование' ||
            selectedAdditionalService === 'Карты помощи на дорогах' ||
            selectedAdditionalService === 'GAP-страхование(дилерское)' ||
            selectedAdditionalService === 'Страхование от несчастных случаев'
          ) {
            credit.additionalServices.retailOrganization =
              credit.additionalServices.retailOrganization ?? 'Филиал "Порше Центр Пулково" АО "АВТОДОМ"'
            credit.additionalServices.subpartner =
              credit.additionalServices.subpartner ?? 'Филиал "Порше Центр Пулково" АО "АВТОДОМ"'
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? '40702810600760012790'
            credit.additionalServices.cost =
              credit.additionalServices.cost ?? (await AdditionalServices.randomChoice(10000, 20000))
            if (selectedAdditionalService === 'Индивидуальное страхование') {
              credit.financialProtection.company = null //это нужно, т.к. нельзя оформлять ФЗ и ИС одновременно
              credit.financialProtection.tariff = null //это нужно, т.к. нельзя оформлять ФЗ и ИС одновременно
            }
          }
          if (selectedAdditionalService === 'Добровольное медицинское страхование') {
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? 'Получатель'
            credit.additionalServices.cost =
              credit.additionalServices.cost ?? (await AdditionalServices.randomChoice(10000, 50000))
            credit.additionalServices.term = '1'
          }
          if (selectedAdditionalService === 'ОСАГО в кредит') {
            credit.additionalServices.retailOrganization =
              credit.additionalServices.retailOrganization ?? 'АО "DELETEDСтрахование"'
            credit.additionalServices.subpartner = credit.additionalServices.subpartner ?? 'АО "DELETEDСтрахование"'
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? '40701810000010000031'
            credit.additionalServices.startDate =
              credit.additionalServices?.startDate ?? (await AdditionalServices.toDayDate())
            credit.additionalServices.endDate =
              credit.additionalServices?.endDate ?? (await AdditionalServices.endDate())
            credit.additionalServices.polisNumber =
              credit.additionalServices?.polisNumber ??
              (await AdditionalServices.randomChoice(100000000000, 999999999999))
            credit.additionalServices.cost =
              credit.additionalServices?.cost ?? (await AdditionalServices.randomChoice(10000, 50000))
          }
          if (selectedAdditionalService === 'ОСАГО за наличные') {
            credit.additionalServices.retailOrganization =
              credit.additionalServices.retailOrganization ?? 'АО "DELETED"'
            credit.additionalServices.startDate =
              credit.additionalServices.startDate ?? (await AdditionalServices.toDayDate())
            credit.additionalServices.endDate =
              credit.additionalServices.endDate ?? (await AdditionalServices.endDate())
            credit.additionalServices.polisNumber =
              credit.additionalServices.polisNumber ??
              (await AdditionalServices.randomChoice(100000000000, 999999999999))
          }
          if (
            selectedAdditionalService === 'Помощь на дорогах КАР АССИСТАНС' ||
            selectedAdditionalService === 'DELETED' ||
            selectedAdditionalService === 'Карта РАТ Совкомбанк Gold' ||
            selectedAdditionalService === 'Финансовый GAP Согласие' ||
            selectedAdditionalService === 'Финансовый GAP РЕСО-Гарантия'
          ) {
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? '47422810450160077486'
            credit.additionalServices.term =
              credit.additionalServices.term ?? (await AdditionalServices.randomChoice(1, 5))
            credit.auto.categoryAuto = 'B'
          }
          if (
            selectedAdditionalService === 'Рейлинги на крышу' ||
            selectedAdditionalService === 'Крепления багажника' ||
            selectedAdditionalService === 'Вебаста' ||
            selectedAdditionalService === 'Фаркоп' ||
            selectedAdditionalService === 'Прочее доп.оборудование'
          ) {
            if (credit.parameters.program.includes('рассрочк')) {
              credit.additionalServices.subpartner = credit.additionalServices.subpartner ?? 'ООО DELETED'
            }
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? 'DELETED'
            credit.additionalServices.cost =
              credit.additionalServices.cost ?? (await AdditionalServices.randomChoice(10000, 50000))
          }
          if (selectedAdditionalService === 'Гарантия погашения кредита') {
            credit.additionalServices.term = credit.additionalServices.term ?? 12
          }
          if (selectedAdditionalService === 'Финансовый GAP DELETED') {
            credit.additionalServices.requisites = credit.additionalServices.requisites ?? '47422810250160048550'
            credit.additionalServices.term = credit.additionalServices.term ?? credit.parameters.term
            credit.auto.categoryAuto = 'B' //данная услуга может быть оформлена только для авто категории B
          }
          if (selectedAdditionalService === 'Программа Gold НС+помощь на дорогах') {
            credit.additionalServices.requisites = '47422810650160048558'
            credit.additionalServices.term =
              credit.additionalServices.term ?? (await AdditionalServices.randomChoice(1, 5))
            credit.auto.categoryAuto = 'B' //данная услуга может быть оформлена только для авто категории B
          }
          if (selectedAdditionalService === 'Программа Premium НС+помощь на дорогах') {
            credit.additionalServices.requisites = '47422810950160048559'
            credit.additionalServices.term =
              credit.additionalServices.term ?? (await AdditionalServices.randomChoice(1, 5))
            credit.auto.categoryAuto = 'B' //данная услуга может быть оформлена только для авто категории B
          }
          if (selectedAdditionalService === 'GAP-страхование') {
            credit.additionalServices.requisites = '47422810150160048540'
            credit.additionalServices.term =
              credit.additionalServices.term ?? (await AdditionalServices.randomChoice(1, 3))
            credit.auto.categoryAuto = 'B' //данная услуга может быть оформлена только для авто категории B
          }
          if (selectedAdditionalService === 'Карта РАТ Совкомбанк Premium') {
            credit.additionalServices.requisites = '47422810050160077488'
            credit.additionalServices.term =
              credit.additionalServices.term ?? (await AdditionalServices.randomChoice(1, 5))
            credit.auto.categoryAuto = 'B' //данная услуга может быть оформлена только для авто категории B
          }
          if (
            credit?.insurancePolicy?.type === 'EGAP' &&
            credit.additionalServices.typeOfService === 'GAP-страхование(дилерское)'
          ) {
            credit.additionalServices.typeOfService = null
          }
        }
      }
    }
  }
}

module.exports = AdditionalServices
