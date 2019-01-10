'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevCardDeck = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevCardDeck = exports.DevCardDeck = function () {
  function DevCardDeck(scenario) {
    _classCallCheck(this, DevCardDeck);

    this.cards = [];
  }

  _createClass(DevCardDeck, [{
    key: 'shuffle',
    value: function shuffle() {
      this.cards = (0, _utils.shuffle)(this.cards);
    }
  }, {
    key: 'draw',
    value: function draw() {
      return this.cards.pop();
    }
  }]);

  return DevCardDeck;
}();