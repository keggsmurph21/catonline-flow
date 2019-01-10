'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;

var _utils = require('../../utils');

var _scenarios = require('../scenarios');

function assertValidType(params, name, expected) {

  var value = params[name];

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== expected) throw new _utils.InvalidGameParamsError('Invalid game parameter value for "' + name + '": ' + ('expected type "' + expected + '" got "' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '"'));
}

function assertValidOption(params, name, choices) {

  var value = params[name];

  if (choices.indexOf(value) === -1) throw new _utils.InvalidGameParamsError('Invalid game parameter value for "' + name + '": ' + ('expected one of ["' + choices.join('","') + '"] got "' + value + '"'));
}

function assertValidRange(params, name, min, max) {

  var value = params[name];

  if (value < min) throw new _utils.InvalidGameParamsError('Invalid game parameter value for "' + name + '": ' + ('"' + value + '" less than minimum "' + min + '"'));

  if (value > max) throw new _utils.InvalidGameParamsError('Invalid game parameter value for "' + name + '": ' + ('"' + value + '" greater than maximum "' + max + '"'));
}

function validate(raw) {

  assertValidType(raw, 'isPublic', 'boolean');

  assertValidType(raw, 'scenario', 'string');
  assertValidOption(raw, 'scenario', _utils.GAME_PARAM_SCENARIO_OPTIONS);

  assertValidType(raw, 'portStyle', 'string');
  assertValidOption(raw, 'portStyle', _utils.GAME_PARAM_PORTSTYLE_OPTIONS);

  assertValidType(raw, 'tileStyle', 'string');
  assertValidOption(raw, 'tileStyle', _utils.GAME_PARAM_TILESTYLE_OPTIONS);

  assertValidType(raw, 'numComputers', 'number');
  assertValidRange(raw, 'numComputers', _utils.GAME_PARAM_NUMCOMPUTERS_MIN, _utils.GAME_PARAM_NUMCOMPUTERS_MAX);

  assertValidType(raw, 'numHumans', 'number');
  assertValidRange(raw, 'numHumans', _utils.GAME_PARAM_NUMHUMANS_MIN, _utils.GAME_PARAM_NUMHUMANS_MAX);

  assertValidType(raw, 'vpGoal', 'number');
  assertValidRange(raw, 'vpGoal', _utils.GAME_PARAM_VPGOAL_MIN, _utils.GAME_PARAM_VPGOAL_MAX);

  // extra check that is redundant as long as we keeps utils/consts consistent
  if (!(raw.scenario in _scenarios.scenarios)) {

    var msg = 'no scenario with name "' + raw.scenario + '"';
    throw new _utils.InvalidGameParamsError();
  }

  return {

    scenario: _scenarios.scenarios[raw.scenario],
    isPublic: raw.isPublic,
    portStyle: raw.portStyle,
    tileStyle: raw.tileStyle,
    numComputers: raw.numComputers,
    numHumans: raw.numHumans,
    vpGoal: raw.vpGoal

  };
}

var defaults = exports.defaults = {

  scenario: _utils.GAME_PARAM_SCENARIO_DEFAULT, // NB: this is a string!
  isPublic: _utils.GAME_PARAM_ISPUBLIC_DEFAULT,
  portStyle: _utils.GAME_PARAM_PORTSTYLE_DEFAULT,
  tileStyle: _utils.GAME_PARAM_TILESTYLE_DEFAULT,
  numComputers: _utils.GAME_PARAM_NUMCOMPUTERS_DEFAULT,
  numHumans: _utils.GAME_PARAM_NUMHUMANS_DEFAULT,
  vpGoal: _utils.GAME_PARAM_VPGOAL_DEFAULT

};