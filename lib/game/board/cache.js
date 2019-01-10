'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoordinateCache = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _node = require('./node');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoordinateCache = exports.CoordinateCache = function () {
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
    key: 'has',
    value: function has(prefix, coords) {
      return !!this.get(prefix, coords);
    }
  }, {
    key: 'get',
    value: function get(prefix, coords) {

      var key = this.hash(prefix, coords);
      return this._items[key];
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