'use strict';

const _ = require('underscore');
const Game = require('../lib/core/game').Game;
const defaults = require('../lib/core/game').defaults;
const {

  CatonlineError,
  InvalidGameParamsError,
  expectToThrow,

} = require('../lib/utils');
const Human = require('../lib/core/player').Human;
const h = new Human('test');

test('should initialize with the default params', () => {

  expect(() => new Game(h, defaults)).not.toThrow();

});

test('should throw errors when initializing with invalid params', () => {

  function defaultsLessOneParam(name) {
    let params = Object.assign({}, defaults);
    delete params[name];
    return params;
  }

  _.each(defaults, (value, name) => {

    const params = defaultsLessOneParam(name);
    const message = /^Invalid game parameter value for "\w*": expected type "\w*" got "undefined"$/;

    expectToThrow(() => new Game(h, params), { name: 'InvalidGameParamsError', message });

  });

  function defaultsChangeOneParam(name, value) {
    let params = Object.assign({}, defaults);
    params[name] = value;
    return params;
  }

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, 'test');
    const message = /^Invalid game parameter value for "\w*": expected (type "\w*" got "string"|one of .* got "test")$/;

    expectToThrow(() => new Game(h, params), { name: 'InvalidGameParamsError', message });

  });

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, -Infinity);
    const message = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"-Infinity" less than minimum "\d+")$/;

    expectToThrow(() => new Game(h, params), { name: 'InvalidGameParamsError', message });

  });

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, Infinity);
    const message = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"Infinity" greater than maximum "\d+")$/;

    expectToThrow(() => new Game(h, params), { name: 'InvalidGameParamsError', message });

  });

});

test('player management', () => {

  const g = new Game(h, defaults);
  const players = [0,1,2,3,4].map(i => new Human(i));

  expect(g.players.length).toBe(1);
  expect(g.owner.equals(h)).toBe(true);

  players.forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  expectToThrow(() => g.addPlayer(), { name: 'CatonlineError', message: /type "undefined"/ });

  g.addPlayer(players[0]);
  expect(g.players.length).toBe(2);

  players.slice(0,1).forEach(player => {
    expect(g.hasPlayer(player)).toBe(true);
  });
  players.slice(1,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  expectToThrow(() => g.addPlayer(players[0]), { name: 'CatonlineError', message: /this player has already joined/});

  g.addPlayer(players[1]);
  expect(g.players.length).toBe(3);

  players.slice(0,2).forEach(player => {
    expect(g.hasPlayer(player)).toBe(true);
  });
  players.slice(2,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  g.addPlayer(players[2]);
  expect(g.players.length).toBe(4);

  players.slice(0,3).forEach(player => {
    expect(g.hasPlayer(player)).toBe(true);
  });
  players.slice(3,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  expect(g.isFull()).toBe(true);

  expectToThrow(() => g.addPlayer(players[3]), { name: 'CatonlineError', message: /joined/ });
  expectToThrow(() => g.addPlayer(players[4]), { name: 'CatonlineError', message: /joined/ });

  expectToThrow(() => g.removePlayer(), { name: 'CatonlineError', message: /type "undefined"/ });

  expectToThrow(() => g.removePlayer(players[3]), { name: 'CatonlineError', message: /player is not in/ });
  expectToThrow(() => g.removePlayer(players[4]), { name: 'CatonlineError', message: /player is not in/ });

  expect(g.players.length).toBe(4);
  g.removePlayer(players[2]);
  expect(g.players.length).toBe(3);

  players.slice(0,2).forEach(player => {
    expect(g.hasPlayer(player)).toBe(true);
  });
  players.slice(2,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  g.removePlayer(players[1]);
  expect(g.players.length).toBe(2);

  players.slice(0,1).forEach(player => {
    expect(g.hasPlayer(player)).toBe(true);
  });
  players.slice(1,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  g.removePlayer(players[0]);
  expect(g.players.length).toBe(1);

  players.forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  expectToThrow(() => g.removePlayer(h), { name: 'CatonlineError', message: /owner/ });

  expect(g.players.length).toBe(1);
  
});
