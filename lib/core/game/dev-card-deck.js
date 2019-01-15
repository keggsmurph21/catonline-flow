'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevCardDeck = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _devCard = require('./dev-card');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevCardDeck = exports.DevCardDeck = function () {
  function DevCardDeck(scenario) {
    var _this = this;

    _classCallCheck(this, DevCardDeck);

    var cost = scenario.buyable.devCard.cost;
    this.cards = [];

    _underscore2.default.each(scenario.devCards, function (params, name) {
      for (var i = 0; i < params.count; i++) {

        var card = new _devCard.DevCard({
          name: name,
          count: params.count,
          cost: cost
        });
        _this.cards.push(card);
      }
    });
  }

  _createClass(DevCardDeck, [{
    key: 'shuffle',
    value: function shuffle() {
      (0, _utils.shuffle)(this.cards);
    }
  }, {
    key: 'draw',
    value: function draw() {
      return this.cards.pop();
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return !!this.cards.length;
    }
  }, {
    key: 'setCards',
    value: function setCards(scenario, cards) {
      this.cards = cards.map(function (name) {
        return new _devCard.DevCard({
          name: name,
          count: scenario.devCards[name].count,
          cost: scenario.buyable.devCard.cost
        });
      });
    }
  }]);

  return DevCardDeck;
}();