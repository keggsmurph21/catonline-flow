'use strict';

const _ = require('underscore');
const Game = require('../lib/game');

test('should initialize for all scenarios', () => {

  _.each(Game.scenarios, (scenario, name) => {
    expect(() => new Game.Board(scenario)).not.toThrow();
  });

});
