// @flow

import _ from 'underscore';
import type { CubeCoordsT, JuncRenderT } from '../../utils';
import { CatonlineError } from '../../utils';
import { Hex } from './hex';
import { BoardNode } from './board-node';
import { Port } from './port';
import { Road } from './road';
import { Player } from '../player';

export class Junc extends BoardNode {

  id: string;
  num: number;

  juncs: { [number]: Junc };
  hexes: { [number]: Hex };
  roads: { [number]: Road };

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

  isOcean(): boolean {

    let isOcean: boolean = true;
    _.each(this.hexes, hex => {
      if (hex && !hex.isOcean)
        isOcean = false;
    });

    return isOcean;
  }

  render(): JuncRenderT {

    const coords = this.renderedCoords;

    return {
      cx: coords.x,
      cy: coords.y,
    };

  }

}
