'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scenarios = undefined;

var _fs = require('fs');

var _path = require('path');

var _toml = require('toml');

var scenarioDir = (0, _path.join)('assets', 'scenarios');

console.log((0, _path.resolve)(scenarioDir));

function _parse(scenarioName) {

  var scenarioPath = (0, _path.join)(scenarioDir, scenarioName);
  var scenarioBuf = (0, _fs.readFileSync)(scenarioPath);
  var scenarioStr = scenarioBuf.toString();

  return (0, _toml.parse)(scenarioStr);
}

var scenarios = exports.scenarios = {

  standard: _parse('standard.toml')

};