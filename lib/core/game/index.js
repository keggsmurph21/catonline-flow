'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = exports.Game = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //  strict

//import { State } from './state';


var Game = exports.Game = function (_Emitter) {
  _inherits(Game, _Emitter);

  // tradeAccepted: boolean; // do i need this?


  // <state>
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
  // </state>

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
      _underscore2.default.each(this.participants, function (participant, num) {
        participant.num = parseInt(num);
      });
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
    key: 'getDiscardingParticipants',
    value: function getDiscardingParticipants() {

      var discarding = [];
      this.participants.forEach(function (participant) {

        if (participant.toDiscard > 0) discarding.push(participant);
      });

      return discarding;
    }
  }, {
    key: 'isWaitingForDiscard',
    value: function isWaitingForDiscard() {
      return this.getDiscardingParticipants().length > 0;
    }
  }, {
    key: 'mutate',
    value: function mutate(participant, name, rawArgs) {

      try {

        var edge = this.graph.getEdge(name);
        var args = edge.parseArgs(this, rawArgs);
        var result = edge.execute(this, participant, args);

        this.history.store({ participant: participant, edge: edge, args: args, result: result });

        var target = this.graph.getVertex(edge.target);
        participant.vertex = target;

        this.modify();

        return result;
      } catch (e) {

        if (e instanceof _utils.CatonlineError) return new _utils.EdgeResult('null');

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
        if (cpid === -1) cpid += 1;
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

      if (!choice.isSettleable) {
        _underscore2.default.each(choice.hexes, function (hex) {
          if (hex && !hex.isOcean) throw new _utils.EdgeExecutionError('You can\'t settle next an existing settlement');
        });
        throw new _utils.EdgeExecutionError('You can\'t settle in the ocean');
      }

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
    key: 'initCollect',
    value: function initCollect(participant) {

      var lastSettlement = participant.settlements.slice(-1)[0];
      _underscore2.default.each(lastSettlement.hexes, function (hex) {

        if (!hex) return;

        var res = hex.resource;

        if (res.yields) participant.collect(_defineProperty({}, res.name, 1));
      });
    }
  }, {
    key: '_roll',
    value: function _roll() {

      var roll = this.dice.getTotal();
      this.hasRolled = true;

      if (roll === 7) {
        this.participants.forEach(function (participant) {
          if (participant.hasHeavyPurse()) {

            var toDiscard = Math.floor(participant.getNumResources() / 2);
            participant.toDiscard = toDiscard;
          }
        });
      }
    }
  }, {
    key: 'roll',
    value: function roll() {

      this.dice.roll();
      this._roll();
      return this.dice.getTotal();
    }
  }, {
    key: 'rollNumber',
    value: function rollNumber(num) {

      // $TODO
      // if (!this.DEBUG_MODE)
      //    throw new CatonlineError(`You can only do this in DEBUG_MODE`)

      var n1 = 6;
      var n2 = num - n1;

      this.dice.setRolls(n1, n2);
      this._roll();

      return this.dice.getTotal();
    }
  }, {
    key: 'collectResources',
    value: function collectResources() {
      var _this2 = this;

      var total = this.dice.getTotal();
      _underscore2.default.each(this.board.hexes, function (hex) {

        if (hex === _this2.board.robber.hex) return;

        if (!hex.resource.yields) return;

        if (hex.dice !== total) return;

        _underscore2.default.each(hex.juncs, function (junc) {

          if (!junc.owner) return;

          var res = hex.resource.name;
          var harvest = _defineProperty({}, res, 1);

          if (junc.isCity) harvest[res] += 1;

          junc.owner.collect(harvest);
        });
      });
    }
  }, {
    key: 'getStealableParticipants',
    value: function getStealableParticipants(stealer) {

      var stealable = [];

      _underscore2.default.each(this.board.robber.hex.juncs, function (junc) {

        if (junc.owner !== stealer) stealable.push(junc.owner);
      });

      return stealable;
    }
  }, {
    key: 'moveRobber',
    value: function moveRobber(mover, hex) {

      if (hex === this.board.robber.hex) throw new _utils.EdgeExecutionError('robber is already here');

      if (hex.isOcean) throw new _utils.EdgeExecutionError('cannot place robber in the ocean');

      this.board.robber.moveTo(hex);

      var targets = this.getStealableParticipants(mover);
      this.canSteal = targets.length > 0;
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

      return true && function () {

        var equal = true;

        if (equal) thisConds.board.hexes.forEach(function (hex, i) {
          equal = hex === thatConds.board.hexes[i];
        });

        if (equal) thatConds.board.hexes.forEach(function (hex, i) {
          equal = hex === thisConds.board.hexes[i];
        });

        if (equal) thisConds.board.ports.forEach(function (port, i) {
          equal = port === thatConds.board.ports[i];
        });

        if (equal) thatConds.board.ports.forEach(function (port, i) {
          equal = port === thisConds.board.ports[i];
        });

        return equal;
      }() && (0, _utils.objectsMatch)(thisConds.params, thatConds.params) && (0, _utils.objectsMatch)(thisConds.players, thatConds.players) && (0, _utils.objectsMatch)(thisConds.deck, thatConds.deck) && this.history.length === game.history.length && this.history._items.reduce(function (memo, item, i) {

        var other = game.history._items[i];

        return memo && item.edge.name === other.edge.name && item.args.toString() === other.args.toString() && item.participant.num === other.participant.num && item.result.toString() === other.result.toString();
      }, true);
    }
  }, {
    key: 'serialize',
    value: function serialize() {

      return {
        history: this.history.serialize(),
        initialConditions: this.initialConditions
      };
    }
  }, {
    key: 'getInitialConditions',
    value: function getInitialConditions() {

      if (!this.isRandomized) throw new _utils.CatonlineError('cannot get initial conditions for non-randomized game');

      return {
        params: this.params,
        owner: this.owner.id,
        players: this.participants.map(function (participant) {
          return participant.player.id;
        }),
        board: {
          hexes: _underscore2.default.map(this.board.hexes, function (hex) {
            return [hex.resource.name, hex.dice.value].join(' ');
          }),
          ports: _underscore2.default.map(this.board.ports, function (port) {
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
      conds.board.hexes.forEach(function (hex, i) {

        var index = String(i);

        var _hex$split = hex.split(' '),
            _hex$split2 = _slicedToArray(_hex$split, 2),
            resource = _hex$split2[0],
            diceString = _hex$split2[1];

        var diceValue = parseInt(diceString);

        game.board.hexes[index].resource = new _resource.Resource(resource);
        game.board.hexes[index].dice = new _diceValue.DiceValue(diceValue);
      });

      // overwrite the board port values
      conds.board.ports.forEach(function (port, i) {

        var index = String(i);
        game.board.ports[index].type = port;
      });

      // overwrite the deck
      game.deck.setCards(scenario, conds.deck);

      return game;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {

      // $TODO get a better way to create this stuff
      var originalConds = serial.initialConditions;
      var originalOwner = new _player.Human(originalConds.owner);
      var originalPlayers = {};
      originalConds.players.forEach(function (id) {
        originalPlayers[id] = new _player.Human(id);
      });

      var game = Game.initialize(originalConds, originalOwner, originalPlayers);

      serial.history.forEach(function (item) {
        var _item$split = item.split(' '),
            _item$split2 = _slicedToArray(_item$split, 4),
            participantNumString = _item$split2[0],
            edgeName = _item$split2[1],
            argString = _item$split2[2],
            resultString = _item$split2[3];

        var participantNum = parseInt(participantNumString);

        var participant = game.participants[participantNum];
        var edge = game.graph.getEdge(edgeName);
        var result = edge.parseResult(game, resultString);

        if (result.type === 'null') {
          participant._do(edgeName, argString);
        } else {
          participant._do(edgeName, resultString);
        }
      });

      return game;
    }
  }]);

  return Game;
}(_events2.default);