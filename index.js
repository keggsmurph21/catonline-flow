'use strict';

const Game = require('./lib/game').Game;

const params = {
  scenario: 'standard',
  isPublic: true,
  portStyle: 'fixed',
  tileStyle: 'random',
  numComputers: 2,
  numHumans: 2,
  vpGoal: 10,
};

const g = new Game(params);
console.log(g);
