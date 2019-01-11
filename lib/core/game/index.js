'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _params = require('./params');

Object.defineProperty(exports, 'defaults', {
  enumerable: true,
  get: function get() {
    return _params.defaults;
  }
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _board = require('../board');

var _player = require('../player');

var _graph = require('../graph');

var _scenarios = require('../scenarios');

var _devCardDeck = require('./dev-card-deck');

var _dice = require('./dice');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = exports.Game = function () {
  function Game(params) {
    _classCallCheck(this, Game);

    this.params = (0, _params.validate)(params); // might throw

    var scenario = this.params.scenario;

    this.board = new _board.Board(scenario);
    this.deck = new _devCardDeck.DevCardDeck(scenario);
    this.dice = new _dice.Dice();
    this.players = [];
  }

  _createClass(Game, [{
    key: 'randomize',
    value: function randomize() {

      if (!this.isFull()) throw new _utils.CatonlineError('cannot randomize game until all players have joined');

      (0, _utils.shuffle)(this.players);
      this.board.randomize(this.params);
      this.deck.shuffle();
    }
  }, {
    key: 'serialize',
    value: function serialize() {

      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'hasPlayer',
    value: function hasPlayer(player) {

      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].equals(player)) return true;
      }

      return false;
    }
  }, {
    key: 'addPlayer',
    value: function addPlayer(player) {

      if (this.isFull()) throw new _utils.CatonlineError('all players have already joined');
    }
  }, {
    key: 'removePlayer',
    value: function removePlayer(player) {}
  }, {
    key: 'isFull',
    value: function isFull() {
      return this.params.numHumans + this.params.numComputers === this.players.length;
    }
  }]);

  return Game;
}();