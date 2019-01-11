'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Road = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _hex = require('./hex');

var _junc = require('./junc');

var _boardNode = require('./board-node');

var _player = require('../player');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // @ flow

var Road = exports.Road = function (_BoardNode) {
  _inherits(Road, _BoardNode);

  function Road(num, coords) {
    _classCallCheck(this, Road);

    var _this = _possibleConstructorReturn(this, (Road.__proto__ || Object.getPrototypeOf(Road)).call(this, 'Road', coords));

    _this.id = 'r' + num;
    _this.num = num;

    _this.roads = {};
    _this.hexes = {};
    _this.juncs = {};

    return _this;
  }

  _createClass(Road, [{
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'isOcean',
    value: function isOcean() {

      var isOcean = true;
      _.each(this.hexes, function (hex) {
        if (hex && !hex.isOcean) isOcean = false;
      });

      return isOcean;
    }
  }, {
    key: 'render',
    value: function render() {

      var points = _.map(this.juncs, function (junc) {
        return junc ? junc.renderedCoords : null;
      }).filter(_utils.thin);
      var path = (0, _utils.pointsArrayToPath)(points);

      return { path: path };
    }
  }], [{
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return Road;
}(_boardNode.BoardNode);