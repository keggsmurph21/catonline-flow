'use strict';

const Road = require('../lib/game/board/road').Road;

test('should initialize', () => {

  expect(() => new Road()).not.toThrow();

});
