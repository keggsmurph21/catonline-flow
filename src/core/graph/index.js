// @flow

import type { Game } from '../game';
import type { ScenarioT } from '../../utils';
import { CatonlineError, EDGE_NAMES, VERTEX_NAMES } from '../../utils';
import { Edge } from './edge';
import { Vertex } from './vertex';

export class Graph {

  scenario: ScenarioT;

  vertices: { [string]: Vertex };
  edges: { [string]: Edge };

  INITIAL_VERTEX: Vertex;

  constructor(scenario: ScenarioT) {

    this.scenario = scenario;

    this.vertices = {};
    VERTEX_NAMES.forEach(name => {
      this.vertices[name] = new Vertex(name);
    });

    this.edges = {};
    EDGE_NAMES.forEach(name => {
      this.edges[name] = new Edge(name);
    });

    // TODO: this should be in scenario also?
    this.INITIAL_VERTEX = this.getVertex('_v_end_turn');

  }

  getAdjacents(game: Game, vertex: Vertex): Edge[] {
    return vertex.edges
      .map(name => this.getEdge(name))
      .filter(edge => edge.check(game));
  }

  hasEdge(name: string): boolean {
    return !!this.edges[name];
  }

  getEdge(name: string): Edge {

    if (!this.hasEdge(name))
      throw new CatonlineError(`cannot get vertex with name "${name}"`);

    return this.edges[name];

  }

  hasVertex(name: string): boolean {
    return !!this.vertices[name];
  }

  getVertex(name: string): Vertex {

    if (!this.hasVertex(name))
      throw new CatonlineError(`cannot get vertex with name "${name}"`);

    return this.vertices[name];

  }

}

export { Edge } from './edge';
export { Vertex } from './vertex';
