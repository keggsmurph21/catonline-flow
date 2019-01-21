'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const defaults = require('./lib/core/game').defaults;
const Human = require('./lib/core/player').Human;
const { print } = require('./lib/utils');

function show() {
  console.log([
    g.graph.getAdjacents(p1).map(e => e.name),
    g.graph.getAdjacents(p2).map(e => e.name)
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

console.log(g.getCurrentParticipant().do('_e_init_settle', { junc: 22 }));

show();

console.log(g.getCurrentParticipant().do('_e_init_build_road', { road: 26 }));

show();

console.log(g.currentParticipantID)
console.log(g.getCurrentParticipant().do('_e_end_init', {}));
console.log(g.currentParticipantID)
show();

console.log()

g = (numHumans => {

  const g = new Game(new Human('owner'), { ...defaults, numHumans });

  for (let i = 1; i < numHumans; i++) {
    g.addPlayer(new Human(i));
  }

  g.begin();
  return g;

})(4);

g.getCurrentParticipant().do('_e_take_turn', {});
g.getCurrentParticipant().do('_e_init_settle', { junc: 22 });
g.getCurrentParticipant().do('_e_init_build_road', { road: 26 });
g.getCurrentParticipant().do('_e_end_init', {});

g.participants.forEach(p => {
  console.log(p.getEdges().map(e => e.name))
});
console.log();

g.getCurrentParticipant().do('_e_take_turn', {});
g.getCurrentParticipant().do('_e_init_settle', { junc: 10 });
g.getCurrentParticipant().do('_e_init_build_road', { road: 12 });
g.getCurrentParticipant().do('_e_end_init', {});

g.participants.forEach(p => {
  console.log(p.getEdges().map(e => e.name))
});
console.log();

g.getCurrentParticipant().do('_e_take_turn', {});
g.getCurrentParticipant().do('_e_init_settle', { junc: 0 });
g.getCurrentParticipant().do('_e_init_build_road', { road: 0 });
g.getCurrentParticipant().do('_e_end_init', {});

g.participants.forEach(p => {
  console.log(p.getEdges().map(e => e.name))
});
console.log();

g.getCurrentParticipant().do('_e_take_turn', {});
g.getCurrentParticipant().do('_e_init_settle', { junc: 30 });
g.getCurrentParticipant().do('_e_init_build_road', { road: 37 });
g.getCurrentParticipant().do('_e_end_init', {});

g.participants.forEach(p => {
  console.log(p.getEdges().map(e => e.name))
});
console.log();
