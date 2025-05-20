const Helper = require('@codeceptjs/helper')
const FakeClientData = require('../fakers/FakeClientData')

class GenerateClientData extends Helper {
  /**
   * Метод генерации данных клиента
   * @param {object} client - объект тестовых данных клиента
   * @returns возвращает сгенерированные данные клиента
   */
  async generateClientData(client, credit) {
    const faker = new FakeClientData()
    if (!client) {
      client = {}
      if (credit.idSystem)
        client.otherPersonalInformation = {
          socialStatus: 'Рабочий, служащий по найму',
        }
    }
    // Персональная информация
    client.gender = client.gender ?? faker.gender()
    client.surname = client.surname ?? faker.surname(client.gender)
    client.firstName = client.firstName ?? faker.name(client.gender)
    client.patronymic = client.patronymic ?? faker.patronymic(client.gender)
    client.fullName = `${client.surname} ${client.firstName} ${client.patronymic}`
    client.dateOfBirth = client.dateOfBirth ?? faker.age()
    client.placeOfBirth = client.placeOfBirth ?? faker.placeOfBirth()
    client.countryOfBirth = client.countryOfBirth ?? faker.countryOfBirth()
    // Контакты
    if (!client.contact) {
      client.contact = {}
    }
    client.contact.mobilePhone = client.mobilePhone ?? faker.phoneNumber('9#########')
    client.contact.haveHomePhone = (client.contact.haveHomePhone ?? faker.randomChoice()) ? true : false
    if (client.contact.haveHomePhone) {
      client.contact.homePhone = client.homePhone ?? faker.phoneNumber('9#########')
    }
    // Паспорт клиента
    if (!client.passport) {
      client.passport = {}
    }
    client.passport.serial = client.passport.serial ?? faker.randomNumber(4)
    client.passport.number = client.passport.number ?? faker.randomNumber(6)
    client.passport.serialAndNumber = `${client.passport.serial} ${client.passport.number}`
    client.passport.divisionCode = client.passport.divisionCode ?? '640001'
    client.passport.dateOfIssue = client.passport.dateOfIssue ?? faker.randomDate()
    client.passport.issuedBy = client.passport.issuedBy ?? faker.issuedBy()

    // Адрес регистрации и фактического проживания
    if (!client.address) {
      client.address = {}
    }
    if (!client.address.addressOfRegistration) {
      client.address.addressOfRegistration = {}
      client.address.addressOfRegistration = faker.address()
      client.address.dateOfRegistration = faker.randomDate()
    }
    if (!client.address.addressOfResidence) {
      client.address.addressOfResidence = {}
      client.address.addressOfResidence = faker.address()
      client.address.dateBeginningLife = faker.randomDate()
    }

    //Семейное положение
    client.maritalStatus = client.maritalStatus ?? faker.maritalStatus()
    if (client.maritalStatus === 'Гражданский брак' || client.maritalStatus === 'Замужем / Женат') {
      if (!client.spouse) {
        client.spouse = {}
      }
      if (client.gender === 'Мужской') {
        client.spouse.gender = 'Женский'
      } else {
        client.spouse.gender = 'Мужской'
      }
      client.spouse.surname = client.spouse.surname ?? faker.surname(client.spouse.gender)
      client.spouse.firstName = client.spouse.firstName ?? faker.name(client.spouse.gender)
      client.spouse.patronymic = client.spouse.patronymic ?? faker.patronymic(client.spouse.gender)
      client.spouse.dateOfBirth = client.spouse.dateOfBirth ?? faker.age()
      client.spouse.placeOfBirth = client.spouse.placeOfBirth ?? faker.placeOfBirth()
      client.spouse.mobilePhone = client.spouse.mobilePhone ?? faker.phoneNumber('9#########')
    }

    //Документы, удостоверяющие личность
    if (!client.secondDocument) {
      client.secondDocument = {}
    }
    if (credit?.auto?.stateSubsidy) {
      client.secondDocument.haveSecondDocument = true
      client.secondDocument.document = 'Новое Водительское удостоверение'
    }
    client.secondDocument.haveSecondDocument =
      (client.secondDocument.haveSecondDocument ?? faker.randomChoice()) ? true : false
    if (client.secondDocument.haveSecondDocument) {
      client.secondDocument.document = client.secondDocument.document ?? faker.secondDocument()
      if (
        (client.secondDocument.document === 'Военный билет' ||
          client.secondDocument.document === 'Удостоверение личности офицера') &&
        credit.typeCredit == 'АвтоЛизинг физических лиц'
      ) {
        client.secondDocument.document = 'Водительское удостоверение'
      }
      switch (client.secondDocument.document) {
        case 'Водительское удостоверение':
          client.secondDocument.serial = faker.randomNumber(2) + 'ВУ'
          client.secondDocument.number = faker.randomNumber(6)
          break
        case 'Загранпаспорт':
          client.secondDocument.serial = faker.randomNumber(2)
          client.secondDocument.number = faker.randomNumber(7)
          break
        case 'Новое Водительское удостоверение':
          client.secondDocument.serial = faker.randomNumber(4)
          client.secondDocument.number = faker.randomNumber(6)
          break
        case 'Пенсионное удостоверение':
        case 'Справка из ПФР, подтверждающая статус пенсионера':
        case 'Иностранное водительское удостоверение':
          client.secondDocument.serial = faker.randomNumber(4)
          client.secondDocument.number = faker.randomNumber(8)
          break
        case 'Военный билет':
        case 'Удостоверение личности офицера':
          client.secondDocument.serial = 'ВУ'
          client.secondDocument.number = faker.randomNumber(7)
          break
        case 'Полис ОМС единого образца':
          client.secondDocument.number = faker.randomNumber(16)
          break
        case 'Свидетельство о постановке на налоговый учет':
          client.secondDocument.serial = faker.randomNumber(2)
          client.secondDocument.number = faker.randomNumber(9)
          break
        case 'Страховой медицинский полис':
          client.secondDocument.serial = faker.randomNumber(10)
          client.secondDocument.number = faker.randomNumber(20)
          break
        default:
          null
          break
      }
      client.secondDocument.dateOfIssue = client.secondDocument.dateOfIssue ?? faker.randomDate()
      client.secondDocument.issuedBy = client.secondDocument.issuedBy ?? faker.issuedBy()
    }
    client.secondDocument.haveSnils = (client.secondDocument.haveSnils ?? faker.randomChoice()) ? true : false
    if (client.secondDocument.haveSnils) {
      client.secondDocument.snils = client.secondDocument.snils ?? faker.snils()
    }
    client.secondDocument.haveInn = (client.secondDocument.haveInn ?? faker.randomChoice()) ? true : false
    if (client.secondDocument.haveInn) {
      client.secondDocument.inn = client.secondDocument.inn ?? faker.inn()
    }

    //Старый паспорт
    if (!client.oldPassport) {
      client.oldPassport = {}
    }
    client.oldPassport.haveOldPassport = (client.oldPassport.haveOldPassport ?? faker.randomChoice()) ? true : false
    if (client.oldPassport.haveOldPassport) {
      client.oldPassport.serial = client.oldPassport.serial ?? faker.randomNumber(4)
      client.oldPassport.number = client.oldPassport.number ?? faker.randomNumber(6)
      client.oldPassport.dateOfIssue = client.oldPassport.dateOfIssue ?? faker.oldPassportDate(client.dateOfBirth)
      client.oldPassport.divisionCode = client.passport.divisionCode ?? faker.departmentCode()
    }

    //Старые ФИО
    if (!client.oldName) {
      client.oldName = {}
    }
    client.oldName.change = (client.oldName.change ?? faker.randomChoice()) ? true : false
    if (client.oldName.change) {
      //генерация старого паспорта для сценария, когда была смена ФИО, но haveOldPassport = false
      if (!client.oldPassport.haveOldPassport) {
        client.oldPassport.serial = client.oldPassport.serial ?? faker.randomNumber(4)
        client.oldPassport.number = client.oldPassport.number ?? faker.randomNumber(6)
        client.oldPassport.dateOfIssue = client.oldPassport.dateOfIssue ?? faker.oldPassportDate(client.dateOfBirth)
        client.oldPassport.divisionCode = client.passport.divisionCode ?? faker.departmentCode()
      }
      client.oldName.reason = client.oldName.reason ?? faker.reasonChangeName()
      client.oldName.changeSurname = true
      client.oldName.surname = client.oldName.surname ?? faker.surname(client.gender)
      client.oldName.changeFirstName = (client.oldName.changeFirstName ?? faker.randomChoice()) ? true : false
      if (client.oldName.changeFirstName) {
        client.oldName.firstName = client.oldName.firstName ?? faker.name(client.gender)
      }
      client.oldName.changePatronymic = (client.oldName.changePatronymic ?? faker.randomChoice()) ? true : false
      if (client.oldName.changePatronymic) {
        client.oldName.patronymic = client.oldName.patronymic ?? faker.patronymic(client.gender)
      }
    }

    // Прочая информация о клиенте
    if (!client.otherPersonalInformation) {
      client.otherPersonalInformation = {}
    }
    client.otherPersonalInformation.actualPlacement =
      client.otherPersonalInformation.actualPlacement ?? faker.actualPlacement()
    if (client.otherPersonalInformation.actualPlacement === 'Иное') {
      client.otherPersonalInformation.actualPlacementComment = 'На работе'
    }
    client.otherPersonalInformation.education = client.otherPersonalInformation.education ?? faker.education()
    if (client.otherPersonalInformation.education === 'Другое') {
      client.otherPersonalInformation.educationComment = 'Закончил Хогвартс'
    }
    client.otherPersonalInformation.socialStatus = client.otherPersonalInformation.socialStatus ?? faker.socialStatus()
    if (client.otherPersonalInformation.socialStatus === 'Другое') {
      client.otherPersonalInformation.socialStatusComment = 'Собираю бутылки'
    }
    if (client.otherPersonalInformation.socialStatus === 'Самозанятость') {
      client.secondDocument.haveInn = true
      client.secondDocument.inn = client.secondDocument.inn ?? faker.inn()
    }
    client.otherPersonalInformation.dependentPersons =
      client.otherPersonalInformation.dependentPersons ?? faker.randomChoice(1, 5)
    client.otherPersonalInformation.children =
      client.otherPersonalInformation.children ?? client.otherPersonalInformation.dependentPersons

    //Место работы
    if (client.otherPersonalInformation.socialStatus !== 'Пенсионер') {
      if (!client.placeOfWork) {
        client.placeOfWork = {}
        if (!client.placeOfWork.address) {
          client.placeOfWork.address = {}
          client.placeOfWork.address = faker.address()
          client.placeOfWork.address.country = 'Россия'
        }
        client.placeOfWork.jobPhone = faker.phoneNumber('9#########')
        if (client.otherPersonalInformation.socialStatus === 'Сотрудник Банка/Группы') {
          client.placeOfWork.nameOfTheOrganization =
            client.placeOfWork.nameOfTheOrganization ?? faker.nameOfTheOrganizationSovcombank()
        } else {
          client.placeOfWork.nameOfTheOrganization =
            client.placeOfWork.nameOfTheOrganization ?? faker.nameOfTheOrganization()
        }
        client.placeOfWork.organizationType = client.placeOfWork.organizationType ?? faker.organizationType()
        client.placeOfWork.industry = client.placeOfWork.industry ?? faker.industry()
        client.placeOfWork.profession = client.placeOfWork.profession ?? faker.profession()
        client.placeOfWork.busyness = client.placeOfWork.busyness ?? faker.busyness()
        client.placeOfWork.workExperienceYears = client.placeOfWork.workExperienceYears ?? faker.randomChoice(1, 5)
        client.placeOfWork.workExperienceMonths = client.placeOfWork.workExperienceMonths ?? faker.randomChoice(1, 11)

        if (client.otherPersonalInformation.socialStatus === 'ИП') {
          client.placeOfWork.orgnip = faker.ogrnip()
          client.placeOfWork.orgnipDate = faker.randomDate()
        }
      }
    }

    // Информация о доходах и расходах
    if (client.otherPersonalInformation.socialStatus !== 'Работающий пенсионер') {
      if (!client.incomeAndExpenses) {
        client.incomeAndExpenses = {}
      }
      client.incomeAndExpenses.mainIncome = client.incomeAndExpenses.mainIncome ?? faker.randomNumber(5)
      client.incomeAndExpenses.frequency = client.incomeAndExpenses.frequency ?? faker.frequencyWages()
      if (client.incomeAndExpenses.frequency === 'Один раз в месяц') {
        client.incomeAndExpenses.firstIncomeDate = faker.randomChoice(1, 28)
      } else if (client.incomeAndExpenses.frequency === 'Два раза в месяц') {
        client.incomeAndExpenses.firstIncomeDate = faker.randomChoice(1, 10)
        client.incomeAndExpenses.secondIncomeDate = faker.randomChoice(20, 28)
      } else {
        client.incomeAndExpenses.incomeComment = faker.randomString(6)
      }
      client.incomeAndExpenses.otherIncome =
        (client.incomeAndExpenses.otherIncome ?? faker.randomChoice()) ? true : false
      if (client.incomeAndExpenses.otherIncome) {
        client.incomeAndExpenses.firstOtherIncome = {}
        client.incomeAndExpenses.firstOtherIncome.amount = faker.randomChoice(5000, 10000)
        client.incomeAndExpenses.firstOtherIncome.source = faker.source()
        client.incomeAndExpenses.firstOtherIncome.frequency = faker.frequency()
      }
      let secondOtherIncome = faker.randomChoice() ? true : false
      if (client.incomeAndExpenses.otherIncome && secondOtherIncome) {
        client.incomeAndExpenses.secondOtherIncome = {}
        client.incomeAndExpenses.secondOtherIncome.amount = faker.randomChoice(5000, 10000)
        client.incomeAndExpenses.secondOtherIncome.source = faker.source()
        client.incomeAndExpenses.secondOtherIncome.frequency = faker.frequency()
      }
      let thirdOtherIncome = faker.randomChoice() ? true : false
      if (secondOtherIncome && thirdOtherIncome) {
        client.incomeAndExpenses.thirdOtherIncome = {}
        client.incomeAndExpenses.thirdOtherIncome.amount = faker.randomChoice(5000, 10000)
        client.incomeAndExpenses.thirdOtherIncome.source = faker.source()
        client.incomeAndExpenses.thirdOtherIncome.frequency = faker.frequency()
      }
    } else {
      if (!client.incomeAndExpenses) {
        client.incomeAndExpenses = {}
      }
      client.incomeAndExpenses.mainIncome = client.incomeAndExpenses.mainIncome ?? faker.randomNumber(5)
      client.incomeAndExpenses.frequency = client.incomeAndExpenses.frequency ?? faker.frequencyWages()
      if (client.incomeAndExpenses.frequency === 'Один раз в месяц') {
        client.incomeAndExpenses.firstIncomeDate = faker.randomChoice(1, 28)
      } else if (client.incomeAndExpenses.frequency === 'Два раза в месяц') {
        client.incomeAndExpenses.firstIncomeDate = faker.randomChoice(1, 10)
        client.incomeAndExpenses.secondIncomeDate = faker.randomChoice(20, 28)
      } else {
        client.incomeAndExpenses.incomeComment = faker.randomString(6)
      }
      client.incomeAndExpenses.firstOtherIncome = {}
      client.incomeAndExpenses.firstOtherIncome.amount = faker.randomNumber(4)
      client.incomeAndExpenses.firstOtherIncome.frequency = 'Месяц'
    }

    //Третьи лица
    if (!client.thirdPerson) {
      client.thirdPerson = {}
    }
    client.thirdPerson.phoneNumber = faker.phoneNumber('9#########')
    client.thirdPerson.gender = client.thirdPerson.gender ?? faker.gender()
    client.thirdPerson.typeOfDating = client.thirdPerson.typeOfDating ?? faker.typeOfDating()
    client.thirdPerson.surname = client.thirdPerson.surname ?? faker.surname(client.thirdPerson.gender)
    client.thirdPerson.firstName = client.thirdPerson.firstName ?? faker.name(client.thirdPerson.gender)
    client.thirdPerson.patronymic = client.thirdPerson.patronymic ?? faker.patronymic(client.thirdPerson.gender)

    client.minimumRequirements = (client.minimumRequirements ?? faker.randomChoice()) ? true : false
    if (!client.minimumRequirements) {
      client.permRegistration = client.permRegistration ?? faker.randomChoice()
      client.actuallyLives = client.actuallyLives ?? faker.randomChoice()
      client.employed = client.employed ?? faker.randomChoice()
    }
    return client
  }
}

module.exports = GenerateClientData
