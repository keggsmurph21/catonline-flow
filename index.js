'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const defaults = require('./lib/core/game').defaults;
const Human = require('./lib/core/player').Human;
const { print } = require('./lib/utils');

function show() {
  g.participants.forEach(p => {
    console.log(p.getEdges().map(e => e.name))
  });
  console.log()
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

show();

console.log(g.getCurrentParticipant().do('_e_take_turn'));

show();

console.log(g.getCurrentParticipant().do('_e_init_settle', '22'));

show();

console.log(g.getCurrentParticipant().do('_e_init_build_road', '26'));

show();

console.log(g.currentParticipantID)
console.log(g.getCurrentParticipant().do('_e_end_init'));
console.log(g.currentParticipantID)
show();

console.log()
*/

g = (numHumans => {

  const g = new Game(new Human('owner'), { ...defaults, numHumans });

  for (let i = 1; i < numHumans; i++) {
    g.addPlayer(new Human(i));
  }

  g.begin();
  return g;

})(4);

const gp = g.participants.slice();
let ret;

gp[0].do('_e_take_turn', {});
gp[0].do('_e_init_settle', '22');
gp[0].do('_e_init_build_road', '26');
gp[0].do('_e_end_init', {});
show();
gp[1].do('_e_take_turn', {});
gp[1].do('_e_init_settle', '7');
gp[1].do('_e_init_build_road', '14');
gp[1].do('_e_end_init', {});
show();
gp[2].do('_e_take_turn', {});
gp[2].do('_e_init_settle', '24');
gp[2].do('_e_init_build_road', '34');
gp[2].do('_e_end_init', {});
show();
gp[3].do('_e_take_turn', {});
gp[3].do('_e_init_settle', '30');
gp[3].do('_e_init_build_road', '37');
gp[3].do('_e_end_init', {});
show();
//gp[3].do('_e_take_turn', {});
gp[3].do('_e_init_settle', '16');
gp[3].do('_e_init2_build_road', '32');
gp[3].do('_e_end_init', {})
show();
gp[2].do('_e_take_turn', {});
gp[2].do('_e_init_settle', '37');
gp[2].do('_e_init2_build_road', '47');
gp[2].do('_e_end_init', {})
show();
gp[1].do('_e_take_turn', {});
gp[1].do('_e_init_settle', '35');
gp[1].do('_e_init2_build_road', '44');
gp[1].do('_e_end_init', {})
show();
gp[0].do('_e_take_turn', {});
gp[0].do('_e_init_settle', '46');
gp[0].do('_e_init2_build_road', '60');
gp[0].do('_e_end_init', {})
show();
ret = gp[0].do('_e_roll', '7');
console.log(ret);
show();
gp[0].do('_e_roll_move_robber', '5');
show();

console.log(g.serialize());

//console.log(print(g.board));
