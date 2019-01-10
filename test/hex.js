'use strict';

const Hex = require('../lib/game/board/hex').Hex;

test('should initialize', () => {

  expect(() => new Hex()).not.toThrow();

});
