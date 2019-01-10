'use strict';

const Junc = require('../lib/game/board/junc').Junc;

test('should initialize', () => {

  expect(() => new Junc()).not.toThrow();

});
