// @flow strict

import type {

  CubeCoordsT,
  PortParamsT,
  PortRenderT,
  PortSerialT,
  ScenarioT,

} from '../../utils';
import _ from 'underscore';
import { CatonlineError, Serializable } from '../../utils';
import { CoordinateCache } from './cache';
import { Hex } from './hex';
import { Junc } from './junc';
import { Road } from './road';
import { BoardNode } from './board-node';

export class Port extends BoardNode implements Serializable {

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

  serialize(): PortSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: PortSerialT): Port {
    throw new CatonlineError('not implemented');
  }

  bindToRoad(cache: CoordinateCache) {

    const { orientation, coords } = this.hexParams;
    const hex = cache.getHex(coords);

    this.road = hex.roads['' + orientation];
    this.coords = this.road.coords; // overwrite from BoardNode

  }

  setType(type: string) {
    this.type = type;
  }

  /*
  getHex(): ?Hex {
    return _.find(this.hexes, hex => hex && !hex.isOcean);
  }

  getHexes(): { [number]: Hex } {
    return this.road.hexes;
  }

  getJuncs(): { [number]: Junc } {
    return this.road.juncs;
  }
  */

  /*
  render(): PortRenderT {
    return {};
  }
  */

}
