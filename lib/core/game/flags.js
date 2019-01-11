'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Flags = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _player = require('../player');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flags = exports.Flags = function () {
  function Flags() {
    _classCallCheck(this, Flags);
  }

  _createClass(Flags, [{
    key: 'setInitialConditions',
    value: function setInitialConditions(conds) {
      this.initialConditions = conds;
    }

    // player-specific state-values

  }, {
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }]);

  return Flags;
}();