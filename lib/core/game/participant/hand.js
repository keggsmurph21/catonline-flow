'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hand = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hand = exports.Hand = function () {
  function Hand() {
    _classCallCheck(this, Hand);

    this.playedDCs = {};
    this.unplayedDCs = {};
    this.unplayableDCs = {};
    this.resources = {};
  }

  _createClass(Hand, [{
    key: 'serialize',
    value: function serialize() {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serial) {
      throw new _utils.CatonlineError('not implemented');
    }
  }, {
    key: 'getNumDevCardsInHand',
    value: function getNumDevCardsInHand() {

      var acc = 0;
      _underscore2.default.each(this.unplayedDCs, function (num) {
        return acc += num;
      });
      _underscore2.default.each(this.unplayableDCs, function (num) {
        return acc += num;
      });

      return acc;
    }
  }, {
    key: 'getNumResources',
    value: function getNumResources() {

      var acc = 0;
      _underscore2.default.each(this.resources, function (num) {
        return acc += num;
      });

      return acc;
    }
  }, {
    key: 'canAfford',
    value: function canAfford(cost) {
      var _this = this;

      var canAfford = true;

      _underscore2.default.each(cost, function (name, num) {
        if (_this.resources[name] < num) canAfford = false;
      });

      return canAfford;
    }
  }, {
    key: 'spend',
    value: function spend(cost) {
      var _this2 = this;

      if (!this.canAfford(cost)) throw new _utils.CatonlineError('cannot afford! cost: "' + JSON.stringify(cost) + '", resources: "' + JSON.stringify(this.resources) + '"');

      _underscore2.default.each(cost, function (name, num) {
        _this2.resources[name] -= num;
      });
    }
  }]);

  return Hand;
}();