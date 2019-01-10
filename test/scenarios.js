'use strict';

const scenarios = require('../src/game').scenarios;

test('all scenarios initialize', () => {

  expect(Object.keys(scenarios)).toEqual([ 'standard' ]);

});
