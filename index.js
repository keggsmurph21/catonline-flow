'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const defaults = require('./lib/core/game').defaults;
const Human = require('./lib/core/player').Human;
const { print } = require('./lib/utils');

function show() {
  console.log([
    g.graph.getAdjacents(p1),
    g.graph.getAdjacents(p2)
  ]);
}

defaults.numHumans = 2;

const h1 = new Human('player_1');
const h2 = new Human('player_2');
var g = new Game(h1, defaults);

g.addPlayer(h2);

g.begin();

var p1 = g.getParticipant(h1);
var p2 = g.getParticipant(h2);

/*
console.log(p1.canAfford({ wheat: 4 }));
console.log(p1.hand)
console.log(p1.canBuild('devCard'));

console.log(g.graph.INITIAL_VERTEX);
*/

show();

console.log(g.getCurrentParticipant().do('_e_take_turn', {}));

show();

console.log(g.getCurrentParticipant().do('_e_init_settle', { junc: 7 }));

show();

//console.log(print(g.board));
