// @flow

import type { CubeCoordsT, ScenarioT } from '../../utils';
import { CatonlineError, round } from '../../utils';
import { Node } from './node';
import { Hex } from './hex';
import { Junc } from './junc';
import { Port } from './port';
import { Road } from './road';

class CoordinateCache {

  _items: { [string]: Node };

  constructor() {
    this._items = {};
  }

  hash(prefix: string, coords: CubeCoordsT): string {

    const x = round(coords.x, 2);
    const y = round(coords.y, 2);
    const z = round(coords.z, 2);

    return `${prefix}_${x}_${y}_${z}`;

  }

  get(prefix: string, coords: CubeCoordsT): ?Node {

    const key = this.hash(prefix, coords);
    return this._items[key] || null;

  }

  set(prefix: string, coords: CubeCoordsT, node: Node) {

    const key = this.hash(prefix, coords);
    this._items[key] = node;

  }

}

export class Board {

  scenario: ScenarioT;
  cache: CoordinateCache;

  hexes: { [number]: Hex };
  juncs: Junc[];
  ports: Port[];
  roads: Road[];

  constructor(scenario: ScenarioT) {

    this.scenario = scenario;
    this.hexes = {};
    this.juncs = {};
    this.ports = {};
    this.roads = {};

    // build structure

    this.cache = new CoordinateCache();

    var counters = {
      hexes: 0,
      juncs: 0,
      ports: 0,
      roads: 0,
    };

    scenario.topology.forEach(params => {

      const hex = new Hex(counters.hexes, params, scenario);

      this.hexes[counters.hexes] = hex;
      this.cache.set('h', hex.coords, hex);

      ++counters.hexes;

    });

    scenario.ports.forEach(params => {

      const port = new Port(counters.ports, params, scenario);

      this.ports[counters.ports] = port;

      ++counters.ports;

    });

  }

  getById() {

  }

  getHexById() {

  }

  getJuncById() {

  }

  getRoadById() {

  }

}
