'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vertex = exports.Edge = exports.Graph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _edge = require('./edge');

Object.defineProperty(exports, 'Edge', {
  enumerable: true,
  get: function get() {
    return _edge.Edge;
  }
});

var _vertex = require('./vertex');

Object.defineProperty(exports, 'Vertex', {
  enumerable: true,
  get: function get() {
    return _vertex.Vertex;
  }
});

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = exports.Graph = function () {
  function Graph(game) {
    var _this = this;

    _classCallCheck(this, Graph);

    this.game = game;

    this.vertices = {};
    _utils.VERTEX_NAMES.forEach(function (name) {
      _this.vertices[name] = new _vertex.Vertex(name);
    });

    this.edges = {};
    _utils.EDGE_NAMES.forEach(function (name) {
      _this.edges[name] = new _edge.Edge(name);
    });

    // TODO: this should be in scenario also?
    this.INITIAL_VERTEX = this.getVertex('_v_end_turn');
  }

  _createClass(Graph, [{
    key: 'getAdjacents',
    value: function getAdjacents(participant) {
      var _this2 = this;

      return participant.vertex.edges.map(function (name) {
        return _this2.getEdge(name);
      }).filter(function (edge) {
        return edge.check(_this2.game, participant);
      });
    }
  }, {
    key: 'hasEdge',
    value: function hasEdge(name) {
      return !!this.edges[name];
    }
  }, {
    key: 'getEdge',
    value: function getEdge(name) {

      if (!this.hasEdge(name)) throw new _utils.CatonlineError('cannot get vertex with name "' + name + '"');

      return this.edges[name];
    }
  }, {
    key: 'hasVertex',
    value: function hasVertex(name) {
      return !!this.vertices[name];
    }
  }, {
    key: 'getVertex',
    value: function getVertex(name) {

      if (!this.hasVertex(name)) throw new _utils.CatonlineError('cannot get vertex with name "' + name + '"');

      return this.vertices[name];
    }
  }]);

  return Graph;
}();