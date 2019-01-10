'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = exports.boards = undefined;

var _board = require('./board');

Object.defineProperty(exports, 'Board', {
  enumerable: true,
  get: function get() {
    return _board.Board;
  }
});

var _scenarios = require('./scenarios');

Object.keys(_scenarios).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scenarios[key];
    }
  });
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boards = exports.boards = {};

_underscore2.default.each(_scenarios.scenarios, function (scenario) {
  boards[scenario.name] = new _board.Board(scenario);
});