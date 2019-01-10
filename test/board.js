'use strict';

const _ = require('underscore');
const scenarios = require('../lib/core/scenarios').scenarios;
const Board = require('../lib/core/board').Board

test('should initialize for all scenarios', () => {

  _.each(scenarios, (scenario, name) => {

    expect(() => new Board(scenario)).not.toThrow();

  });

});
