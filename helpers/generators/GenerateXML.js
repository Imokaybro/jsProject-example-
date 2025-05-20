const Helper = require('@codeceptjs/helper')
/**
 * Генератор XML
 */
class GenerateXML extends Helper {
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
      const randomPoz = Math.floor(Math.random() * charSet.length)
      randomNumber += charSet.substring(randomPoz, randomPoz + 1)
    }
    return randomNumber
  }

  /**
   * Генератор текстового запроса по сервису OneTwoAuto, подходящего для форматирования в XML
   * @param {Object} client - объект с тестовыми данными клиента
   * @param {Object} credit - объект с тестовыми данными кредита
   * @param {string} requestType - тип запроса (Short/Full)
   * @returns возвращает строку с возможностью форматирования в XML
   */
  async generateXMLeCredit(client, credit, requestType) {
    let insuranceList = ''
    credit.reqID = credit.reqID ?? `autotest${await this.randomNumber(15)}`
    if (client.gender === 'Женский') {
      client.sex = 'f'
    } else {
      client.sex = 'm'
    }
    let passportDateOfIssue = client.passport.dateOfIssue.split('.')
    passportDateOfIssue = `${passportDateOfIssue[2]}-${passportDateOfIssue[1]}-${passportDateOfIssue[0]}`
    let dateOfBirth = client.dateOfBirth.split('.')
    dateOfBirth = `${dateOfBirth[2]}-${dateOfBirth[1]}-${dateOfBirth[0]}`
    let dateOfRegistration = client.address.dateOfRegistration ?? ''
    if (dateOfRegistration) {
      dateOfRegistration = client.address.dateOfRegistration.split('.')
      dateOfRegistration = `${dateOfRegistration[2]}-${dateOfRegistration[1]}-${dateOfRegistration[0]}`
      dateOfRegistration = `<ns2:RegDate>${dateOfRegistration}</ns2:RegDate>`
    }

    let passportSerial = client.passport.serial.split('')
    passportSerial = `${passportSerial[0]}${passportSerial[1]} ${passportSerial[2]}${passportSerial[3]}`

    if (requestType == 'Full') {
      insuranceList = await this.generateAdditionalServicesXML(credit)
    }
    if (!credit.auto.millage) {
      if (credit.auto.status == 'Новый') {
        credit.auto.millage = '10'
      } else {
        credit.auto.millage = '10000'
      }
    }

    const jobPhone = client?.placeOfWork?.jobPhone ?? '9163973218'
    let data = `<SOAP-ENV:Envelope
        xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
        <SOAP-ENV:Header/>
        <SOAP-ENV:Body>
            <ns2:ReqOneTwoAutoRequest
                xmlns:ns2="http://bp.ws.fisgroup.ru">
                <ns2:ReqID>${credit.reqID}</ns2:ReqID>
                <ns2:FisClientId>${credit.fisClientId}</ns2:FisClientId>
                <ns2:TypeRequest>${requestType}</ns2:TypeRequest>
                <ns2:Agree>
                    <ns2:Self_Sum>${credit.parameters.initialPayment}</ns2:Self_Sum>
                    <ns2:Credit_Sum>0</ns2:Credit_Sum>
                    <ns2:TradeIn_Sum>0</ns2:TradeIn_Sum>
                    <ns2:Tovar>
                        <ns2:Price>${credit.parameters.cost}</ns2:Price>
                        <ns2:FirstFee>${credit.parameters.initialPayment}</ns2:FirstFee>
                        <ns2:Period>${credit.parameters.term}</ns2:Period>
                        <ns2:Marka>${credit.auto.marka}</ns2:Marka>
                        <ns2:Model>${credit.auto.model}</ns2:Model>
                        <ns2:Character>${credit.auto.status}</ns2:Character>
                        <ns2:Year>${credit.auto.yearOfRelease}</ns2:Year>
                        <ns2:Mile>${credit.auto.millage}</ns2:Mile>
                    </ns2:Tovar>
                    <ns2:NameProduct>${credit.schemeId}</ns2:NameProduct>
                    ${insuranceList}
                </ns2:Agree>
                <ns2:Client>
                    <ns2:Sex>${client.sex}</ns2:Sex>
                    <ns2:Address>
                        <ns2:AdrType>Фактический адрес</ns2:AdrType>
                        <ns2:Country>РФ</ns2:Country>
                        <ns2:Region>СаратоDELETEDая</ns2:Region>
                        <ns2:RegionType>область</ns2:RegionType>
                        <ns2:RegionCode>6400000000000</ns2:RegionCode>
                        <ns2:CityType>г</ns2:CityType>
                        <ns2:City>Саратов</ns2:City>
                        <ns2:StreetType>ул</ns2:StreetType>
                        <ns2:Street>МоскоDELETEDая</ns2:Street>
                        <ns2:House>9</ns2:House>
                        <ns2:PostCode>410002</ns2:PostCode>
                    </ns2:Address>
                    <ns2:Address>
                        <ns2:AdrType>Адрес регистрации</ns2:AdrType>
                        <ns2:Country>РФ</ns2:Country>
                        <ns2:Region>СаратоDELETEDая</ns2:Region>
                        <ns2:RegionType>область</ns2:RegionType>
                        <ns2:RegionCode>6400000000000</ns2:RegionCode>
                        <ns2:CityType>г</ns2:CityType>
                        <ns2:City>Саратов</ns2:City>
                        <ns2:StreetType>ул</ns2:StreetType>
                        <ns2:Street>МоскоDELETEDая</ns2:Street>
                        <ns2:House>9</ns2:House>
                        <ns2:PostCode>410002</ns2:PostCode>
                    </ns2:Address>
                    <ns2:AddressFactAsReg>true</ns2:AddressFactAsReg>
                    ${dateOfRegistration}
                    <ns2:Pasport>
                        <ns2:Serial>${passportSerial}</ns2:Serial>
                        <ns2:Number>${client.passport.number}</ns2:Number>
                        <ns2:DateOfIssue>${passportDateOfIssue}</ns2:DateOfIssue>
                        <ns2:Org>${client.passport.issuedBy}</ns2:Org>
                        <ns2:CodeDiv>640-001</ns2:CodeDiv>
                        <ns2:DocType>Паспорт</ns2:DocType>
                    </ns2:Pasport>
                    <ns2:Contact>
                        <ns2:MobPhone>8${client.contact.mobilePhone}</ns2:MobPhone>
                        <ns2:JobPhone>8${jobPhone}</ns2:JobPhone>
                    </ns2:Contact>
                    <ns2:Job>
                        <ns2:NameJob>${client.placeOfWork.nameOfTheOrganization}</ns2:NameJob>
                        <ns2:TypeJob>${client.placeOfWork.organizationType}</ns2:TypeJob>
                        <ns2:Industry>${client.placeOfWork.industry}</ns2:Industry>
                        <ns2:Post>${client.placeOfWork.profession}</ns2:Post>
                        <ns2:Occupation>${client.placeOfWork.busyness}</ns2:Occupation>
                        <ns2:Exp_y>${client.placeOfWork.workExperienceYears}</ns2:Exp_y>
                        <ns2:Exp_m>${client.placeOfWork.workExperienceMonths}</ns2:Exp_m>
                        <ns2:Adress>
                            <ns2:AdrType>Рабочий адрес</ns2:AdrType>
                            <ns2:Country>РФ</ns2:Country>
                            <ns2:Region>Санкт-Петербург</ns2:Region>
                            <ns2:RegionType>г</ns2:RegionType>
                            <ns2:RegionCode>7800000000000</ns2:RegionCode>
                            <ns2:CityType>г</ns2:CityType>
                            <ns2:City>Санкт-Петербург</ns2:City>
                            <ns2:StreetType>пр-кт</ns2:StreetType>
                            <ns2:Street>МоскоDELETEDий</ns2:Street>
                            <ns2:House>212</ns2:House>
                            <ns2:Building>литер а</ns2:Building>
                            <ns2:PostCode>196066</ns2:PostCode>
                        </ns2:Adress>
                    </ns2:Job>
                    <ns2:FamilyState>${client.maritalStatus}</ns2:FamilyState>
                    <ns2:NoChangeFIO>${!client.oldName.change}</ns2:NoChangeFIO>
                    <ns2:Education>${client.otherPersonalInformation.education}</ns2:Education>
                    <ns2:SocialStatus>${client.otherPersonalInformation.socialStatus}</ns2:SocialStatus>
                    <ns2:NoOldPasport>${!client.oldPassport.haveOldPassport}</ns2:NoOldPasport>
                    <ns2:Count>${client.otherPersonalInformation.dependentPersons}</ns2:Count>
                    <ns2:CountChild>${client.otherPersonalInformation.children}</ns2:CountChild>
                    <ns2:Income>
                        <ns2:Type>Основной</ns2:Type>
                        <ns2:Summa>${client.incomeAndExpenses.mainIncome}</ns2:Summa>
                    </ns2:Income>
                    <ns2:Income>
                        <ns2:Type>Аренда</ns2:Type>
                        <ns2:Summa>10000</ns2:Summa>
                    </ns2:Income>
                    <ns2:FactLiving>${client.otherPersonalInformation.actualPlacement}</ns2:FactLiving>
                    <ns2:LastName>${client.surname}</ns2:LastName>
                    <ns2:FirstName>${client.firstName}</ns2:FirstName>
                    <ns2:MiddleName>${client.patronymic}</ns2:MiddleName>
                    <ns2:BirthDate>${dateOfBirth}</ns2:BirthDate>
                    <ns2:birthPlace>${client.placeOfBirth}</ns2:birthPlace>
                </ns2:Client>
                <ns2:idSystem>${credit.idSystem}</ns2:idSystem>
            </ns2:ReqOneTwoAutoRequest>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    `
    return data
  }

  /**
   * Генератор текстового запроса по сервису PushSignedPrintDoc, подходящего для форматирования в XML
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns возвращает строку с возможностью форматирования в XML
   */
  async generateXMLPushSignedPrintDoc(credit) {
    const data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bp="http://bp.ws.fisgroup.ru">
        <soapenv:Header/>
        <soapenv:Body>
           <bp:ReqPushSignedPrintDoc>
              <bp:applicationID>${credit.reqID}</bp:applicationID>
              <bp:Scans>
                 <bp:fileType>pdf</bp:fileType>
                 <bp:documentScan>JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhydS1SVSkgL1N0cnVjdFRyZWVSb290IDEyMyAwIFIvTWFya0luZm88PC9NYXJrZWQgdHJ1ZT4</bp:documentScan>
                 <bp:pageNumber>1</bp:pageNumber>
                 <bp:fileName>Индивидуальные условия</bp:fileName>
                 <bp:documentType>Сканы_pdf</bp:documentType>
              </bp:Scans>
           </bp:ReqPushSignedPrintDoc>
        </soapenv:Body>
     </soapenv:Envelope>
    `
    return data
  }
  /**
   * Генерация текста запроса ЕГАП
   * @returns строка с текстом запроса
   */
  async generateEGAP() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>КАСКО</ns2:type>
            <ns2:paymentType>Вкредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>БАНКОDELETEDАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  async generateRAT() {
    const data = `
        <ns2:insuranceList>
          <ns2:type>РАТ</ns2:type>
          <ns2:paymentType>ВКредит</ns2:paymentType>
          <ns2:company>
            <ns2:type>Gold</ns2:type>
          </ns2:company>
          <ns2:period>12</ns2:period>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса КАСКО
   * @returns строка с текстом запроса
   */
  async generateCasco() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>КАСКО</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
              <ns2:type>Дилерская</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса КАСКО за наличные
   * @returns строка с текстом запроса
   */
  async generateCascoForCash() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>КАСКО</ns2:type>
            <ns2:paymentType>ЗАналичные</ns2:paymentType>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Личное страхование
   * @returns строка с текстом запроса
   */
  async personalInsurance() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>Жизнь</ns2:type>
            <ns2:agreementPercent>1.75</ns2:agreementPercent>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>БАНКОDELETEDАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ФЗ
   * @returns строка с текстом запроса
   */
  async financialProtection() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>Жизнь</ns2:type>
            <ns2:agreementPercent>1.75</ns2:agreementPercent>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>ДИЛЕРСКАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ДМС
   * @returns строка с текстом запроса
   */
  async dms() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>DMA</ns2:type>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ГАП
   * @returns строка с текстом запроса
   */
  async gap() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>GAP</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>БАНКОDELETEDАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ГАП дилерское
   * @returns строка с текстом запроса
   */
  async gapDealer() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>GAP</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>ДИЛЕРСКАЯ</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Помощь на дорогах СТАНДАРТ
   * @returns строка с текстом запроса
   */
  async roadsideAssistanceSTANDARD() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>Карты</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>БАНКОDELETEDАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Карта помощи на дорогах
   * @returns строка с текстом запроса
   */
  async roadsideAssistanceCards() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>Карты</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>ДИЛЕРСКАЯ</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Гарантия РЕССО
   * @returns строка с текстом запроса
   */
  async gapRESOWarranty() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>ФинGAP</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>БАНКОDELETEDАЯ</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ФИН ГАП дилерское
   * @returns строка с текстом запроса
   */
  async finGAPDealer() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>ФинGAP</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>ДИЛЕРСКАЯ</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса специальных продуктов
   * @returns строка с текстом запроса
   */
  async specialProducts() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>ДОППРОДУКТ</ns2:type>
            <ns2:paymentType>ВКредит</ns2:paymentType>
            <ns2:company>
                <ns2:type>ДИЛЕРСКАЯ</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса субсидий
   * @returns строка с текстом запроса
   */
  async subsidy(credit) {
    const data = `
        <ns2:insuranceList>
            <ns2:type>Subsidy</ns2:type>
            <ns2:agreementPercent>2</ns2:agreementPercent>
            <ns2:company>
                <ns2:type>${credit.subsidy}</ns2:type>
            </ns2:company>
            <ns2:tamount>
                <ns2:amount>10000</ns2:amount>
                <ns2:currency>810</ns2:currency>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Остаточный платеж
   * @returns строка с текстом запроса
   */
  async residualPayment(residualPayment) {
    const data = `
        <ns2:insuranceList>
            <ns2:type>BuyBack</ns2:type>
            <ns2:paymentType>ЗАналичные</ns2:paymentType>
            <ns2:company>
                <ns2:type>БанкоDELETEDая</ns2:type>
            </ns2:company>
            <ns2:tamount>
              <ns2:currency>810</ns2:currency>
            </ns2:tamount>
            <ns2:agreementPercent>${residualPayment}</ns2:agreementPercent>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса ГМС
   * @returns строка с текстом запроса
   */
  async gms() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>GMS</ns2:type>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Назначь свою ставку
   * @returns строка с текстом запроса
   */
  async setYourBet(credit) {
    const data = `
        <ns2:insuranceList>
            <ns2:type>NSS</ns2:type>
            <ns2:paymentType>ЗАналичные</ns2:paymentType>
            <ns2:company>
                <ns2:type>${credit.setYourBet}</ns2:type>
            </ns2:company>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Генерация текста запроса Платеж в подарок
   * @returns строка с текстом запроса
   */
  async pvp() {
    const data = `
        <ns2:insuranceList>
            <ns2:type>PVP</ns2:type>
        </ns2:insuranceList>
        `
    return data
  }

  async lossOfIncome(credit) {
    const period = credit.lossOfIncomePeriod ?? '1'
    const data = `
              <ns2:insuranceList>
                <ns2:type>ПотеряДохода</ns2:type>
                <ns2:paymentType>ВКредит</ns2:paymentType>
                <ns2:company>
                    <ns2:type>БанкоDELETEDая</ns2:type>
                </ns2:company>
                <ns2:period>${period}</ns2:period>
              </ns2:insuranceList>
    `
    return data
  }

  /**
   * Генератор текста запроса карты Золотой ключ
   * @param {Object} credit - объект с тестовыми данными кредита
   * @returns строка с данными запроса с возможностью конвертации в JSON
   */
  async goldKeyCard(credit) {
    const data = `
        <ns2:insuranceList>
            <ns2:type>ZK</ns2:type>
            <ns2:tamount>
                <ns2:amount>${credit.goldKeyCardTariff}</ns2:amount>
            </ns2:tamount>
        </ns2:insuranceList>
        `
    return data
  }

  /**
   * Метод генерации строки с доп. услугами
   * @param {Object} credit - объект тестовых данных кредита
   * @returns возвращает строку, которую возможно форматировать в JSON
   */
  async generateAdditionalServicesXML(credit) {
    let additionalservices = ''
    if (credit?.additionalServices?.includes('EGAP')) {
      additionalservices = `${additionalservices}${await this.generateEGAP()}`
    }
    if (credit?.additionalServices?.includes('Карта РАТ')) {
      additionalservices = `${additionalservices}${await this.generateRAT()}`
    }
    if (credit?.additionalServices?.includes('КАСКО дилер')) {
      additionalservices = `${additionalservices}${await this.generateCasco()}`
    }
    if (credit?.additionalServices?.includes('КАСКО за наличные')) {
      additionalservices = `${additionalservices}${await this.generateCascoForCash()}`
    }
    if (credit?.additionalServices?.includes('Личное страхование')) {
      additionalservices = `${additionalservices}${await this.personalInsurance()}`
    }
    if (credit?.additionalServices?.includes('ФЗ (техническое)')) {
      additionalservices = `${additionalservices}${await this.financialProtection()}`
    }
    if (credit?.additionalServices?.includes('ДМС')) {
      additionalservices = `${additionalservices}${await this.dms()}`
    }
    if (credit?.additionalServices?.includes('GAP-страхование')) {
      additionalservices = `${additionalservices}${await this.gap()}`
    }
    if (credit?.additionalServices?.includes('GAP-страхование(дилерское)')) {
      additionalservices = `${additionalservices}${await this.gapDealer()}`
    }
    if (credit?.additionalServices?.includes('Программа РАМК помощь на дороге СТАНДАРТ')) {
      additionalservices = `${additionalservices}${await this.roadsideAssistanceSTANDARD()}`
    }
    if (credit?.additionalServices?.includes('Карты помощи на дорогах')) {
      additionalservices = `${additionalservices}${await this.roadsideAssistanceCards()}`
    }
    if (credit?.additionalServices?.includes('Финансовый GAP РЕСО-Гарантия')) {
      additionalservices = `${additionalservices}${await this.gapRESOWarranty()}`
    }
    if (credit?.additionalServices?.includes('ФинGAP (диллерское)')) {
      additionalservices = `${additionalservices}${await this.finGAPDealer()}`
    }
    if (credit?.additionalServices?.includes('СпецДопПродукты (дилерское)')) {
      additionalservices = `${additionalservices}${await this.specialProducts()}`
    }
    if (credit?.additionalServices?.includes('Субсидия')) {
      additionalservices = `${additionalservices}${await this.subsidy(credit)}`
    }
    if (credit?.parameters?.residualPayment?.amount) {
      additionalservices = `${additionalservices}${await this.residualPayment(credit.parameters.residualPayment.amount)}`
    }
    if (credit?.additionalServices?.includes('Гарантия минимальной ставки')) {
      additionalservices = `${additionalservices}${await this.gms()}`
    }
    if (credit?.additionalServices?.includes('Назначь свою ставку')) {
      additionalservices = `${additionalservices}${await this.setYourBet(credit)}`
    }
    if (credit?.additionalServices?.includes('Платежи в подарок')) {
      additionalservices = `${additionalservices}${await this.pvp()}`
    }
    if (credit?.additionalServices?.includes('Золотой ключ')) {
      additionalservices = `${additionalservices}${await this.goldKeyCard(credit)}`
    }
    if (credit?.additionalServices?.includes('Потеря дохода')) {
      additionalservices = `${additionalservices}${await this.lossOfIncome(credit)}`
    }

    return additionalservices
  }
}

module.exports = GenerateXML
