'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const defaults = require('./lib/core/game').defaults;
const Human = require('./lib/core/player').Human;

defaults.numHumans = 2;

const h1 = new Human('player_1');
const h2 = new Human('player_2');
const g = new Game(h1, defaults);

g.addPlayer(h2);

g.begin();

const p1 = g.getParticipant(h1);
const p2 = g.getParticipant(h2);

/*
console.log('p1');
console.log(p1.vertex);
console.log(g.graph.getAdjacents(p1));
console.log('p2');
console.log(p2.vertex);
console.log(g.graph.getAdjacents(p2));
*/

console.log(g.getInitialConditions().board.hexes);
console.log(g.getInitialConditions().board.hexes);
