'use strict';

const Board = require('../lib/game/board').Board;

test('should initialize', () => {

  expect(() => new Board()).not.toThrow();

});
