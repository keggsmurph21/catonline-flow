'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resource = exports.Resource = function Resource(name) {
  _classCallCheck(this, Resource);

  this.name = name;

  if (name === 'desert' || name === 'ocean') {
    this.yields = false;
  } else {
    this.yields = true;
  }
};