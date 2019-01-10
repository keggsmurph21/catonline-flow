'use strict';

const _ = require('underscore');
const Game = require('./lib/core/game').Game;
const params = require('./lib/core/game').defaults;

function view(game) {
  //console.log(game.dice);
  //console.log(game.deck);
  console.log(game.board.hexes[31])
  //console.log(_.pick(game.board.hexes[31], ['id', 'dice', 'isOcean', 'resource', 'resources' ]));
}

const g = new Game(params);
//view(g);
g.randomize();
//view(g);

//console.log(g.board.serialize().hexes)
console.log(g.board.ports);
