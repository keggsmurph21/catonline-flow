'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Robber = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('../player');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Robber = exports.Robber = function () {
  function Robber() {
    _classCallCheck(this, Robber);
  }

  _createClass(Robber, [{
    key: 'moveTo',
    value: function moveTo(location) {
      this.location = location;
    }
  }]);

  return Robber;
}();