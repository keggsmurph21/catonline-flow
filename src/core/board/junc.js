// @flow strict

import _ from 'underscore';
import type { CubeCoordsT, JuncRenderT, JuncSerialT } from '../../utils';
import { CatonlineError, Serializable } from '../../utils';
import { Hex } from './hex';
import { BoardNode } from './board-node';
import { Port } from './port';
import { Road } from './road';
import { Player } from '../player';

export class Junc extends BoardNode implements Serializable {

  id: string;
  num: number;

  port: Port;
  owner: Player;
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
