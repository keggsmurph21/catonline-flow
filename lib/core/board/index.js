'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('../../utils');

var _cache = require('./cache');

var _boardNode = require('./board-node');

var _hex = require('./hex');

var _junc = require('./junc');

var _port = require('./port');

var _road = require('./road');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = exports.Board = function () {
  function Board(scenario) {
    var _this = this;

    _classCallCheck(this, Board);

    this.scenario = scenario;
    this.hexes = {};
    this.juncs = {};
    this.ports = {};
    this.roads = {};

    // build structure

    // set up helpers
    var cache = new _cache.CoordinateCache();
    var counters = {
      hexes: 0,
      juncs: 0,
      ports: 0,
      roads: 0
    };

    // create hexes
    scenario.topology.forEach(function (params) {

      var hex = new _hex.Hex(counters.hexes, params, scenario);

      _this.hexes[counters.hexes] = hex;
      cache.set('h', hex.coords, hex);

      ++counters.hexes;
    });

    // create ports
    scenario.ports.forEach(function (params) {

      var port = new _port.Port(counters.ports, params, scenario);

      _this.ports[counters.ports] = port;

      ++counters.ports;
    });

    // connect hexes to hexes, juncs, and roads
    _underscore2.default.each(this.hexes, function (hex) {

      _underscore2.default.each((0, _utils.getOffsets)('odd', 1), function (offset, clockPos) {

        var coords = hex.offset(offset);
        var neighborHex = cache.get('h', coords);

        hex.hexes[clockPos] = neighborHex;
      });

      _underscore2.default.each((0, _utils.getOffsets)('even', 1 / 3), function (offset, clockPos) {

        var coords = hex.offset(offset);
        var junc = void 0;

        if (cache.has('j', coords)) {

          junc = cache.get('j', coords);
        } else {

          junc = new _junc.Junc(counters.juncs, coords);
          _this.juncs[counters.juncs] = junc;
          cache.set('j', coords, junc);

          ++counters.juncs;
        }

        hex.juncs[clockPos] = junc;
      });

      _underscore2.default.each((0, _utils.getOffsets)('odd', 1 / 2), function (offset, clockPos) {

        var coords = hex.offset(offset);
        var road = void 0;

        if (cache.has('r', coords)) {

          road = cache.get('r', coords);
        } else {

          road = new _road.Road(counters.roads, coords);
          _this.roads[counters.roads] = road;
          cache.set('r', coords, road);

          ++counters.roads;
        }

        hex.roads[clockPos] = road;
      });
    });

    // connect juncs to juncs, hexes, and roads
    _underscore2.default.each(this.juncs, function (junc) {

      _underscore2.default.each((0, _utils.getOffsets)('even', 1 / 3), function (offset, clockPos) {

        var coords = junc.offset(offset);

        var neighborJunc = cache.get('j', coords);
        junc.juncs[clockPos] = neighborJunc;

        var hex = cache.get('h', coords);
        junc.hexes[clockPos] = hex;
      });

      _underscore2.default.each((0, _utils.getOffsets)('even', 1 / 6), function (offset, clockPos) {

        var coords = junc.offset(offset);
        var road = cache.get('r', coords);
        junc.roads[clockPos] = road;
      });
    });

    // set port coords and connect port to underlying road
    _underscore2.default.each(this.ports, function (port) {
      port.bindToRoad(cache);
    });

    // connect roads to roads, hexes, and juncs
    _underscore2.default.each(this.roads, function (road) {

      _underscore2.default.each((0, _utils.getOffsets)('odd', 1 / 2), function (offset, clockPos) {

        var coords = road.offset(offset);

        var neighborRoad = cache.get('r', coords);
        road.roads[clockPos] = neighborRoad;

        var hex = cache.get('h', coords);
        road.hexes[clockPos] = hex;
      });

      _underscore2.default.each((0, _utils.getOffsets)('even', 1 / 6), function (offset, clockPos) {

        var coords = road.offset(offset);
        var junc = cache.get('j', coords);
        road.juncs[clockPos] = junc;
      });
    });
  }

  _createClass(Board, [{
    key: 'getById',
    value: function getById() {}
  }, {
    key: 'getHexById',
    value: function getHexById() {}
  }, {
    key: 'getJuncById',
    value: function getJuncById() {}
  }, {
    key: 'getRoadById',
    value: function getRoadById() {}

    /*
    toSVG() {
       const $ = cheerio.load(bootstrapSVG),
        TILE_CHIP_RADIUS = 0.55,
        TILE_TEXT_OFFSET_Y = "-0.13em",
        TILE_CHIP_DOTS_OFFSET_Y = 0.35,
        TILE_CHIP_DOTS_OFFSET_X = 0.075,
        TILE_CHIP_DOTS_RADIUS = 0.05;
       $('svg')
        .attr('viewBox', '-2 -1.5 15 12')
       _.each(this.hexes, hex => {
        $('svg').append((() => {
           const rendered = hex.render();
          const $ = cheerio.load(`<g class="tile-group clickable"> type="title" id="tile_${hex.id}" num="${hex.id}">`);
           $('.tile-group')
            .append(`<polygon points="${rendered.points}" style="fill:#2d2;">`)
            .append('<g class="tile-chip">')
            .append('<title>');
           $('.tile-chip')
            .append(`<circle class="tile-chip-circle" cx="${rendered.cx}" cy="${rendered.cy}" r="${TILE_CHIP_RADIUS}" style="fill:#ccc;">`)
            .append(`<text x="${rendered.cx}" y="${rendered.cy}" dy="${TILE_TEXT_OFFSET_Y}">`)
            .append('<g class="tile-chip-dots">')
           $('.tile-chip text').css('font-size', '0.1em').css('color', 'aqua').text(rendered.roll);
           $('.tile-chip-dots')
            .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-4}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-3}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-2}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9 chip-dot-3 chip-dot-11" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-1}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10 chip-dot-2 chip-dot-12" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*0}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9 chip-dot-3 chip-dot-11" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*1}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*2}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*3}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
            .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*4}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`);
           return $('.tile-group');
         })());
      });
       _.each(this.ports, port => {
       });
       _.each(this.roads, road => {
        $('svg').append((() => {
           const rendered = road.render();
          const $ = cheerio.load(`<g class="road-group clickable" type="road" id="num_${road.id}" num="${road.id}">`);
           $('.road-group')
            .append(`<path d="${rendered.path}" style="stroke-width:0.1; stroke:#555;">`)
            .append('<title>');
           return $('.road-group');
         })());
      });
       _.each(this.juncs, junc => {
         const rendered = junc.render();
        $('svg').append(`<circle cx="${rendered.cx}" cy="${rendered.cy}" r="0.2">`);
       });
       return $.html();
     }
    */

  }]);

  return Board;
}();