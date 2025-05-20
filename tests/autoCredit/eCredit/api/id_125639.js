const DataCase = require('./DataCase')
const { ECreditQuestionnaire } = require('../../../../pages/ECredit/ECreditQuestionnaire')
const { CreditStatus } = require('../../../../pages/ECredit/CreditStatus')
const { PostAgreement } = require('../../../../pages/ECredit/PostAgreement')
const { PushSignedPrintDoc } = require('../../../../pages/ECredit/PushSignedPrintDoc')

Feature('E-Credit')

Scenario(
  'DELETED. @125639 @eCreditAPI',
  { externalId: '125639' },
  async function ({ I }) {
    tags = this.tags
    const testCase = DataCase.id_125639
    const client = await I.generateClientData(testCase.client, testCase.credit)
    const credit = testCase.credit
    credit.schemeId = (await I.selectFromDataBase('schemeId.sql', `АВТОКРЕД ${credit.parameters.program}`)).rows[0][0]
    await new ECreditQuestionnaire().sendQuestionnaire(client, credit, 'Short')
    await new ECreditQuestionnaire().sendQuestionnaire(client, credit, 'Full')
    const response = await new PostAgreement().send(credit)
    await I.cSay(JSON.stringify(response))
    await new PostAgreement().checkStatus(response)
    await new PushSignedPrintDoc().sendPrintDoc(credit)
    await new CreditStatus().check(credit)
  },
)
