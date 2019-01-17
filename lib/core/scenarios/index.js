'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scenarios = undefined;

var _fs = require('fs');

var _path = require('path');

var _toml = require('toml');

var _utils = require('../../utils');

// flowlint-next-line untyped-import:off
var scenarioDir = (0, _path.join)('assets', 'scenarios'); //  strict

var scenarioExt = '.toml';

function _parse(scenarioName) {

  var scenarioPath = (0, _path.join)(scenarioDir, scenarioName + scenarioExt);
  var scenarioBuf = (0, _fs.readFileSync)(scenarioPath);
  var scenarioStr = scenarioBuf.toString();

  return (0, _toml.parse)(scenarioStr);
}

var scenarios = exports.scenarios = {};
_utils.GAME_PARAM_SCENARIO_OPTIONS.forEach(function (name) {

  scenarios[name] = _parse(name);
});