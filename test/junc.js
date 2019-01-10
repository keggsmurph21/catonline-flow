'use strict';

const Junc = require('../lib/core/board/junc').Junc;

test('should initialize', () => {

  expect(() => new Junc()).not.toThrow();

});
