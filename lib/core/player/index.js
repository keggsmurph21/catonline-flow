'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _player = require('./player');

Object.defineProperty(exports, 'Player', {
  enumerable: true,
  get: function get() {
    return _player.Player;
  }
});

var _computer = require('./computer');

Object.defineProperty(exports, 'Computer', {
  enumerable: true,
  get: function get() {
    return _computer.Computer;
  }
});

var _human = require('./human');

Object.defineProperty(exports, 'Human', {
  enumerable: true,
  get: function get() {
    return _human.Human;
  }
});