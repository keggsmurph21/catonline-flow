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
exports.eachOffset = eachOffset;
exports.getOffsets = getOffsets;
exports.getRandomInt = getRandomInt;
exports.getRandomChoice = getRandomChoice;
exports.shuffle = shuffle;
exports.hashToHexColor = hashToHexColor;
exports.objectsMatch = objectsMatch;
exports.cubeDistance = cubeDistance;
exports.print = print;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _consts = require('./consts');

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict

function cartesianToCube(coords) {

  throw new _errors.CatonlineError('not implemented');
}

function cartesianToRendered(coords) {

  return {
    x: coords.x * Math.cos(Math.PI / 6),
    y: coords.y * 1.5
  };
}

function cubeToCartesian(coords) {

  return {
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
  // flowlint-next-line sketchy-null-mixed:off
  return !!arg ? arg : undefined;
}

function eachOffset(parity, factor, callback) {

  for (var i = 1; i <= 12; i++) {
    if (!!(i % 2) == (parity === 'odd')) {

      var _offset = {
        x: _consts.offsetsByClockPosition[i].x * factor,
        y: _consts.offsetsByClockPosition[i].y * factor,
        z: _consts.offsetsByClockPosition[i].z * factor
      };

      callback(_offset, '' + i); // cast to string
    }
  }
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

function hashToHexColor(str) {

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var _i = 0; _i < 3; _i++) {
    var value = hash >> _i * 8 & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

function objectsMatch(obj1, obj2) {
  return _underscore2.default.isMatch(obj1, obj2) && _underscore2.default.isMatch(obj2, obj1);
}

function cubeDistance(p, q) {
  return p.x - q.x + (p.y - q.y) + (p.z - q.z);
}

function print(b) {

  function frame(i) {
    var _i$getRenderedCoords = i.getRenderedCoords(),
        x = _i$getRenderedCoords.x,
        y = _i$getRenderedCoords.y;

    dims.minX = Math.min(x, dims.minX);
    dims.maxX = Math.max(x, dims.maxX);
    dims.minY = Math.min(y, dims.minY);
    dims.maxY = Math.max(y, dims.maxY);
  }

  function lock(x) {
    return round(x * 4 * width, 0);
  }

  function place(i) {
    var _i$getRenderedCoords2 = i.getRenderedCoords(),
        x = _i$getRenderedCoords2.x,
        y = _i$getRenderedCoords2.y;

    x = lock(x) - dims.minX;
    y = lock(y) - dims.minY;

    if (m[x][y] !== ' '.repeat(width)) throw new Error('overlap');

    m[x][y] = pad(i.id);
  }

  function pad(num) {
    return (num + ' '.repeat(width)).slice(0, width);
  }

  var width = 3;

  var dims = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  };

  _underscore2.default.each(b.hexes, frame);
  _underscore2.default.each(b.juncs, frame);
  _underscore2.default.each(b.roads, frame);

  dims.minX = lock(dims.minX);
  dims.maxX = lock(dims.maxX);
  dims.minY = lock(dims.minY);
  dims.maxY = lock(dims.maxY);

  var m = [];
  for (var i = dims.minX; i <= dims.maxX; i++) {
    var n = [];
    for (var j = dims.minY; j <= dims.maxY; j++) {
      n.push(' '.repeat(width));
    }
    m.push(n);
  }

  try {

    _underscore2.default.each(b.hexes, place);
    _underscore2.default.each(b.juncs, place);
    _underscore2.default.each(b.roads, place);
  } catch (e) {
    console.log(dims);
    throw e;
  }

  return m.map(function (n) {
    return n.join('');
  }).join('\n');
}