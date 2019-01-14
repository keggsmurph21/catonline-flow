'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.Game = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
//import { State } from './state';


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

var _history = require('./history');

var _bank = require('./bank');

var _participant = require('./participant');

var _resource = require('../board/resource');

var _diceValue = require('../board/dice-value');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = exports.Game = function () {
  // tradeAccepted: boolean; // do i need this?
  function Game(owner, params) {
    _classCallCheck(this, Game);

    this.params = (0, _params.validate)(params); // might throw

    var scenario = _scenarios.scenarios[this.params.scenario];

    this.graph = new _graph.Graph(this);
    this.board = new _board.Board(scenario);
    this.deck = new _devCardDeck.DevCardDeck(scenario);
    this.dice = new _dice.Dice();
    this.bank = new _bank.Bank();

    this.owner = owner;
    this.participants = [];

    this.isRandomized = false;

    this.addPlayer(owner);

    //this.state = new State(this);
    this.history = new _history.History();

    this.createdAt = new Date();
    this.modify();
  }
  // waiting: Participant[]; // do i need this?


  _createClass(Game, [{
    key: 'modify',
    value: function modify() {
      this.modifiedAt = new Date();
    }
  }, {
    key: 'begin',
    value: function begin() {

      if (!this.isFull()) throw new _utils.CatonlineError('cannot begin a game until all participants have joined');

      this.fillWithComputers();
      this.randomize();

      this.turn = 1;
      // this.waiting = Participant[]; // do i need this?
      this.canSteal = false;
      // this.tradeAccepted = boolean; // do i need this?
      this.currentTrade = null;
      this.currentParticipantID = 0;
      this.hasRolled = false;

      this.largestArmy = 2;
      this.hasLargestArmy = null;
      this.longestRoad = 4;
      this.hasLongestRoad = null;

      this.modify();
    }
  }, {
    key: 'randomize',
    value: function randomize() {

      if (this.isRandomized) throw new _utils.CatonlineError('game has already been randomized');

      if (!this.isFull()) throw new _utils.CatonlineError('cannot randomize game until all participants have joined');

      (0, _utils.shuffle)(this.participants);
      this.board.randomize(this.params);
      this.deck.shuffle();

      this.isRandomized = true;
      this.initialConditions = this.getInitialConditions();

      this.modify();
    }
  }, {
    key: 'equals',
    value: function equals(game) {

      if (!(game instanceof Game)) throw new _utils.CatonlineError('cannot compare game to object of type "' + (typeof game === 'undefined' ? 'undefined' : _typeof(game)) + '"');

      if (!this.isRandomized || !game.isRandomized) throw new _utils.CatonlineError('can only compare games that are randomized');

      var thisConds = this.getInitialConditions();
      var thatConds = game.getInitialConditions();

      var equal = true;

      _underscore2.default.each(thisConds.board.hexes, function (hex, i) {
        equal = equal && (0, _utils.objectsMatch)(hex, thatConds.board.hexes[i]);
      });

      _underscore2.default.each(thatConds.board.hexes, function (hex, i) {
        equal = equal && (0, _utils.objectsMatch)(hex, thisConds.board.hexes[i]);
      });

      _underscore2.default.each(thisConds.board.ports, function (port, i) {
        equal = equal && port === thatConds.board.ports[i];
      });

      _underscore2.default.each(thatConds.board.ports, function (port, i) {
        equal = equal && port === thisConds.board.ports[i];
      });

      return equal && (0, _utils.objectsMatch)(thisConds.params, thatConds.params) && (0, _utils.objectsMatch)(thisConds.players, thatConds.players) && (0, _utils.objectsMatch)(thisConds.deck, thatConds.deck);
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'getInitialConditions',
    value: function getInitialConditions() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot get initial conditions for non-randomized game');

      return {
        params: this.params,
        players: this.participants.map(function (participant) {
          return participant.player.id;
        }),
        board: {
          hexes: _underscore2.default.mapObject(this.board.hexes, function (hex) {
            return {
              resource: hex.resource.name,
              dice: hex.dice.value
            };
          }),
          ports: _underscore2.default.mapObject(this.board.ports, function (port) {
            return port.type;
          })
        },
        deck: this.deck.cards.map(function (card) {
          return card.type;
        })
      };
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      if (this.isRandomized) {
        return 'in-progess';
      } else if (this.isFull()) {
        return 'ready';
      } else {
        return 'pending';
      }
    }
  }, {
    key: 'isOwner',
    value: function isOwner(player) {
      return this.owner.equals(player);
    }
  }, {
    key: 'getCurrentParticipant',
    value: function getCurrentParticipant() {
      return this.participants[this.currentParticipantID];
    }
  }, {
    key: 'getParticipant',
    value: function getParticipant(player) {

      if (!this.hasPlayer(player)) throw new _utils.CatonlineError('player "' + player.id + '" not in game');

      for (var i = 0; i < this.participants.length; i++) {

        if (this.participants[i].player.equals(player)) return this.participants[i];
      }

      throw new _utils.CatonlineError('unable to get state for player "' + player.id + '"');
    }
  }, {
    key: 'hasPlayer',
    value: function hasPlayer(player) {

      for (var i = 0; i < this.participants.length; i++) {
        if (this.participants[i].player.equals(player)) return true;
      }

      return false;
    }
  }, {
    key: 'addPlayer',
    value: function addPlayer(player) {

      if (!(player instanceof _player.Player)) throw new _utils.CatonlineError('cannot add player of type "' + (typeof player === 'undefined' ? 'undefined' : _typeof(player)) + '"');

      if (this.hasPlayer(player)) throw new _utils.CatonlineError('this player has already joined');

      if (this.isRandomized) throw new _utils.CatonlineError('cannot add participants after game has been randomized');

      if (this.isFull()) throw new _utils.CatonlineError('all participants have already joined');

      var participant = new _participant.Participant(this, player);
      this.participants.push(participant);
      this.modify();
    }
  }, {
    key: 'removePlayer',
    value: function removePlayer(player) {

      if (!(player instanceof _player.Player)) throw new _utils.CatonlineError('cannot add player of type "' + (typeof player === 'undefined' ? 'undefined' : _typeof(player)) + '"');

      if (!this.hasPlayer(player)) throw new _utils.CatonlineError('this player is not in this game');

      if (this.isRandomized) throw new _utils.CatonlineError('cannot remove participants after game has been randomized');

      if (this.isOwner(player)) throw new _utils.CatonlineError('the owner cannot leave the game');

      var i = this.participants.indexOf(player);
      this.participants.splice(i, 1);
      this.modify();
    }
  }, {
    key: 'isFull',
    value: function isFull() {
      return this.params.numHumans === this.getNumHumans();
    }
  }, {
    key: 'fillWithComputers',
    value: function fillWithComputers() {
      for (var i = 0; i < this.params.numComputers; i++) {
        var cpu = new _player.Computer('CPU_' + (i + 1));
        this.addPlayer(cpu);
      }
    }
  }, {
    key: 'getNumHumans',
    value: function getNumHumans() {
      return this.participants.filter(function (p) {
        return p.isHuman();
      }).length;
    }
  }, {
    key: 'getNumComputers',
    value: function getNumComputers() {
      return this.participants.filter(function (p) {
        return !p.isHuman();
      }).length;
    }
  }], [{
    key: 'initialize',
    value: function initialize(conds, owner, players) {

      // make params the same
      var game = new Game(owner, conds.params);
      var scenario = _scenarios.scenarios[conds.params.scenario];

      // add all the players
      conds.players.forEach(function (id) {

        var player = players[id];
        if (!player) throw new _utils.CatonlineError('cannot find player with id "' + id + '"');

        if (!game.isOwner(player)) game.addPlayer(player);
      });

      // do an independent randomization for the new game
      game.begin();

      // overwrite the participant order
      game.participants = conds.players.map(function (id) {

        var player = players[id];
        var participant = game.getParticipant(player);
        return participant;
      });

      // overwrite the board hex values
      _underscore2.default.each(conds.board.hexes, function (hex, i) {
        //console.log(hex);
        game.board.hexes[i].resource = new _resource.Resource(hex.resource);
        game.board.hexes[i].dice = new _diceValue.DiceValue(hex.dice);
        //console.log(game.board.hexes[i].dice);
        // TODO: overwrite dots
      });

      // overwrite the board port values
      _underscore2.default.each(conds.board.ports, function (port, i) {
        game.board.ports[i].type = port;
      });

      // overwrite the deck
      game.deck.setCards(scenario, conds.deck);

      return game;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return Game;
}();