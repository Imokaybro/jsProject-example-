const DataCase = require('./DataCase')
const { ApplicationForConsideration } = require('../../../pages/ApplicationForConsideration')
const { ApplicationForIssuance } = require('../../../pages/ApplicationForIssuance')
const { ApplicationForScoring } = require('../../../pages/ApplicationForScoring')
const { AttachingScans } = require('../../../pages/AttachingScans')
const { Authentication } = require('../../../pages/Authentication')
const { ChoosingCreditType } = require('../../../pages/ChoosingCreditType')
const { FullQuestionnaire } = require('../../../pages/FullQuestionnaire')
const { MainFormAuto } = require('../../../pages/MainFormAuto')
const { PrintedDocuments } = require('../../../pages/PrintedDocuments')
const { ShortQuestionnaire } = require('../../../pages/ShortQuestionnaire')
const { TransactionParameters } = require('../../../pages/TransactionParameters')

Feature('Автокредитование')

Scenario('DELETED. @29991 @line', { externalId: '29991' }, async function ({ I }) {
  tags = this.tags
  const testCase = DataCase.id_29991
  const client = await I.generateClientData(testCase.client, testCase.credit)
  const credit = await I.generateCreditData(testCase.credit)
  await I.chooseAdditionalServices(credit)
  await new Authentication().login(credit)
  await new MainFormAuto().choseClient(client)
  await new ChoosingCreditType().choseCreditType(credit.typeCredit)
  await new ShortQuestionnaire().generalShortQuestionnaire(client, credit)
  await new ApplicationForScoring().fillApplicationForScoring(client, credit)
  await new FullQuestionnaire().fillGeneralFullQuestionnaire(client, credit)
  await new ApplicationForConsideration().fillGeneralApplicationForConsideration(credit)
  await new ApplicationForIssuance().fillPageAuto(credit)
  await new TransactionParameters().fillPage(credit)
  await new PrintedDocuments().checkDocumentsForAutocredit(credit)
  await new AttachingScans().fillPage(credit)
  await new Authentication().unlogin(client, credit, this.title)
})
