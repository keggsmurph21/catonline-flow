'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Road = undefined;

var _utils = require('../../utils');

var _node = require('./node');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // @ flow

var Road = exports.Road = function (_Node) {
  _inherits(Road, _Node);

  function Road() {
    _classCallCheck(this, Road);

    return _possibleConstructorReturn(this, (Road.__proto__ || Object.getPrototypeOf(Road)).apply(this, arguments));
  }

  return Road;
}(_node.Node);