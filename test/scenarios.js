'use strict';

const scenarios = require('../src/core/scenarios').scenarios;

test('all scenarios initialize', () => {

  expect(Object.keys(scenarios)).toEqual([ 'standard' ]);

});
