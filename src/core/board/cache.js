// @flow

import type { CubeCoordsT } from '../../utils';
import { round } from '../../utils';
import { BoardNode } from './board-node';

export class CoordinateCache {

  _items: { [string]: BoardNode };

  constructor() {
    this._items = {};
  }

  hash(prefix: string, coords: CubeCoordsT): string {

    const x = round(coords.x, 2);
    const y = round(coords.y, 2);
    const z = round(coords.z, 2);

    return `${prefix}_${x}_${y}_${z}`;

  }

  has(prefix: string, coords: CubeCoordsT): boolean {
    return !!this.get(prefix, coords);
  }

  get(prefix: string, coords: CubeCoordsT): BoardNode {

    const key = this.hash(prefix, coords);
    return this._items[key];

  }

  set(prefix: string, coords: CubeCoordsT, node: BoardNode) {

    const key = this.hash(prefix, coords);
    this._items[key] = node;

  }

}
