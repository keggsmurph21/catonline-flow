'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevCard = undefined;

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevCard = exports.DevCard = function DevCard(params) {
  _classCallCheck(this, DevCard);

  this.type = params.name;
  this.name = _utils.DEVCARD_NAMES_MAP[params.name];
  this.count = params.count;
  this.cost = {};
};