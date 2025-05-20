const { workerData, parentPort } = require('worker_threads')
const { exec } = require('child_process')
const debug = false

const {
  test,
  parameters: { stand, plugins = '', override },
} = workerData
const pluginsOption = plugins ? ` --plugins ${plugins}` : ''
const command = `npx codeceptjs run -c configs/${stand}.conf.js --override "{${override.replaceAll('"', '\\"')}}" --grep "${test}"${pluginsOption}`

exec(command, (err, stdout, stderr) => {
  if (err && debug) {
    console.error(err)
    console.error(JSON.stringify(stderr))
  }
  parentPort.postMessage({ output: stdout })
})
