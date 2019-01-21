// @flow strict

import type {

  CubeCoordsT,
  Hex,
  Junc,
  Participant,
  RenderedCoordsT,
  RoadRenderT,
  RoadSerialT,

} from '../../utils';
import _ from 'underscore';
import { CatonlineError, pointsArrayToPath, Serializable, thin } from '../../utils';
import { BoardNode } from './board-node';

export class Road extends BoardNode implements Serializable {

  id: string;
  num: number;
  owner: Participant;

  constructor(num: number, coords: CubeCoordsT) {

    super('Road', coords);

    this.id = 'r' + num;
    this.num = num;

    this.roads = {};
    this.hexes = {};
    this.juncs = {};

  }

  serialize(): RoadSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: RoadSerialT): Road {
    throw new CatonlineError('not implemented');
  }

  isOcean(): boolean {

    let isOcean: boolean = true;
    _.each(this.hexes, hex => {
      if (hex && !hex.isOcean)
        isOcean = false;
    });

    return isOcean;
  }

  /*
  render(): RoadRenderT {

    const points: RenderedCoordsT[] = _
      .map(this.juncs, junc => junc
        ? junc.getRenderedCoords()
        : null
      )
      .filter(thin);
    const path = pointsArrayToPath(points);

    return { path };
  }
  */
}
