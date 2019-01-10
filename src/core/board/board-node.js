// @flow

import type { CubeCoordsT, RenderedCoordsT } from '../../utils';
import { cubeToRendered } from '../../utils';

// base class
export class BoardNode {

  name: string;
  coords: CubeCoordsT;

  // overwrite these
  hexes: { [number]: any };
  juncs: { [number]: any };
  ports: { [number]: any };
  roads: { [number]: any };

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

  get renderedCoords(): RenderedCoordsT {
    return cubeToRendered(this.coords);
  }

}
