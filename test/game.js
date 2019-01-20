'use strict';

const _ = require('underscore');
const expect = require('chai').expect;
const Game = require('../lib/core/game').Game;
const defaults = require('../lib/core/game').defaults;
const {

  CatonlineError,
  InvalidGameParamsError,

} = require('../lib/utils');
const Human = require('../lib/core/player').Human;
const h = new Human('test');

function checkGame(g) {

  expect(g.isRandomized).to.equal(true);

  // test the robber

  const robberHex = g.board.hexes[g.board.robber.location];
  expect(robberHex.resource.name).to.equal('desert');

  // test the hexes

  const resourcesSeen = {};
  _.each(g.board.hexes, hex => {

    if (!resourcesSeen[hex.resource.name])
      resourcesSeen[hex.resource.name] = 0;

    resourcesSeen[hex.resource.name] += 1;

  });

  _.each(resourcesSeen, (count, name) => {
    expect(g.board.scenario.resources[name]).to.equal(count);
  });

}

describe('Game', () => {

  it('should initialize with the default params', () => {

    expect(() => new Game(h, defaults)).to.not.throw();

  });

  it('should initialize to the correct state', () => {

    let g;
    const [p1, p2, p3, p4] = [1,2,3,4].map(num => new Human('player_' + num));

    g = new Game(h, { ...defaults, numHumans: 1 });
    g.begin();
    checkGame(g);

    g = new Game(h, { ...defaults, numHumans: 2 });
    g.addPlayer(p1);
    g.begin();
    checkGame(g);

    g = new Game(h, { ...defaults, numHumans: 3 });
    g.addPlayer(p1);
    g.addPlayer(p2);
    g.begin();
    checkGame(g);

    g = new Game(h, { ...defaults, numHumans: 4 });
    g.addPlayer(p1);
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.begin();
    checkGame(g);

    g = new Game(h, { ...defaults, numHumans: 5 });
    g.addPlayer(p1);
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.addPlayer(p4);
    g.begin();
    checkGame(g);

  });

  it('should test for equality', () => {

    const g1 = new Game(h, { ...defaults, numHumans: 1 });
    g1.begin();

    const g2 = new Game(h, { ...defaults, numHumans: 1 });
    g2.begin();

    const g3 = new Game(h, { ...defaults, numHumans: 1, vpGoal: 11 });
    g3.begin();

    // in general two games won't be the same unless we miraculously happen to
    //   plop out the same board & dev cards & such

    expect(g1.equals(g1)).to.equal(true);
    expect(g1.equals(g2)).to.equal(false);
    expect(g1.equals(g3)).to.equal(false);

    expect(g2.equals(g1)).to.equal(false);
    expect(g2.equals(g2)).to.equal(true);
    expect(g2.equals(g3)).to.equal(false);

    expect(g3.equals(g1)).to.equal(false);
    expect(g3.equals(g2)).to.equal(false);
    expect(g3.equals(g3)).to.equal(true);

  });

  it('should throw errors when initializing with invalid params', () => {

    function defaultsLessOneParam(name) {
      let params = Object.assign({}, defaults);
      delete params[name];
      return params;
    }

    _.each(defaults, (value, name) => {

      const params = defaultsLessOneParam(name);
      const message = /^Invalid game parameter value for "\w*": expected type "\w*" got "undefined"$/;

      //new Game(h, params);
      expect(() => new Game(h, params)).to.throw(/*InvalidGameParamsError, */message);

    });

    function defaultsChangeOneParam(name, value) {
      let params = Object.assign({}, defaults);
      params[name] = value;
      return params;
    }

    _.each(defaults, (value, name) => {

      const params = defaultsChangeOneParam(name, 'test');
      const message = /^Invalid game parameter value for "\w*": expected (type "\w*" got "string"|one of .* got "test")$/;

      expect(() => new Game(h, params)).to.throw(/*InvalidGameParamsError, */message);

    });

    _.each(defaults, (value, name) => {

      const params = defaultsChangeOneParam(name, -Infinity);
      const message = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"-Infinity" less than minimum "\d+")$/;

      expect(() => new Game(h, params)).to.throw(/*InvalidGameParamsError, */message);

    });

    _.each(defaults, (value, name) => {

      const params = defaultsChangeOneParam(name, Infinity);
      const message = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"Infinity" greater than maximum "\d+")$/;

      expect(() => new Game(h, params)).to.throw(/*InvalidGameParamsError, */message);

    });

  });

  it('player management', () => {

    const g = new Game(h, defaults);
    const players = [0,1,2,3,4].map(i => new Human(i));

    expect(g.participants.length).to.equal(1);
    expect(g.owner.equals(h)).to.equal(true);

    players.forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    expect(() => g.addPlayer()).to.throw(/*CatonlineError, *//type "undefined"/);

    g.addPlayer(players[0]);
    expect(g.participants.length).to.equal(2);

    players.slice(0,1).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(true);
    });
    players.slice(1,4).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    expect(() => g.addPlayer(players[0])).to.throw(/*CatonlineError, *//this player has already joined/);

    g.addPlayer(players[1]);
    expect(g.participants.length).to.equal(3);

    players.slice(0,2).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(true);
    });
    players.slice(2,4).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    g.addPlayer(players[2]);
    expect(g.participants.length).to.equal(4);

    players.slice(0,3).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(true);
    });
    players.slice(3,4).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    expect(g.isFull()).to.equal(true);

    expect(() => g.addPlayer(players[3])).to.throw(/*CatonlineError, *//joined/);
    expect(() => g.addPlayer(players[4])).to.throw(/*CatonlineError, *//joined/);

    expect(() => g.removePlayer()).to.throw(/*CatonlineError, *//type "undefined"/);

    expect(() => g.removePlayer(players[3])).to.throw(/*CatonlineError, *//player is not in/);
    expect(() => g.removePlayer(players[4])).to.throw(/*CatonlineError, *//player is not in/);

    expect(g.participants.length).to.equal(4);
    g.removePlayer(players[2]);
    expect(g.participants.length).to.equal(3);

    players.slice(0,2).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(true);
    });
    players.slice(2,4).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    g.removePlayer(players[1]);
    expect(g.participants.length).to.equal(2);

    players.slice(0,1).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(true);
    });
    players.slice(1,4).forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    g.removePlayer(players[0]);
    expect(g.participants.length).to.equal(1);

    players.forEach(player => {
      expect(g.hasPlayer(player)).to.equal(false);
    });

    expect(() => g.removePlayer(h)).to.throw(/*CatonlineError, *//owner/);

    expect(g.participants.length).to.equal(1);

  });

  it('initialize from initial conditions', () => {

    const original = new Game(h, { ...defaults, numHumans: 1 });
    original.begin();

    const originalConds = original.getInitialConditions();
    const originalOwner = original.owner;
    const originalPlayers = {
      [h.id]: h,
    };

    expect(() => Game.initialize(originalConds, originalOwner, originalPlayers)).to.not.throw();

    const copy = Game.initialize(originalConds, originalOwner, originalPlayers);

    expect(original.equals(original)).to.equal(true);
    expect(original.equals(copy)).to.equal(true);

  });

});
