'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Port = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _cache = require('./cache');

var _hex = require('./hex');

var _junc = require('./junc');

var _road = require('./road');

var _node = require('./node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Port = exports.Port = function (_Node) {
  _inherits(Port, _Node);

  function Port(num, params, scenario) {
    _classCallCheck(this, Port);

    var _this = _possibleConstructorReturn(this, (Port.__proto__ || Object.getPrototypeOf(Port)).call(this, 'Port', params.hex.coords));

    _this.id = 'p' + num;
    _this.num = num;

    _this.params = params;
    _this.road = null;

    return _this;
  }

  _createClass(Port, [{
    key: 'bindToRoad',
    value: function bindToRoad(cache) {
      var _params$hex = this.params.hex,
          orientation = _params$hex.orientation,
          coords = _params$hex.coords;

      var hex = cache.get('h', coords);

      this.road = hex.roads[orientation];
      this.coords = this.road.coords; // overwrite from Node
    }
  }, {
    key: 'getHex',
    value: function getHex() {
      return _underscore2.default.find(this.hexes, function (hex) {
        return hex && !hex.isOcean;
      });
    }
  }, {
    key: 'getHexes',
    value: function getHexes() {
      return this.road.hexes;
    }
  }, {
    key: 'getJuncs',
    value: function getJuncs() {
      return this.road.juncs;
    }
  }, {
    key: 'render',
    value: function render() {
      return {};
    }
  }]);

  return Port;
}(_node.Node);