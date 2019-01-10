'use strict';

const Road = require('../lib/core/board/road').Road;

test('should initialize', () => {

  expect(() => new Road()).not.toThrow();

});
