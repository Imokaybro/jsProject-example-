const event = require('codeceptjs').event

module.exports = async function () {
  event.dispatcher.on(event.test.failed, async function (test, err) {
    await new Promise(r => setTimeout(r, 100))
    console.error('\x1b[35m', `${test.title}:`, '\x1b[0m')
    console.error('\x1b[31m', '============ОШИБКА============', '\x1b[0m')
    if (test.customErr) {
      console.error('\x1b[31m', test.customErr, '\x1b[0m')
    }
    console.error('\x1b[31m', err, '\x1b[0m')
    console.error('\x1b[31m', '==============================', '\x1b[0m')
  })

  event.dispatcher.on(event.test.passed, async function (test) {
    console.error('\x1b[32m', `✔ ${test.title}`, '\x1b[0m')
  })
}
