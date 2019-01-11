'use strict';

const _ = require('underscore');
const Game = require('../lib/core/game').Game;
const defaults = require('../lib/core/game').defaults;
const InvalidGameParamsError = require('../lib/utils').InvalidGameParamsError;
const Human = require('../lib/core/player').Human;

test('should initialize with the default params', () => {

  expect(() => new Game(defaults)).not.toThrow();

});

test('should throw errors when initializing with invalid params', () => {

  function defaultsLessOneParam(name) {
    let params = Object.assign({}, defaults);
    delete params[name];
    return params;
  }

  _.each(defaults, (value, name) => {

    const params = defaultsLessOneParam(name);
    const err = /^Invalid game parameter value for "\w*": expected type "\w*" got "undefined"$/;

    expect(() => new Game(params)).toThrow(err);

  });

  function defaultsChangeOneParam(name, value) {
    let params = Object.assign({}, defaults);
    params[name] = value;
    return params;
  }

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, 'test');
    const err = /^Invalid game parameter value for "\w*": expected (type "\w*" got "string"|one of .* got "test")$/;

    expect(() => new Game(params)).toThrow(err);

  });

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, -Infinity);
    const err = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"-Infinity" less than minimum "\d+")$/;

    expect(() => new Game(params)).toThrow(err);

  });

  _.each(defaults, (value, name) => {

    const params = defaultsChangeOneParam(name, Infinity);
    const err = /^Invalid game parameter value for "\w*": (expected type "\w*" got "number"|"Infinity" greater than maximum "\d+")$/;

    expect(() => new Game(params)).toThrow(err);

  });

});

test('player management', () => {

  const g = new Game(defaults);
  const players = [0,1,2,3,4].map(i => new Human(i));

  expect(g.players.length).toBe(0);

  players.forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  g.addPlayer(players[0]);

  expect(g.hasPlayer(players[0])).toBe(true);
  players.slice(1,4).forEach(player => {
    expect(g.hasPlayer(player)).toBe(false);
  });

  g.addPlayer(players[0]);

});
