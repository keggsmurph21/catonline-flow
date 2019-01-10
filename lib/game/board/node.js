'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Node = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// base class
var Node = function () {

  // overwrite these
  function Node(name, coords) {
    _classCallCheck(this, Node);

    this.name = name;
    this.coords = coords;
  }

  _createClass(Node, [{
    key: 'offset',
    value: function offset(_offset) {
      return {
        type: 'cube',
        x: this.coords.x + _offset.x,
        y: this.coords.y + _offset.y,
        z: this.coords.z + _offset.z
      };
    }
  }, {
    key: 'renderedCoords',
    get: function get() {
      return (0, _utils.cubeToRendered)(this.coords);
    }
  }]);

  return Node;
}();

exports.Node = Node;