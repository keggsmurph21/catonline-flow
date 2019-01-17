'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bank = undefined;

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  strict

var Bank = exports.Bank = function Bank() {
  _classCallCheck(this, Bank);

  this.DEFAULT_TRADE_RATE = _utils.BANK_TRADE_RATES;
};