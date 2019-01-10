'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cartesianToCube = cartesianToCube;
exports.cartesianToRendered = cartesianToRendered;
exports.cubeToCartesian = cubeToCartesian;
exports.cubeToRendered = cubeToRendered;
exports.pointsArrayToPath = pointsArrayToPath;
exports.pointsArrayToString = pointsArrayToString;
exports.round = round;
exports.thin = thin;
exports.getOffsets = getOffsets;
exports.getRandomInt = getRandomInt;
exports.getRandomChoice = getRandomChoice;
exports.shuffle = shuffle;

var _consts = require('./consts');

var _errors = require('./errors');

function cartesianToCube(coords) {

  throw new _errors.CatonlineError('not implemented');
}

function cartesianToRendered(coords) {

  return {
    type: 'rendered',
    x: coords.x * Math.cos(Math.PI / 6),
    y: coords.y * 1.5
  };
}

function cubeToCartesian(coords) {

  return {
    type: 'cartesian',
    x: coords.x - coords.y,
    y: coords.z
  };
}

function cubeToRendered(coords) {

  var cartesianCoords = cubeToCartesian(coords);
  return cartesianToRendered(cartesianCoords);
}

function pointsArrayToPath(arr) {
  return arr.map(function (point, i) {
    return (i ? 'L ' : 'M ') + point.x + ',' + point.y;
  }).join(' ');
}

function pointsArrayToString(arr) {
  return arr.map(function (point) {
    return point.x + ',' + point.y;
  }).join(' ');
}

function round(num) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  var exp = Math.pow(10, places);
  return Math.round(num * exp) / exp;
}

function thin(arg) {
  return !!arg ? arg : undefined;
}

function getOffsets(parity) {
  var factor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;


  var offsets = {};
  for (var i = 1; i <= 12; i++) {
    if (!!(i % 2) == (parity === 'odd')) {
      offsets[i] = {
        x: _consts.offsetsByClockPosition[i].x * factor,
        y: _consts.offsetsByClockPosition[i].y * factor,
        z: _consts.offsetsByClockPosition[i].z * factor
      };
    }
  }

  return offsets;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChoice(arr) {

  var i = getRandomInt(0, arr.length - 1);
  return arr[i];
}

function shuffle(arr) {

  // in-place

  for (var i = arr.length - 1; i > 0; i--) {
    var j = getRandomInt(0, i);
    var _tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = _tmp;
  }
}