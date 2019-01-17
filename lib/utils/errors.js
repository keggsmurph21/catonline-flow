'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  strict

var CatonlineError = exports.CatonlineError = function (_Error) {
  _inherits(CatonlineError, _Error);

  function CatonlineError(message) {
    _classCallCheck(this, CatonlineError);

    var _this = _possibleConstructorReturn(this, (CatonlineError.__proto__ || Object.getPrototypeOf(CatonlineError)).call(this, message));

    _this.name = 'CatonlineError';
    return _this;
  }

  return CatonlineError;
}(Error);

var InvalidGameParamsError = exports.InvalidGameParamsError = function (_CatonlineError) {
  _inherits(InvalidGameParamsError, _CatonlineError);

  function InvalidGameParamsError(message) {
    _classCallCheck(this, InvalidGameParamsError);

    var _this2 = _possibleConstructorReturn(this, (InvalidGameParamsError.__proto__ || Object.getPrototypeOf(InvalidGameParamsError)).call(this, message));

    _this2.name = 'InvalidGameParamsError';
    return _this2;
  }

  return InvalidGameParamsError;
}(CatonlineError);

var EdgeArgumentError = exports.EdgeArgumentError = function (_CatonlineError2) {
  _inherits(EdgeArgumentError, _CatonlineError2);

  function EdgeArgumentError(message) {
    _classCallCheck(this, EdgeArgumentError);

    var _this3 = _possibleConstructorReturn(this, (EdgeArgumentError.__proto__ || Object.getPrototypeOf(EdgeArgumentError)).call(this, message));

    _this3.name = 'EdgeArgumentError';
    return _this3;
  }

  return EdgeArgumentError;
}(CatonlineError);

;

var EdgeExecutionError = exports.EdgeExecutionError = function (_CatonlineError3) {
  _inherits(EdgeExecutionError, _CatonlineError3);

  function EdgeExecutionError(message) {
    _classCallCheck(this, EdgeExecutionError);

    var _this4 = _possibleConstructorReturn(this, (EdgeExecutionError.__proto__ || Object.getPrototypeOf(EdgeExecutionError)).call(this, message));

    _this4.name = 'EdgeExecutionError';
    return _this4;
  }

  return EdgeExecutionError;
}(CatonlineError);