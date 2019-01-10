// @flow

import _ from 'underscore';

import type { CubeCoordsT, PortParamsT, PortRenderT, ScenarioT } from '../../utils';
import { CatonlineError } from '../../utils';
import { CoordinateCache } from './cache';
import { Hex } from './hex';
import { Junc } from './junc';
import { Road } from './road';
import { BoardNode } from './board-node';

export class Port extends BoardNode {

  id: string;
  num: number;

  type: string;
  hexParams: {
    orientation: number,
    coords: CubeCoordsT,
  };
  road: Road;

  constructor(num: number, params: PortParamsT) {

    super('Port', params.hex.coords);

    this.id = 'p' + num;
    this.num = num;

    this.type = ''; // init this later
    this.hexParams = params.hex;

  }

  bindToRoad(cache: CoordinateCache) {

    const { orientation, coords } = this.hexParams;
    const hex = cache.get('h', coords);

    this.road = hex.roads[orientation];
    this.coords = this.road.coords; // overwrite from BoardNode

  }

  setType(type: string) {
    this.type = type;
  }

  getHex(): ?Hex {
    return _.find(this.hexes, hex => hex && !hex.isOcean);
  }

  getHexes(): Hex[] {
    return this.road.hexes;
  }

  getJuncs(): Junc[] {
    return this.road.juncs;
  }

  render(): PortRenderT {
    return {};
  }

}
