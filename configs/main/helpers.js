const fs = require('fs')
const path = require('path')
const fakeVideoFileName = '../data/test_video.y4m'
const pathToFakeVideoFile = path.join(__dirname, fakeVideoFileName)

function setPathForChrome() {
  const pathList = [
    'C:\\Program Files (x86)\\Yandex\\YandexBrowser\\Application\\browser.exe',
    'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe',
    '/usr/bin/yandex-browser',
  ]
  for (let path of pathList) {
    if (fs.existsSync(path)) {
      return path
    }
  }
}

module.exports = {
  helpers: {
    AutouserLogin: {
      require: '../helpers/AutouserLogin.js',
    },
    CardHelper: {
      require: '../helpers/CardHelper.js',
    },
    GrabData: {
      require: '../helpers/customMethods/GrabData.js',
    },
    ExpectChaiWrapper: {
      require: '../helpers/customMethods/ExpectChaiWrapper.js',
    },
    ErrorMonitor: {
      require: '../helpers/ErrorMonitor.js',
    },
    Logs: {
      require: '../helpers/serverLogs/Logs.js',
    },
    GenerateCreditData: {
      require: '../helpers/generators/GenerateCreditData.js',
    },
    GenerateClientData: {
      require: '../helpers/generators/GenerateClientData.js',
    },
    GenerateXML: {
      require: '../helpers/generators/GenerateXML.js',
    },
    DataBaseHelper: {
      require: '../helpers/DataBaseHelper.js',
    },
    FakeClientData: {
      require: '../helpers/fakers/FakeClientData.js',
    },
    FakeCreditData: {
      require: '../helpers/fakers/FakeCreditData.js',
    },
    CustomMethod: {
      require: '../helpers/CustomMethod.js',
    },
    API: {
      require: '../helpers/API.js',
    },
    NegativeCheckMethod: {
      require: '../helpers/NegativeCheckMethod.js',
    },
    AdditionalServices: {
      require: '../helpers/AdditionalServices.js',
    },
    FileSystem: {},
    Puppeteer: {
      url: '',
      waitForNavigation: 'domcontentloaded',
      getPageTimeout: 30000,
      pressKeyDelay: 0,
      chrome: {
        executablePath: setPathForChrome(),
        headless: false,
        args: [
          '--use-fake-ui-for-media-stream',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--ignore-certificate-errors',
          '--disable-web-security',
          '--use-fake-device-for-media-stream',
          '--use-file-for-fake-video-capture=' + pathToFakeVideoFile,
          '--allow-file-access-from-files',
        ],
      },
    },
  },
}
