// @flow

import type { Hex } from './hex';
import type { Junc } from './junc';
import type { Port } from './port';
import type { Road } from './road';
import type { CubeCoordsT, RenderedCoordsT } from '../../utils';
import { cubeToRendered } from '../../utils';

// base class
export class BoardNode {

  name: string;
  coords: CubeCoordsT;

  // overwrite these
  hexes: { [number]: Hex };
  juncs: { [number]: Junc };
  ports: { [number]: Port };
  roads: { [number]: Road };

  constructor(name: string, coords: CubeCoordsT) {
    this.name = name;
    this.coords = coords;
  }

  offset(offset: CubeCoordsT): CubeCoordsT {
    return {
      type: 'cube',
      x: this.coords.x + offset.x,
      y: this.coords.y + offset.y,
      z: this.coords.z + offset.z,
    }
  }

  getRenderedCoords(): RenderedCoordsT {
    return cubeToRendered(this.coords);
  }

}
