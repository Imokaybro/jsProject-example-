/// <reference types='codeceptjs' />
type name = typeof import('codecept-test-it-testing')
type AutouserLogin = import('../helpers/AutouserLogin.js')
type CardHelper = import('../helpers/CardHelper.js')
type GrabData = import('../helpers/customMethods/GrabData.js')
type ExpectChaiWrapper = import('../helpers/customMethods/ExpectChaiWrapper.js')
type ErrorMonitor = import('../helpers/ErrorMonitor.js')
type GenerateCreditData = import('../helpers/generators/GenerateCreditData.js')
type GenerateClientData = import('../helpers/generators/GenerateClientData.js')
type GenerateXML = import('../helpers/generators/GenerateXML.js')
type DataBaseHelper = import('../helpers/DataBaseHelper.js')
type FakeClientData = import('../helpers/fakers/FakeClientData.js')
type FakeCreditData = import('../helpers/fakers/FakeCreditData.js')
type CustomMethod = import('../helpers/CustomMethod.js')
type NegativeCheckMethod = import('../helpers/NegativeCheckMethod.js')
type AdditionalServices = import('../helpers/AdditionalServices.js')
type API = import('../helpers/API.js')
type Logs = import('../helpers/serverLogs/Logs.js')

declare namespace CodeceptJS {
  interface SupportObject {
    I: I
    current: any
    name: name
  }
  interface Methods
    extends AutouserLogin,
      CardHelper,
      GrabData,
      ExpectChaiWrapper,
      ErrorMonitor,
      GenerateCreditData,
      GenerateClientData,
      GenerateXML,
      DataBaseHelper,
      FakeClientData,
      FakeCreditData,
      CustomMethod,
      NegativeCheckMethod,
      AdditionalServices,
      API,
      Logs,
      FileSystem,
      Puppeteer {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
