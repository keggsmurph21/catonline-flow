'use strict';

const Node = require('../lib/game/board/node').Node;

test('should initialize', () => {

  expect(() => new Node()).not.toThrow();

});
