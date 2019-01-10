'use strict';

const Hex = require('../lib/core/board/hex').Hex;

test('should initialize', () => {

  expect(() => new Hex(0, {}, {})).not.toThrow();

});
