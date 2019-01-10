'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _node = require('./node');

var _hex = require('./hex');

var _junc = require('./junc');

var _road = require('./road');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = exports.Board = function () {
  function Board() {
    _classCallCheck(this, Board);
  }

  _createClass(Board, [{
    key: 'getById',
    value: function getById() {}
  }, {
    key: 'getHexById',
    value: function getHexById() {}
  }, {
    key: 'getJuncById',
    value: function getJuncById() {}
  }, {
    key: 'getRoadById',
    value: function getRoadById() {}
  }]);

  return Board;
}();