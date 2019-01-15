'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dice = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dice = exports.Dice = function () {
  function Dice() {
    _classCallCheck(this, Dice);

    this.values = [-1, -1];
  }

  _createClass(Dice, [{
    key: 'roll',
    value: function roll() {

      this.values = [(0, _utils.getRandomInt)(1, 6), (0, _utils.getRandomInt)(1, 6)];
    }
  }, {
    key: 'getTotal',
    value: function getTotal() {
      return this.values[0] + this.values[1];
    }
  }]);

  return Dice;
}();