// @flow

import _ from 'underscore';
import type { CubeCoordsT, JuncRenderT } from '../../utils';
import { CatonlineError } from '../../utils';
import { Hex } from './hex';
import { Node } from './node';
import { Road } from './road';

export class Junc extends Node {

  id: string;
  num: number;

  juncs: { [number]: Junc };
  hexes: { [number]: Hex };
  roads: { [number]: Road };

  constructor(num: number, coords: CubeCoordsT) {

    super('Junc', coords);

    this.id = 'h' + num;
    this.num = num;

    this.juncs = {};
    this.hexes = {};
    this.roads = {};

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
