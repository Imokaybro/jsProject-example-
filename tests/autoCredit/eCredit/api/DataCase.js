const DEFAULT_CASE = {
  credit: {
    idSystem: 'DELETED',
    fisClientId: 'DELETED',
    bic: 'DELETED',
    checkingAccount: 'DELETED',
    additionalServices: ['КАСКО дилер'],
    cardHALVA: { card: true, limit: '60000' },
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
    { other },
  ),
*/

module.exports = {
  id_125639: createCase(
    { parameters: { program: 'DELETED', cost: '1000000', initialPayment: '100000', term: '24' } },
    { auto: { status: 'Новый', yearOfRelease: '2024', marka: 'DELETED', model: 'DELETED' } },
    { cardHALVA: { card: false } },
  ),
}
