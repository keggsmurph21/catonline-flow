'use strict';

const _ = require('underscore');
const Game = require('../lib/core/game').Game;
const defaults = require('../lib/core/game').defaults;
const Human = require('../lib/core/player').Human;

function createGame(numHumans) {

  defaults.numHumans = numHumans;

  const owner = new Human('owner');
  const game = new Game(owner, defaults);

  for (let i = 1; i < numHumans; i++) {

    const name = 'player_' + (i+1);
    const human = new Human(name);
    game.addPlayer(human);

  }

  game.begin();

  return game;

}

function checkInitialGraph(g) {
  g.participants.forEach(p => {

    expect(p.vertex.name).toBe('_v_end_turn');

    const edges = p.getEdges().map(edge => edge.name);

    if (p.isCurrentPlayer()) {
      expect(edges.length).toBe(1);
      expect(edges).toEqual([ '_e_take_turn' ]);
    } else {
      expect(edges.length).toBe(0);
      expect(edges).toEqual([]);
    }

  });
}

test('creating a game should place people at the beginning spot', () => {

  checkInitialGraph(createGame(1));
  checkInitialGraph(createGame(2));
  checkInitialGraph(createGame(3));
  checkInitialGraph(createGame(4));

});
