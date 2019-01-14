'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../../utils');

var _player = require('../../player');

var _2 = require('..');

var _hand = require('./hand');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Participant = exports.Participant = function () {
  //numKnights: 0, // calculate this on the fly

  function Participant(game, player) {
    _classCallCheck(this, Participant);

    this.game = game;
    this.player = player;
    this.hand = new _hand.Hand();

    this.vertex = this.game.graph.INITIAL_VERTEX;
    //this.adjacents = this.game.graph.getAdjacents(this.vertex);

    this.toDiscard = 0;
    this.hasDeclinedTrade = false;
    this.canAcceptTrade = false;
    this.hasHeavyPurse = false;

    this.bankTradeRate = _utils.BANK_TRADE_RATES;
  } // @ alejo

  //isHuman: player.isHuman(), // calculate this on the fly

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
    key: 'getNumDevCardsInHand',
    value: function getNumDevCardsInHand() {

      var acc = 0;
      _underscore2.default.each(this.hand.unplayedDCs, function (num) {
        return acc += num;
      });
      _underscore2.default.each(this.hand.unplayableDCs, function (num) {
        return acc += num;
      });

      return acc;
    }
  }, {
    key: 'getNumResources',
    value: function getNumResources() {

      var acc = 0;
      _underscore2.default.each(this.hand.resources, function (num) {
        return acc += num;
      });

      return acc;
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