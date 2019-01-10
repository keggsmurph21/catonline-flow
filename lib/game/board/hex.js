'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hex = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _node = require('./node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hex = exports.Hex = function (_Node) {
  _inherits(Hex, _Node);

  // to be displayed
  function Hex(num, params, scenario) {
    _classCallCheck(this, Hex);

    var _this = _possibleConstructorReturn(this, (Hex.__proto__ || Object.getPrototypeOf(Hex)).call(this, params.coords));

    _this.id = 'h' + num;
    _this.num = num;

    _this.dice = {
      roll: null,
      dots: null
    };
    _this.isOcean = params.isOcean;
    _this.resource = null;
    _this.resources = params.resources ? params.resources === '*' ? _underscore2.default.filter(Object.keys(scenario.resources), function (res) {
      return res !== 'ocean';
    }) : params.resources.split(',') : [];

    return _this;
  } // to be drawn

  _createClass(Hex, [{
    key: 'render',
    value: function render() {

      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return Hex;
}(_node.Node);