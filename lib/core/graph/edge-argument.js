'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EdgeArgument = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; //  strict

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseIndex(name, s) {

  if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "' + name + '" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

  if (s.length === 0) throw new _utils.EdgeArgumentError('missing argument to "' + name + '" (undefined)');

  return parseInt(s);
}

function parseCost(game, s) {

  if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "cost" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

  var cost = {};

  (s || '').split(/;/).forEach(function (pair) {
    var _pair$split = pair.split(':'),
        _pair$split2 = _slicedToArray(_pair$split, 2),
        key = _pair$split2[0],
        value = _pair$split2[1];

    key = parseResource(game, key);

    if (cost[key] === undefined) cost[key] = 0;

    value = parseInt(value);

    if (isNaN(value)) throw new _utils.EdgeArgumentError('invalid resource quantity "' + value + '" ("' + s + '")');

    if (value < 1) throw new _utils.EdgeArgumentError('invalid resource quantity < 1 ("' + s + '")');

    cost[key] += value;
  });

  if (Object.keys(cost).length === 0) throw new _utils.EdgeArgumentError('must specify at least one resource ("' + s + '")');

  return cost;
}

function parseResource(game, s) {

  var allResources = Object.keys(game.board.scenario.resources);

  if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "resource" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

  if (allResources.indexOf(s) < 0) throw new _utils.EdgeArgumentError('unrecognized resource name "' + s + '"');

  return s;
}

function costToString(cost) {
  return _underscore2.default.map(cost, function (num, resource) {
    return resource + ':' + num;
  }).join(';');
}

