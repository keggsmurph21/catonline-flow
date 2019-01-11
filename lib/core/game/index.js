'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.Game = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  function Game(owner, params) {
    _classCallCheck(this, Game);

    this.params = (0, _params.validate)(params); // might throw

    var scenario = this.params.scenario;

    this.board = new _board.Board(scenario);
    this.deck = new _devCardDeck.DevCardDeck(scenario);
    this.dice = new _dice.Dice();

    this.owner = owner;
    this.players = [];

    this.isRandomized = false;

    this.addPlayer(owner);

    this.createdAt = new Date();
    this.modify();
  }

  _createClass(Game, [{
    key: 'modify',
    value: function modify() {
      this.modifiedAt = new Date();
    }
  }, {
    key: 'randomize',
    value: function randomize() {

      if (!this.isFull()) throw new _utils.CatonlineError('cannot randomize game until all players have joined');

      (0, _utils.shuffle)(this.players);
      this.board.randomize(this.params);
      this.deck.shuffle();

      this.isRandomized = true;
      this.modify();
    }
  }, {
    key: 'serialize',
    value: function serialize() {

      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'isOwner',
    value: function isOwner(player) {
      return this.owner.equals(player);
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

      if (!(player instanceof _player.Player)) throw new _utils.CatonlineError('cannot add player of type "' + (typeof player === 'undefined' ? 'undefined' : _typeof(player)) + '"');

      if (this.hasPlayer(player)) throw new _utils.CatonlineError('this player has already joined');

      if (this.isRandomized) throw new _utils.CatonlineError('cannot add players after game has been randomized');

      if (this.isFull()) throw new _utils.CatonlineError('all players have already joined');

      if (this.isFullOfHumans()) throw new _utils.CatonlineError('all human players have already joined');

      this.players.push(player);
      this.modify();
    }
  }, {
    key: 'removePlayer',
    value: function removePlayer(player) {

      if (!(player instanceof _player.Player)) throw new _utils.CatonlineError('cannot add player of type "' + (typeof player === 'undefined' ? 'undefined' : _typeof(player)) + '"');

      if (!this.hasPlayer(player)) throw new _utils.CatonlineError('this player is not in this game');

      if (this.isRandomized) throw new _utils.CatonlineError('cannot remove players after game has been randomized');

      if (this.isOwner(player)) throw new _utils.CatonlineError('the owner cannot leave the game');

      var i = this.players.indexOf(player);
      this.players.splice(i, 1);
      this.modify();
    }
  }, {
    key: 'isFull',
    value: function isFull() {
      return this.isFullOfHumans() && this.isFullOfComputers();
    }
  }, {
    key: 'getNumHumans',
    value: function getNumHumans() {
      return this.players.filter(function (p) {
        return p.type === 'Human';
      }).length;
    }
  }, {
    key: 'isFullOfHumans',
    value: function isFullOfHumans() {
      return this.params.numHumans === this.getNumHumans();
    }
  }, {
    key: 'getNumComputers',
    value: function getNumComputers() {
      return this.players.filter(function (p) {
        return p.type === 'Computer';
      }).length;
    }
  }, {
    key: 'isFullOfComputers',
    value: function isFullOfComputers() {
      return this.params.numComputers === this.getNumComputers();
    }
  }]);

  return Game;
}();