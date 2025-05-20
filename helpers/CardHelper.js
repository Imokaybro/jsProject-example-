const Helper = require('@codeceptjs/helper')
const oracledb = require('oracledb')

class CardHelper extends Helper {
  /**
   * Получение данных карт из РБС
   * @param {String} CARD_TYPE - айди типа карты, например 1006 - Халва, 1003 - ЗК
   * @returns
   */
  async grabCardData(CARD_TYPE) {
    const CARD_DATA = await this.run(CARD_TYPE)
    return CARD_DATA
  }

  async run(CARD_TYPE) {
    let connection
    const connectionParameters = {
      user: codeceptjs.container.support().envConf.RBS_LOGIN || process.env.RBS_LOGIN,
      password: codeceptjs.container.support().envConf.RBS_LOGIN || process.env.RBS_LOGIN,
    }
    const rbsStand = codeceptjs.container.support().envConf.RBS || process.env.RBS
    if (rbsStand === 'RBSSUP2' || rbsStand === 'RBSPATCH') {
      connectionParameters.connectString = 'urt-sun-db24.sovcombank.group:1529/rbssup2'
    } else {
      connectionParameters.connectString = 'urt-sun-m81-1.sovcombank.group:1624/test'
    }
    try {
      connection = await oracledb.getConnection(connectionParameters)

      let result = await connection.execute(
        `SELECT ID_SUBJ FROM (SELECT * FROM brk.openapi_result ORDER BY DBMS_RANDOM.VALUE) WHERE ID_CASE in ${CARD_TYPE} and rownum < 2`,
      )
      let CARD_DATA = result.rows[0][0].split(';')
      await connection.execute(
        'declare v_var brk.openapi_result.id_subj%type; BEGIN v_var:=BRK.GET_OPENAPI(:CARD_TYPE); Dbms_Output.put_line(v_var); END;',
        [CARD_TYPE],
      )
      return CARD_DATA
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
}

module.exports = CardHelper
