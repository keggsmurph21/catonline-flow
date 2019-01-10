'use strict';

const BoardNode = require('../lib/core/board/board-node').BoardNode;

test('should initialize', () => {

  expect(() => new BoardNode()).not.toThrow();

});
