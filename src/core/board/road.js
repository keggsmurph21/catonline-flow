// @ flow

import type { CubeCoordsT } from '../../utils';
import { CatonlineError, pointsArrayToPath, RoadSerialT, Serializable, thin } from '../../utils';
import { Hex } from './hex';
import { Junc } from './junc';
import { BoardNode } from './board-node';
import { Player } from '../player';

export class Road extends BoardNode implements Serializable {

  id: string;
  num: number;

  roads: { [number]: Road };
  hexes: { [number]: Hex };
  juncs: { [number]: Junc };

  owner: Player;

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
