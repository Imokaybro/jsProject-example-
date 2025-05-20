const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure')
const { bootstrapSetEnv } = require('./bootstrap.js')
const { setCommonPlugins } = require('@codeceptjs/configure')
setHeadlessWhen(process.env.HEADLESS)
setCommonPlugins()
setWindowSize(1200, 700) //для ноута 15' setWindowSize(1200, 700) Обычное (1600, 900)
require('dotenv').config({ path: '.env' })
const Vault = require('../../vault/vault.js')

module.exports = {
  ...require('./helpers.js'),
  async bootstrap() {
    await bootstrapSetEnv()
  },
  async bootstrapAll() {
    await new Vault().setEnvFromVault()
  },
  rbs: 'DELETED',
  stand: '', // current stand; for example: 'bt', 'kb'
  tags: [],
  keyClock: true,
  tests: '../tests/**/*.js',
  output: '../output',
  plugins: {
    screenshotOnFail: {
      enabled: true,
      uniqueScreenshotNames: true,
      fullPageScreenshots: true,
    },
    tryTo: {
      enabled: true,
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    testIT: {
      require: '../plugins/testIT.js',
      enabled: false,
    },
    errorMessage: {
      require: '../plugins/errorMessage',
      enabled: true,
    },
    creditParametersChecker: {
      require: '../plugins/creditParametersChecker',
      enabled: true,
    },
  },
  include: {
    name: 'codecept-test-it-testing',
  },
}
