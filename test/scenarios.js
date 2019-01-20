'use strict';

const expect = require('chai').expect;
const scenarios = require('../lib/core/scenarios').scenarios;

describe('Scenarios', () => {
  it('should all initialize', () => {
    expect(Object.keys(scenarios)).deep.equal([ 'standard' ]);
  });
});
