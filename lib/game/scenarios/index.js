'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scenarios = undefined;

var _fs = require('fs');

var _path = require('path');

var _toml = require('toml');

var scenarioDir = 'assets/scenarios';

console.log((0, _path.resolve)(scenarioDir));

function _parse(scenarioName) {

  var scenarioPath = (0, _path.join)(scenarioDir, scenarioName);
  var scenarioBuf = (0, _fs.readFileSync)(scenarioPath);
  var scenarioStr = scenarioBuf.toString();

  return (0, _toml.parse)(scenarioStr);
}

var scenarios = exports.scenarios = {

  standard: _parse('standard.toml')
  /*
  function parse(filepath: string):
  const fs = require('fs'),
    toml = require('toml'),
    parser = require('./parser');
  
  function parse(filepath) {
    const contents = fs.readFileSync(filepath).toString();
    return toml.parse(contents);
  }
  
  module.exports = {
    standard: parse(__dirname + '/standard.toml')
  };
  */

};