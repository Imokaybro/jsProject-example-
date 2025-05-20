const DEFAULT_CASE = {
  credit: {
    point: 'DELETED',
    typeCredit: 'Автокредитование',
    organization: 'DELETED',
    detailsOfRetailOrganization: 'DELETED',
    insurancePolicy: { type: 'КАСКО в кредит' },
    decision: 'Одобрено',
    comment:
      '<Result>Да</Result><Commentary>Предварительное одобрение: проверь масло</Commentary><LienAutoCost>5000000</LienAutoCost><CreditSum>65000</CreditSum>',
    fullSetOfDocuments: 'да',
  },
}
function createCase(...data) {
  const dataCase = { credit: { ...DEFAULT_CASE.credit } }
  data.forEach(item => {
    if (item.client) Object.assign(dataCase, { client: item.client })
    else {
      Object.assign(dataCase.credit, item)
    }
  })
  return dataCase
}
/*
  DEFAULT CASE
  id_1: createCase(
    { parameters: {} },
    { auto: {} },
    { financialProtection: {} },
    { additionalServices: {} },
    { cardHALVA: {} },
    { warrantyServices: {} },
  ),
*/
module.exports = {
  id_29997: createCase(
    {
      parameters: {
        program: 'DELETED',
        cost: '1599999',
        initialPayment: '250000',
        term: '24',
      },
    },
    { auto: { status: 'Подержанный', type: 'Легковые', marka: 'DELETED', model: 'DELETED' } },
  ),
}
