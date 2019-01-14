'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiceValue = undefined;

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiceValue = exports.DiceValue = function DiceValue(value) {
  _classCallCheck(this, DiceValue);

  this.value = value;

  var dots = _utils.DICE_DOTS_MAP[value];

  if (dots === undefined) throw new _utils.CatonlineError('cannot initialize DiceValue for value "' + value + '"');

  this.dots = dots;
};