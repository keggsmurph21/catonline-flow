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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //  strict

//import { State } from './state';


var Game = exports.Game = function (_Emitter) {
  _inherits(Game, _Emitter);

  // tradeAccepted: boolean; // do i need this?
  function Game(owner, params) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

    _this.params = (0, _params.validate)(params); // might throw

    var scenario = _scenarios.scenarios[_this.params.scenario];

    _this.graph = new _graph.Graph(_this);
    _this.board = new _board.Board(scenario);
    _this.deck = new _devCardDeck.DevCardDeck(scenario);
    _this.dice = new _dice.Dice();
    _this.bank = new _bank.Bank();

    _this.owner = owner;
    _this.participants = [];

    _this.isRandomized = false;

    _this.addPlayer(owner);

    //this.state = new State(this);
    _this.history = new _history.History();

    _this.createdAt = new Date();
    _this.modify();

    return _this;
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
    key: 'getWaiting',
    value: function getWaiting() {

      var waiting = [];
      this.participants.forEach(function (participant) {

        if (participant.getEdges().length) waiting.push(participant);
      });

      return waiting;
    }
  }, {
    key: 'mutate',
    value: function mutate(participant, name, rawArgs) {

      try {

        var edge = this.graph.getEdge(name);
        var args = edge.validateArgs(this, rawArgs);
        var result = edge.execute(this, participant, args);

        this.history.store({ participant: participant, edge: edge, args: args, result: result });

        var target = this.graph.getVertex(edge.target);
        participant.vertex = target;

        this.modify();

        return true;
      } catch (e) {

        if (e instanceof _utils.CatonlineError) return false;

        throw e;
      }
    }
  }, {
    key: 'mutateBatch',
    value: function mutateBatch() {}
  }, {
    key: 'iterateTurn',
    value: function iterateTurn() {

      var cpid = this.currentParticipantID;

      if (this.isFirstTurn()) {

        cpid += 1;
        if (cpid === this.participants.length) cpid -= 1;
      } else if (this.isSecondTurn()) {

        cpid -= 1;
        if (cpid === 0) cpid += 1;
      } else {

        cpid += 1;
        cpid %= this.participants.length;
      }

      this.currentParticipantID = cpid;

      this.turn++;
      this.hasRolled = false;

      this.participants.forEach(function (participant) {
        participant.resetDevCards();
      });
    }
  }, {
    key: 'settle',
    value: function settle(participant, choice) {
      var isFree = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


      if (choice.owner === participant) throw new _utils.EdgeExecutionError('You have already settled here');

      if (!!choice.owner) throw new _utils.EdgeExecutionError('Someone has already settled here');

      if (!choice.isSettleable) throw new _utils.EdgeExecutionError('You can\'t settle next an existing settlement');

      if (!isFree) {
        var cost = this.board.scenario.buyable.settlement.cost;
        participant.spend(cost);
      }

      participant.settlements.push(choice);
      choice.owner = participant;
      choice.isSettleable = false;
      choice.getNeighbors().forEach(function (junc) {
        junc.isSettleable = false;
      });

      this.updateLongestRoad();
      this.isOver();

      if (choice.port != null) {

        var bankTradeRate = Object.assign({}, participant.bankTradeRate);
        var type = choice.port.type;

        if (type === 'mystery') {
          _underscore2.default.each(bankTradeRate, function (rate, resource) {
            if (3 < rate) {
              bankTradeRate[resource] = rate;
            }
          });
        } else {
          if (2 < bankTradeRate[type]) {
            bankTradeRate[type] = 2;
          }
        }

        participant.bankTradeRate = bankTradeRate;
      }
    }
  }, {
    key: 'initPave',
    value: function initPave(participant, choice) {

      if (choice.owner === participant) throw new _utils.EdgeExecutionError('You have already built a road here');

      if (!!choice.owner) throw new _utils.EdgeExecutionError('Someone has already built a road here');

      var lastSettlement = participant.settlements.slice(-1)[0];

      var isValid = false;
      _underscore2.default.each(lastSettlement.roads, function (road) {
        if (road === choice) isValid = true;
      });

      if (!isValid) throw new _utils.EdgeExecutionError('You must build a road next to your last settlement');

      this._pave(participant, choice, true);
    }
  }, {
    key: '_pave',
    value: function _pave(participant, choice) {
      var isFree = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


      if (!isFree) {
        var cost = this.board.scenario.buyable.road.cost;
        participant.spend(cost);
      }

      participant.roads.push(choice);
      choice.owner = participant;

      this.updateLongestRoad();
      this.isOver();
    }
  }, {
    key: 'updateLongestRoad',
    value: function updateLongestRoad() {
      //console.log(new CatonlineError('not implemented')); // $TODO
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

      _underscore2.default.each(thisConds.board.ports, function (portType, i) {
        equal = equal && portType === thatConds.board.ports[i];
      });

      _underscore2.default.each(thatConds.board.ports, function (portType, i) {
        equal = equal && portType === thisConds.board.ports[i];
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
        return 'in-progress';
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
  }, {
    key: 'isFirstTurn',
    value: function isFirstTurn() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot calculate isFirstTurn() until game is randomized');

      return Math.floor((this.turn - 1) / this.participants.length) === 0;
    }
  }, {
    key: 'isSecondTurn',
    value: function isSecondTurn() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot calculate isFirstTurn() until game is randomized');

      return Math.floor((this.turn - 1) / this.participants.length) === 1;
    }
  }, {
    key: 'isRollSeven',
    value: function isRollSeven() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot calculate isRollSeven() until game is randomized');

      return this.dice.getTotal() === 7;
    }
  }, {
    key: 'isOver',
    value: function isOver() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot calculate isOver() until game is randomized');

      //console.log(new CatonlineError('not implemented')); // $TODO
      return false;
    }
  }, {
    key: 'end',
    value: function end() {
      throw new _utils.CatonlineError('not implemented');
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
        game.board.hexes[i].resource = new _resource.Resource(hex.resource);
        game.board.hexes[i].dice = new _diceValue.DiceValue(hex.dice);
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
}(_events2.default);