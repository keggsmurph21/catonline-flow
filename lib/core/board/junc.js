'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Junc = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _boardNode = require('./board-node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //  strict

var Junc = exports.Junc = function (_BoardNode) {
  _inherits(Junc, _BoardNode);

  function Junc(num, coords) {
    _classCallCheck(this, Junc);

    var _this = _possibleConstructorReturn(this, (Junc.__proto__ || Object.getPrototypeOf(Junc)).call(this, 'Junc', coords));

    _this.id = 'j' + num;
    _this.num = num;

    _this.juncs = {};
    _this.hexes = {};
    _this.roads = {};

    _this.isSettleable = false;
    _this.isCity = false;

    return _this;
  }

  _createClass(Junc, [{
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'isOcean',
    value: function isOcean() {

      var isOcean = true;
      _underscore2.default.each(this.hexes, function (hex) {
        if (hex && !hex.isOcean) isOcean = false;
      });

      return isOcean;
    }
  }, {
    key: 'getNeighbors',
    value: function getNeighbors() {

      var neighbors = new Set();

      _underscore2.default.each(this.roads, function (road) {
        if (road) _underscore2.default.each(road.juncs, function (junc) {
          if (junc) neighbors.add(junc);
        });
      });

      neighbors.delete(this);
      return neighbors;
    }

    /*
    render(): JuncRenderT {
       const coords = this.getRenderedCoords();
       return {
        cx: coords.x,
        cy: coords.y,
      };
     }
    */

  }], [{
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return Junc;
}(_boardNode.BoardNode);