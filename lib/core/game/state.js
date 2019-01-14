'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // TODO: delete this file
// @ flow

var _utils = require('../../utils');

var _player = require('../player');

var _bank = require('./bank');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = function () {
  function State(game) {
    _classCallCheck(this, State);

    this.status = game.isFull() ? 'ready' : 'pending';

    this.turn = 1;

    this.isFirstTurn = true;
    this.isSecondTurn = false;
    this.isGameOver = false;
    this.isRollSeven = false;
    this.waiting = [];
    this.canSteal = false;
    this.tradeAccepted = false;
    this.waitForDiscard = false;
    this.currentTrade = null;
    this.currentPlayerID = 0;
    this.hasRolled = false;

    this.largestArmy = 2;
    this.hasLargestArmy = null;
    this.longestRoad = 4;
    this.hasLongestRoad = null;

    this.players = game.players.map(function (player) {
      return {

        id: player.id,
        vertex: 'v_end_turn',
        adjacents: [],

        isHuman: player.isHuman(),
        discard: 0,
        hasDeclinedTrade: false,
        canAcceptTrade: false,
        hasHeavyPurse: false,
        bankTradeRates: _bank.defaultBankRate,
        numKnights: 0,
        hand: player.hand

      };
    });
  }

  // player-specific state-values


  _createClass(State, [{
    key: 'setInitialConditions',
    value: function setInitialConditions(conds) {
      this.initialConditions = conds;
    }
  }, {
    key: 'getPublic',
    value: function getPublic(game) {
      return {

        status: this.status,
        turn: this.turn,

        isFirstTurn: this.isFirstTurn,
        isSecondTurn: this.isSecondTurn,
        isGameOver: this.isGameOver,
        isRollSeven: this.isRollSeven,
        waiting: this.waiting,
        canSteal: this.canSteal,
        tradeAccepted: this.tradeAccepted,
        waitForDiscard: this.waitForDiscard,
        currentTrade: this.currentTrade,
        currentPlayerID: this.currentPlayerID,
        hasRolled: this.hasRolled,

        largestArmy: this.largestArmy,
        hasLargestArmy: this.hasLargestArmy,
        longestRoad: this.longestRoad,
        hasLongestRoad: this.hasLongestRoad,

        players: this.players.map(function (player) {
          return player.getPublic(game);
        })

      };
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return State;
}();