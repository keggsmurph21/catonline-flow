'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.History = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  strict

var History = exports.History = function () {
  function History() {
    _classCallCheck(this, History);

    this._items = [];
  }

  // flowlint-next-line unsafe-getters-setters:off


  _createClass(History, [{
    key: 'store',
    value: function store(item) {
      this._items.push(item);
    }
  }, {
    key: 'serialize',
    value: function serialize() {

      return this._items.map(function (item) {
        return {
          participantNum: item.participant.num,
          edgeName: item.edge.name,
          argString: item.args.toString(),
          result: item.result
        };
      });
    }
  }, {
    key: 'length',
    get: function get() {
      return this._items.length;
    }
  }]);

  return History;
}();