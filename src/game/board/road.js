// @ flow

import type { CubeCoordsT } from '../../utils';
import { CatonlineError, pointsArrayToPath, thin } from '../../utils';
import { Hex } from './hex';
import { Junc } from './junc';
import { Node } from './node';

export class Road extends Node {

  id: string;
  num: number;

  roads: { [number]: Road };
  hexes: { [number]: Hex };
  juncs: { [number]: Junc };

  constructor(num: number, coords: CubeCoordsT) {

    super('Road', coords);

    this.id = 'r' + num;
    this.num = num;

    this.roads = {};
    this.hexes = {};
    this.juncs = {};

  }

  isOcean(): boolean {

    let isOcean: boolean = true;
    _.each(this.hexes, hex => {
      if (hex && !hex.isOcean)
        isOcean = false;
    });

    return isOcean;
  }

  render(): RoadRenderT {

    const points: Junc[] = _
      .map(this.juncs, junc => junc
        ? junc.renderedCoords
        : null
      )
      .filter(thin);
    const path = pointsArrayToPath(points);

    return { path };
  }
}
