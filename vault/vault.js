const axios = require('axios')
const https = require('https')
const fs = require('fs')
https.globalAgent = new https.Agent({ ca: fs.readFileSync('DELETED') })
class Vault {
  constructor() {
    this.urlAuth = 'DELETED'
    this.urlSecret = 'DELETED'
  }

  async getToken() {
    if (process.env.VAULT_ROLE_ID && process.env.VAULT_SECRET_ID) {
      const data = { role_id: process.env.VAULT_ROLE_ID, secret_id: process.env.VAULT_SECRET_ID }
      const axiosConf = {
        method: 'post',
        url: this.urlAuth,
        data,
      }

      return (await axios(axiosConf)).data.auth.client_token
    }
  }

  async setEnvFromVault() {
    if (process.env.VAULT_ROLE_ID && process.env.VAULT_SECRET_ID) {
      try {
        const envConf = await this.request()
        for (const key of Object.keys(envConf)) {
          process.env[key] = envConf[key]
        }
      } catch (error) {
        console.log(error)
        throw new Error("Can't get secret from vault")
      }
    }
  }

  async request() {
    const headers = {
      'Content-Type': 'application/json',
      'X-Vault-Token': await this.getToken(),
    }
    const axiosConf = {
      method: 'get',
      url: this.urlSecret,
      headers,
    }
    return (await axios(axiosConf)).data.data
  }
}

module.exports = Vault
