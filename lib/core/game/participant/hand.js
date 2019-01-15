'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hand = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

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

    /*
    getNumDevCardsInHand(): number {
       let acc: number = 0;
      _.each(this.unplayedDCs, (num: number) => { acc += num });
      _.each(this.unplayableDCs, (num: number) => { acc += num });
       return acc;
     }
     getNumResources(): number {
       let acc: number = 0;
      _.each(this.resources, (num: number) => { acc += num });
       return acc;
     }
    */

  }]);

  return Hand;
}();