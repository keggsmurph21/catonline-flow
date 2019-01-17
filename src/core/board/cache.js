// @flow strict

import type {

  CubeCoordsT,
  Hex,
  Junc,
  Road,

} from '../../utils';
import { round } from '../../utils';

export class CoordinateCache {

  _hexes: { [string]: Hex };
  _juncs: { [string]: Junc };
  _roads: { [string]: Road };

  constructor() {
    this._hexes = {};
    this._juncs = {};
    this._roads = {};
  }

  hash(coords: CubeCoordsT): string {

    const x = round(coords.x, 2);
    const y = round(coords.y, 2);
    const z = round(coords.z, 2);

    return `${x}_${y}_${z}`;

  }

  getHex(coords: CubeCoordsT): Hex {
    const key = this.hash(coords);
    return this._hexes[key];
  }

  hasHex(coords: CubeCoordsT): boolean {
    return !!this.getHex(coords);
  }

  setHex(coords: CubeCoordsT, hex: Hex): void {
    const key = this.hash(coords);
    this._hexes[key] = hex;
  }

  getJunc(coords: CubeCoordsT): Junc {
    const key = this.hash(coords);
    return this._juncs[key];
  }

  hasJunc(coords: CubeCoordsT): boolean {
    return !!this.getJunc(coords);
  }

  setJunc(coords: CubeCoordsT, junc: Junc): void {
    const key = this.hash(coords);
    this._juncs[key] = junc;
  }

  getRoad(coords: CubeCoordsT): Road {
    const key = this.hash(coords);
    return this._roads[key];
  }

  hasRoad(coords: CubeCoordsT): boolean {
    return !!this.getRoad(coords);
  }

  setRoad(coords: CubeCoordsT, road: Road): void {
    const key = this.hash(coords);
    this._roads[key] = road;
  }

}
