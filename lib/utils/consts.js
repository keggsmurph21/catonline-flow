'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var offsetsByClockPosition = exports.offsetsByClockPosition = {
  '1': { x: 1, y: 0, z: -1 },
  '2': { x: 2, y: -1, z: -1 },
  '3': { x: 1, y: -1, z: 0 },
  '4': { x: 1, y: -2, z: 1 },
  '5': { x: 0, y: -1, z: 1 },
  '6': { x: -1, y: -1, z: 2 },
  '7': { x: -1, y: 0, z: 1 },
  '8': { x: -2, y: 1, z: 1 },
  '9': { x: -1, y: 1, z: 0 },
  '10': { x: -1, y: 2, z: -1 },
  '11': { x: 0, y: 1, z: -1 },
  '12': { x: 1, y: 1, z: -2 }
};

var GAME_PARAM_ISPUBLIC_DEFAULT = exports.GAME_PARAM_ISPUBLIC_DEFAULT = true;

var GAME_PARAM_SCENARIO_OPTIONS = exports.GAME_PARAM_SCENARIO_OPTIONS = ['standard'];
var GAME_PARAM_SCENARIO_DEFAULT = exports.GAME_PARAM_SCENARIO_DEFAULT = GAME_PARAM_SCENARIO_OPTIONS[0];

var GAME_PARAM_PORTSTYLE_OPTIONS = exports.GAME_PARAM_PORTSTYLE_OPTIONS = ['fixed', 'random'];
var GAME_PARAM_PORTSTYLE_DEFAULT = exports.GAME_PARAM_PORTSTYLE_DEFAULT = GAME_PARAM_PORTSTYLE_OPTIONS[0];

var GAME_PARAM_TILESTYLE_OPTIONS = exports.GAME_PARAM_TILESTYLE_OPTIONS = ['fixed', 'random'];
var GAME_PARAM_TILESTYLE_DEFAULT = exports.GAME_PARAM_TILESTYLE_DEFAULT = GAME_PARAM_TILESTYLE_OPTIONS[1];

var GAME_PARAM_NUMCOMPUTERS_MIN = exports.GAME_PARAM_NUMCOMPUTERS_MIN = 0;
var GAME_PARAM_NUMCOMPUTERS_MAX = exports.GAME_PARAM_NUMCOMPUTERS_MAX = 0;
var GAME_PARAM_NUMCOMPUTERS_DEFAULT = exports.GAME_PARAM_NUMCOMPUTERS_DEFAULT = 0;

var GAME_PARAM_NUMHUMANS_MIN = exports.GAME_PARAM_NUMHUMANS_MIN = 0;
var GAME_PARAM_NUMHUMANS_MAX = exports.GAME_PARAM_NUMHUMANS_MAX = 5;
var GAME_PARAM_NUMHUMANS_DEFAULT = exports.GAME_PARAM_NUMHUMANS_DEFAULT = 4;

var GAME_PARAM_VPGOAL_MIN = exports.GAME_PARAM_VPGOAL_MIN = 8;
var GAME_PARAM_VPGOAL_MAX = exports.GAME_PARAM_VPGOAL_MAX = 12;
var GAME_PARAM_VPGOAL_DEFAULT = exports.GAME_PARAM_VPGOAL_DEFAULT = 10;