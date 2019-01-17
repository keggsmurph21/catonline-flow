// @flow strict

import type {

  CubeCoordsT,
  JuncRenderT,
  JuncSerialT,
  Participant,

} from '../../utils';
import _ from 'underscore';
import { CatonlineError, Serializable } from '../../utils';
import { Hex } from './hex';
import { BoardNode } from './board-node';
import { Port } from './port';
import { Road } from './road';

export class Junc extends BoardNode implements Serializable {

  id: string;
  num: number;

  port: Port;
  owner: Participant;
  isSettleable: boolean;
  isCity: boolean;

  constructor(num: number, coords: CubeCoordsT) {

    super('Junc', coords);

    this.id = 'h' + num;
    this.num = num;

    this.juncs = {};
    this.hexes = {};
    this.roads = {};

    this.isSettleable = true;
    this.isCity = false;

  }

  serialize(): JuncSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: JuncSerialT): Junc {
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

  getNeighbors(): Set<Junc> {

    let neighbors = new Set();

    _.each(this.roads, (road: Road,) => {
      if (road)
        _.each(road.juncs, (junc: Junc,) => {
          if (junc)
            neighbors.add(junc);
        });
    });

    neighbors.delete(this);
    return neighbors;

  }

  /*
  render(): JuncRenderT {

    const coords = this.getRenderedCoords();

    return {
      cx: coords.x,
      cy: coords.y,
    };

  }
  */

}
