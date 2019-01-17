// @flow strict

import type {

  CubeCoordsT,
  Hex,
  Junc,
  Port,
  RenderedCoordsT,
  Road,
  
} from '../../utils';
import { cubeToRendered } from '../../utils';

// base class
export class BoardNode {

  name: string;
  coords: CubeCoordsT;

  // overwrite these
  hexes: { [string]: Hex };
  juncs: { [string]: Junc };
  ports: { [string]: Port };
  roads: { [string]: Road };

  constructor(name: string, coords: CubeCoordsT) {
    this.name = name;
    this.coords = coords;
  }

  offset(offset: CubeCoordsT): CubeCoordsT {
    return {
      x: this.coords.x + offset.x,
      y: this.coords.y + offset.y,
      z: this.coords.z + offset.z,
    }
  }

  getRenderedCoords(): RenderedCoordsT {
    return cubeToRendered(this.coords);
  }

}
