// @flow

import type { CubeCoordsT } from '../../utils';

// base class
export class Node {

  name: string,
  coords: CubeCoordsT;

  constructor(name: string, coords: CubeCoordsT) {
    this.name = name;
    this.coords = coords;
  }

}
