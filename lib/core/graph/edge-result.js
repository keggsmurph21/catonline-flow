'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EdgeResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  strict

var EdgeResult = exports.EdgeResult = function () {
  function EdgeResult(type) {
    _classCallCheck(this, EdgeResult);

    this.type = type;
  }

  _createClass(EdgeResult, [{
    key: 'toString',
    value: function toString() {

      var s = void 0;

      switch (this.type) {

        case 'diceroll':
          return this.getDiceroll() + '';

        case 'null':
          return '_';

        case 'resource':
          return this.values[0];

        default:
          throw new _utils.CatonlineError('unexpected EdgeArgumentType "' + this.type + '"');

      }
    }
  }, {
    key: 'getDiceroll',
    value: function getDiceroll() {

      if (this.type !== 'diceroll') throw new _utils.CatonlineError('cannot call getDiceroll for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getResourceName',
    value: function getResourceName() {

      if (this.type !== 'resource') throw new _utils.CatonlineError('cannot call getResourceName() for type "' + this.type + '"');

      return this.values[0];
    }
  }], [{
    key: 'fromString',
    value: function fromString(type, s, game) {
      var arg = new EdgeResult(type);

      var i = void 0;

      switch (type) {

        case 'diceroll':

          i = (0, _utils.parseIndex)('diceroll', s);

          // $TODO
          // if (this.DEBUG_MODE) {

          if (isNaN(i)) throw new _utils.EdgeResultError('cannot roll "' + i + '" ("' + (s || '') + '")');

          if (i < 2) throw new _utils.EdgeResultError('cannot roll less than 2 ("' + (s || '') + '")');

          if (i > 12) throw new _utils.EdgeResultError('cannot roll greater than 12 ("' + (s || '') + '")');

          arg.values = [i];

          // } else {
          //    throw new CatonlineError(`You can only do this in DEBUG_MODE`);
          // }

          break;

        case 'null':
          arg.values = [];
          break;

        case 'resource':
          var r = (0, _utils.parseResource)(game, s);
          arg.values = [r];
          break;

        default:
          throw new _utils.CatonlineError('unexpected EdgeArgumentType "' + type + '"');
      }

      return arg;
    }
  }]);

  return EdgeResult;
}();