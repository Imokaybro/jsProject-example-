const Helper = require('@codeceptjs/helper')
const { assert } = require('chai')

class ExpectChaiWrapper extends Helper {
  /**
   * Утверждает, что проверяемое значение actualValue не пусто
   * @param {*} actualValue - проверяемое значение
   * @param {*} message - сообщение
   */
  assertIsNotEmpty(actualValue, message) {
    return assert.isNotEmpty(actualValue, message)
  }

  /**
   * Утверждает, что объект object имеет свойство property, с заданным ключом - значением value
   * @param {*} object -проверяемый объект
   * @param {*} property - искомое свойство
   * @param {*} value - искомое значение
   * @param {*} message - сообщение
   */
  assertDeepNestedPropertyVal(object, property, value, message) {
    return assert.deepNestedPropertyVal(object, property, value, message)
  }

  /**
   * Утверждает, что значение inLIst не является объектом или массивом и отображается в массиве arr
   * @param {*} inList -проверяемое значение
   * @param {*} arr - массив
   * @param {*} message - сообщение
   */
  assertOneOf(inList, arr, message) {
    return assert.oneOf(inList, arr, message)
  }

  /**
   * Утверждает строгое равенство (===) фактического actual и ожидаемого expected значений
   * @param {*} actual - фактическое значение
   * @param {*} expected - ожидаемое значение
   * @param {*} message - сообщение
   */
  assertStrictEqual(actual, expected, message) {
    return assert.strictEqual(actual, expected, message)
  }

  /**
   * Утверждает нестрогое равенство (==) фактического actual и ожидаемого expected значений
   * @param {*} actual - фактическое значение
   * @param {*} expected - ожидаемое значение
   * @param {*} message - сообщение
   */
  assertEqual(actual, expected, message) {
    return assert.equal(actual, expected, message)
  }

  /**
   * Утверждает нестрогое неравенство (==) фактического actual и ожидаемого expected значений
   * @param {*} actual - фактическое значение
   * @param {*} expected - ожидаемое значение
   * @param {*} message - сообщение
   */
  assertNotEqual(actual, expected, message) {
    return assert.notEqual(actual, expected, message)
  }

  /**
   * Утверждает, что фактическое значение actual строго больше, чем ожидаемое значение expected
   * @param {*} actual - фактическое значение
   * @param {*} expected - ожидаемое значение
   * @param {*} message - сообщение
   */
  assertIsAbove(actual, expected, message) {
    return assert.isAbove(actual, expected, message)
  }

  /**
   * Утверждает, что значение value является истинным
   * @param {*} value - проверяемое значение
   * @param {*} message - сообщение
   */
  assertIsTrue(value, message) {
    return assert.isTrue(value, message)
  }

  /**
   * Утверждает, что значение value является числом
   * @param {*} value - проверяемое значение
   * @param {*} message - сообщение
   */
  assertIsNumber(value, message) {
    return assert.isNumber(value, message)
  }

  /**
   * Утверждает, что массивы set1 и set2 содержат одни и те же элементы в любом порядке. Использует строгую проверку равенства (===)
   * @param {*} set1 - фактическое значение
   * @param {*} set2 - ожидаемое значение
   * @param {*} message - сообщение
   */
  sameMembers(set1, set2, message) {
    return assert.sameMembers(set1, set2, message)
  }

  /**
   * Утверждает, что массивы set1 и set2 содержат одни и те же элементы в том же порядке. Использует строгую проверку равенства (===)
   * @param {*} set1 - фактическое значение
   * @param {*} set2 - ожидаемое значение
   * @param {*} message - сообщение
   */
  sameOrderedMembers(set1, set2, message) {
    return assert.sameOrderedMembers(set1, set2, message)
  }

  /**
   * Утверждает, что объект set1 пуст.
   * @param {*} set1 - объект для проверки
   * @param {*} message - сообщение
   */
  isEmpty(set1, message) {
    return assert.isEmpty(set1, message)
  }

  /**
   * Утверждает, что объект set1 не пуст.
   * @param {*} set1 - объект для проверки
   * @param {*} message - сообщение
   */
  isNotEmpty(set1, message) {
    return assert.isNotEmpty(set1, message)
  }
}

module.exports = ExpectChaiWrapper
