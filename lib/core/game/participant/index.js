'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../../utils');

var _player = require('../../player');

var _2 = require('..');

var _hand = require('./hand');

var _scenarios = require('../../scenarios');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Participant = exports.Participant = function () {
  //numKnights: 0, // calculate this on the fly

  //canAcceptTrade: boolean;

  //adjacents: Edge[];

  //isHuman: player.isHuman(), // calculate this on the fly

  function Participant(game, player) {
    _classCallCheck(this, Participant);

    this.game = game;
    this.player = player;
    this.hand = new _hand.Hand(game.board.scenario);

    this.vertex = this.game.graph.INITIAL_VERTEX;
    //this.adjacents = this.game.graph.getAdjacents(this);

    this.toDiscard = 0;
    this.hasDeclinedTrade = false;
    //this.canAcceptTrade = false;
    this.hasHeavyPurse = false;

    this.bankTradeRate = this.game.bank.DEFAULT_TRADE_RATE;

    this.settlements = [];
    this.roads = [];
  } // @ alejo

  _createClass(Participant, [{
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'isCurrentParticipant',
    value: function isCurrentParticipant() {
      return this === this.game.getCurrentParticipant();
    }
  }, {
    key: 'isOwner',
    value: function isOwner() {
      return this.game.isOwner(this.player);
    }
  }, {
    key: 'resetDevCards',
    value: function resetDevCards() {
      var _this = this;

      _underscore2.default.each(this.hand.unplayableDCs, function (count, name) {

        _this.hand.unplayableDCs[name] -= count;
        _this.hand.playedDCs[name] += count;
      });
    }
  }, {
    key: 'getEdges',
    value: function getEdges() {

      var edges = this.game.graph.getAdjacents(this);

      var priorityEdge = null;
      edges.forEach(function (edge) {
        if (edge.isPriority) {

          if (priorityEdge) throw new _utils.CatonlineError('cannot have multiple priority edges! (' + priorityEdge.name + ', ' + edge.name + ')');

          priorityEdge = edge;
        }
      });

      if (priorityEdge) return [priorityEdge];

      return edges;
    }
  }, {
    key: 'getNumDevCards',
    value: function getNumDevCards() {

      var acc = 0;
      _underscore2.default.each(this.hand.playedDCs, function (num) {
        acc += num;
      });
      _underscore2.default.each(this.hand.unplayedDCs, function (num) {
        acc += num;
      });
      _underscore2.default.each(this.hand.unplayableDCs, function (num) {
        acc += num;
      });

      return acc;
    }
  }, {
    key: 'getNumDevCardsInHand',
    value: function getNumDevCardsInHand() {

      var acc = 0;
      _underscore2.default.each(this.hand.unplayedDCs, function (num) {
        acc += num;
      });
      _underscore2.default.each(this.hand.unplayableDCs, function (num) {
        acc += num;
      });

      return acc;
    }
  }, {
    key: 'getNumResources',
    value: function getNumResources() {

      var acc = 0;
      _underscore2.default.each(this.hand.resources, function (num) {
        acc += num;
      });

      return acc;
    }
  }, {
    key: 'getNumSettlements',
    value: function getNumSettlements() {
      return this.settlements.length;
    }
  }, {
    key: 'getNumCities',
    value: function getNumCities() {
      return this.settlements.filter(function (junc) {
        return junc.isCity;
      }).length;
    }
  }, {
    key: 'getNumRoads',
    value: function getNumRoads() {
      return this.roads.length;
    }
  }, {
    key: 'getLongestRoad',
    value: function getLongestRoad() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'getLargestArmy',
    value: function getLargestArmy() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'isHuman',
    value: function isHuman() {
      return this.player.type === 'Human';
    }
  }, {
    key: 'getPublic',
    value: function getPublic(game) {

      throw new _utils.CatonlineError('not implemented');

      /*
      const playerState = game.getPlayerState(this);
       return {
         id: this.id,
        color: this.color,
        isHuman: this.isHuman(),
         numDevCardsInHand: this.hand.getNumDevCardsInHand(),
        numPlayedKnights: this.hand.playedDCs.knight,
        numResourcesInHand: this.hand.getNumResources(),
        hasLargestArmy: this.equals(game.state.hasLargestArmy),
         longestRoad: playerState
       }
      */
    }
  }, {
    key: 'canAcceptCurrentTrade',
    value: function canAcceptCurrentTrade() {

      var trade = this.game.currentTrade;
      if (!trade) return false;

      if (trade.from.participant.player.equals(this.player)) return false;

      if (trade.for.participants.indexOf(this) === -1) return false;

      return this.canAfford(trade.for.cards);
    }
  }, {
    key: 'canTradeWithBank',
    value: function canTradeWithBank() {
      var _this2 = this;

      var canTrade = false;

      _underscore2.default.each(this.bankTradeRate, function (num, name) {

        var cost = _defineProperty({}, name, num);
        canTrade = canTrade || _this2.canAfford(cost);
      });

      return canTrade;
    }
  }, {
    key: 'canBuild',
    value: function canBuild(obj) {

      var scenario = _scenarios.scenarios[this.game.params.scenario];
      if (!(obj in scenario.buyable)) throw new _utils.CatonlineError('cannot calculate canBuild(): unrecognized object "' + obj + '"');

      var cost = scenario.buyable[obj].cost;
      var max = scenario.buyable[obj].maxNum;

      switch (obj) {

        case 'city':
          return this.canAfford(cost) && this.getNumCities() < max;

        case 'devCard':
          return this.canAfford(cost) && this.getNumDevCards() < max;

        case 'road':
          return this.canAfford(cost) && this.getNumRoads() < max;

        case 'settlement':
          return this.canAfford(cost) && this.getNumSettlements() < max;

        default:
          throw new _utils.CatonlineError('cannot calculate canBuild(): unrecognized object "' + obj + '"');

      }
    }
  }, {
    key: 'canPlayDevCard',
    value: function canPlayDevCard(name) {
      return this.hand.unplayedDCs[name] > 0;
    }
  }, {
    key: 'canAfford',
    value: function canAfford(cost) {
      var _this3 = this;

      var canAfford = true;

      _underscore2.default.each(cost, function (num, name) {
        if (_this3.hand.resources[name] < num) canAfford = false;
      });

      return canAfford;
    }
  }, {
    key: 'spend',
    value: function spend(cost) {
      var _this4 = this;

      if (!this.canAfford(cost)) throw new _utils.CatonlineError('cannot afford! cost: "' + JSON.stringify(cost) + '", resources: "' + JSON.stringify(this.hand.resources) + '"');

      _underscore2.default.each(cost, function (num, name) {
        _this4.hand.resources[name] -= num;
      });
    }
  }, {
    key: 'collect',
    value: function collect(cost) {
      var _this5 = this;

      _underscore2.default.each(cost, function (num, name) {
        _this5.hand.resources[name] += num;
      });
    }
  }, {
    key: 'do',
    value: function _do(name, args) {

      var edges = this.getEdges().map(function (edge) {
        return edge.name;
      });
      if (edges.indexOf(name) === -1) throw new _utils.EdgeExecutionError('cannot do edge "' + name + '", edge is not adjacent');

      var ret = this.game.mutate(this, name, args);
    }
  }, {
    key: 'getPublicScore',
    value: function getPublicScore() {

      return this.hand.playedDCs.vp + this.getNumSettlements() + this.getNumCities() + (this === this.game.hasLongestRoad ? 2 : 0) + (this === this.game.hasLargestArmy ? 2 : 0);
    }
  }, {
    key: 'getPrivateScore',
    value: function getPrivateScore() {
      return this.getPublicScore() + this.hand.unplayedDCs.vp;
    }
  }]);

  return Participant;
}();

/*
playerID        : player.playerID,
color           : player.color,
isHuman         : player.isHuman,
devCardsInHand  : sumOverObject(player.unplayedDCs) + sumOverObject(player.unplayableDCs),
numKnights      : player.numKnights,
hasLargestArmy  : (this.state.hasLargestArmy===player.playerID),
resourcesInHand : sumOverObject(player.resources), // TODO: move this to funcs, combine with the similar funciton in LOGIC
longestRoad     : player.longestRoad,
publicScore     : player.publicScore,
roads           : player.roads,
settlements     : player.settlements,
cities          : player.cities,
lobbyData       : player.lobbyData
*/