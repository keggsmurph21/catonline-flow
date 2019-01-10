"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CatonlineError = function (_Error) {
  _inherits(CatonlineError, _Error);

  function CatonlineError() {
    _classCallCheck(this, CatonlineError);

    return _possibleConstructorReturn(this, (CatonlineError.__proto__ || Object.getPrototypeOf(CatonlineError)).apply(this, arguments));
  }

  return CatonlineError;
}(Error);

var Errors = exports.Errors = {

  CatonlineError: CatonlineError

};