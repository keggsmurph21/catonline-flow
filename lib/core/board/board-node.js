'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoardNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// base class
//  strict

var BoardNode = function () {

  // overwrite these
  function BoardNode(name, coords) {
    _classCallCheck(this, BoardNode);

    this.name = name;
    this.coords = coords;
  }

  _createClass(BoardNode, [{
    key: 'offset',
    value: function offset(_offset) {
      return {
        x: this.coords.x + _offset.x,
        y: this.coords.y + _offset.y,
        z: this.coords.z + _offset.z
      };
    }
  }, {
    key: 'getRenderedCoords',
    value: function getRenderedCoords() {
      return (0, _utils.cubeToRendered)(this.coords);
    }
  }]);

  return BoardNode;
}();

exports.BoardNode = BoardNode;