'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoordinateCache = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _utils = require('../../utils');

var _boardNode = require('./board-node');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoordinateCache = exports.CoordinateCache = function () {
  function CoordinateCache() {
    _classCallCheck(this, CoordinateCache);

    this._hexes = {};
    this._juncs = {};
    this._roads = {};
  }

  _createClass(CoordinateCache, [{
    key: 'hash',
    value: function hash(coords) {

      var x = (0, _utils.round)(coords.x, 2);
      var y = (0, _utils.round)(coords.y, 2);
      var z = (0, _utils.round)(coords.z, 2);

      return x + '_' + y + '_' + z;
    }
  }, {
    key: 'getHex',
    value: function getHex(coords) {
      var key = this.hash(coords);
      return this._hexes[key];
    }
  }, {
    key: 'hasHex',
    value: function hasHex(coords) {
      return !!this.getHex(coords);
    }
  }, {
    key: 'setHex',
    value: function setHex(coords, hex) {
      var key = this.hash(coords);
      this._hexes[key] = hex;
    }
  }, {
    key: 'getJunc',
    value: function getJunc(coords) {
      var key = this.hash(coords);
      return this._juncs[key];
    }
  }, {
    key: 'hasJunc',
    value: function hasJunc(coords) {
      return !!this.getJunc(coords);
    }
  }, {
    key: 'setJunc',
    value: function setJunc(coords, junc) {
      var key = this.hash(coords);
      this._juncs[key] = junc;
    }
  }, {
    key: 'getRoad',
    value: function getRoad(coords) {
      var key = this.hash(coords);
      return this._roads[key];
    }
  }, {
    key: 'hasRoad',
    value: function hasRoad(coords) {
      return !!this.getRoad(coords);
    }
  }, {
    key: 'setRoad',
    value: function setRoad(coords, road) {
      var key = this.hash(coords);
      this._roads[key] = road;
    }
  }]);

  return CoordinateCache;
}();