var EdgeArgument = exports.EdgeArgument = function () {
  function EdgeArgument(type) {
    _classCallCheck(this, EdgeArgument);

    this.type = type;
  }

  _createClass(EdgeArgument, [{
    key: 'toString',
    value: function toString() {

      var s = void 0;

      switch (this.type) {

        case 'cost':
          return costToString(this.getCost());

        case 'diceroll':
          return this.getDiceroll() + '';

        case 'hex':
          return this.getHex().num + '';

        case 'junc':
          return this.getJunc().num + '';

        case 'null':
          return 'null';

        case 'participant':
          return this.getParticipant().num + '';

        case 'resource':
          return this.values[0];

        case 'resource resource':
          return this.values.slice(0, 2).join(' ');

        case 'road':
          return this.getRoad().num + '';

        case 'road road':
          return this.getRoads().map(function (road) {
            return road.num;
          }).join(' ');

        case 'trade':

          var trade = this.values[0];

          return [trade.from.participant.num + '', costToString(trade.from.cards), trade.with.participants.map(function (participant) {
            return participant.num + '';
          }).join(';'), costToString(trade.with.cards)].join(' ');

        default:
          throw new _utils.CatonlineError('unexpected EdgeArgumentType "' + this.type + '"');

      }
    }
  }, {
    key: 'getCost',
    value: function getCost() {

      if (this.type !== 'cost') throw new _utils.CatonlineError('cannot call getCost() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getDiceroll',
    value: function getDiceroll() {

      if (this.type !== 'diceroll') throw new _utils.CatonlineError('cannot call getDiceroll for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getHex',
    value: function getHex() {

      if (this.type !== 'hex') throw new _utils.CatonlineError('cannot call getHex() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getJunc',
    value: function getJunc() {

      if (this.type !== 'junc') throw new _utils.CatonlineError('cannot call getJunc() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getParticipant',
    value: function getParticipant() {

      if (this.type !== 'participant') throw new _utils.CatonlineError('cannot call getParticipant() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getResourceName',
    value: function getResourceName() {

      if (this.type !== 'resource') throw new _utils.CatonlineError('cannot call getResourceName() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getResourceNames',
    value: function getResourceNames() {

      if (this.type !== 'resource resource') throw new _utils.CatonlineError('cannot call getResourceNames() for type "' + this.type + '"');

      return this.values.slice(0, 2);
    }
  }, {
    key: 'getRoad',
    value: function getRoad() {

      if (this.type !== 'road') throw new _utils.CatonlineError('cannot call getRoad() for type "' + this.type + '"');

      return this.values[0];
    }
  }, {
    key: 'getRoads',
    value: function getRoads() {

      if (this.type !== 'road road') throw new _utils.CatonlineError('cannot call getRoads() for type "' + this.type + '"');

      return this.values.slice(0, 2);
    }
  }, {
    key: 'getTrade',
    value: function getTrade() {

      if (this.type !== 'trade') throw new _utils.CatonlineError('cannot call getTrade() for type "' + this.type + '"');

      return this.values[0];
    }
  }], [{
    key: 'fromString',
    value: function fromString(type, s, game) {
      var arg = new EdgeArgument(type);

      var i = void 0;

      switch (type) {

        case 'cost':
          var cost = parseCost(game, s);
          arg.values = [cost];
          break;

        case 'diceroll':

          i = parseIndex('diceroll', s);

          // $TODO
          // if (this.DEBUG_MODE) {

          if (isNaN(i)) throw new _utils.EdgeArgumentError('cannot roll "' + i + '" ("' + (s || '') + '")');

          if (i < 2) throw new _utils.EdgeArgumentError('cannot roll less than 2 ("' + (s || '') + '")');

          if (i > 12) throw new _utils.EdgeArgumentError('cannot roll greater than 12 ("' + (s || '') + '")');

          arg.values = [i];

          // } else {
          //    throw new CatonlineError(`You can only do this in DEBUG_MODE`);
          // }

          break;

        case 'hex':

          i = parseIndex('hex', s) + '';
          var hex = game.board.hexes[i];
          if (!hex) throw new _utils.EdgeArgumentError('cannot get Hex at "' + (s || '') + '"');

          arg.values = [hex];
          break;

        case 'junc':

          i = parseIndex('junc', s) + '';
          var junc = game.board.juncs[i];
          if (!junc) throw new _utils.EdgeArgumentError('cannot get Junc at "' + (s || '') + '"');

          arg.values = [junc];
          break;

        case 'null':
          arg.values = [];
          break;

        case 'participant':

          i = parseIndex('participant', s);

          var participant = game.participants[i];
          if (!participant) throw new _utils.EdgeArgumentError('cannot get Participant at "' + (s || '') + '")');

          arg.values = [participant];
          break;

        case 'resource':
          var r = parseResource(game, s);
          arg.values = [r];
          break;

        case 'resource resource':

          if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "resource resource" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

          arg.values = s.split(/\s/).map(function (r) {
            return parseResource(game, r);
          });
          break;

        case 'road':

          i = parseIndex('road', s) + '';
          var road = game.board.roads[i];
          if (!road) throw new _utils.EdgeArgumentError('cannot get Road at "' + (s || '') + '"');

          arg.values = [road];
          break;

        case 'road road':

          if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "road road" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

          var slice = s.split(/\s/);
          if (slice.length !== 2) throw new _utils.EdgeArgumentError('invalid argument number to "road road" ("' + s + '")');

          arg.values = slice.map(function (i) {

            var road = game.board.roads[i];
            if (!road) throw new _utils.EdgeArgumentError('cannot get Road at "' + s + '"');

            return road;
          });
          break;

        case 'trade':

          if (typeof s !== 'string') throw new _utils.EdgeArgumentError('invalid argument type to "trade" ("' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)) + '")');

          var words = s.split(/\s/);

          if (words.length !== 4) throw new _utils.EdgeArgumentError('too few arguments to "trade" ("' + s + '")');

          var _words = _slicedToArray(words, 4),
              fromP = _words[0],
              fromC = _words[1],
              withP = _words[2],
              withC = _words[3];

          i = parseInt(words[0]);
          fromP = game.participants[i];
          if (!fromP) throw new _utils.EdgeArgumentError('cannot get Participant at "' + i + '")');

          fromC = parseCost(game, fromC);

          withP = withP.split(';').map(function (i) {

            var p = parseIndex('participant', i);
            var participant = game.participants[p];
            if (!participant) throw new _utils.EdgeArgumentError('cannot get Participant at "' + i + '"');

            return participant;
          });

          withC = parseCost(game, withC);

          var trade = {
            from: { participant: fromP, cards: fromC },
            with: { participants: withP, cards: withC }
          };

          arg.values = [trade];
          break;

        default:
          throw new _utils.CatonlineError('unexpected EdgeArgumentType "' + type + '"');
      }

      return arg;
    }
  }]);

  return EdgeArgument;
}();