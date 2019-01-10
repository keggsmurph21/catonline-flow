'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _node = require('./node');

var _hex = require('./hex');

var _junc = require('./junc');

var _port = require('./port');

var _road = require('./road');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoordinateCache = function () {
  function CoordinateCache() {
    _classCallCheck(this, CoordinateCache);

    this._items = {};
  }

  _createClass(CoordinateCache, [{
    key: 'hash',
    value: function hash(prefix, coords) {

      var x = (0, _utils.round)(coords.x, 2);
      var y = (0, _utils.round)(coords.y, 2);
      var z = (0, _utils.round)(coords.z, 2);

      return prefix + '_' + x + '_' + y + '_' + z;
    }
  }, {
    key: 'get',
    value: function get(prefix, coords) {

      var key = this.hash(prefix, coords);
      return this._items[key] || null;
    }
  }, {
    key: 'set',
    value: function set(prefix, coords, node) {

      var key = this.hash(prefix, coords);
      this._items[key] = node;
    }
  }]);

  return CoordinateCache;
}();

var Board = exports.Board = function () {
  function Board(scenario) {
    _classCallCheck(this, Board);

    this.scenario = scenario;

    // build structure

    var counters = {
      hex: 0,
      junc: 0,
      port: 0,
      road: 0
    };

    scenario.topology.forEach(function (hexParams) {

      var hex = new _hex.Hex(counters.hex, hexParams, scenario);
    });
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