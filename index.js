'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const defaults = require('./lib/core/game').defaults;
const Human = require('./lib/core/player').Human;

defaults.numHumans = 1;

const h = new Human('test');
const g = new Game(h, defaults);

g.begin();

const p = g.participants[0];
console.log(p.vertex);
console.log(g.graph.getAdjacents(p));
