// @flow strict

import _ from 'underscore';

import type { DiceT, HexParamsT, HexRenderT, HexSerialT, ScenarioT } from '../../utils';
import { CatonlineError, pointsArrayToString, Serializable, thin } from '../../utils';
import { BoardNode } from './board-node';
import { Junc } from './junc';
import { Road } from './road';
import { Resource } from './resource';
import { DiceValue } from './dice-value';

export class Hex extends BoardNode implements Serializable {

  id: string;
  num: number;

  dice: DiceValue;
  isOcean: boolean;
  resource: Resource;   // to be displayed
  resources: string[];  // to be drawn

  constructor(num: number, params: HexParamsT, scenario: ScenarioT) {

    super('Hex', params.coords);

    this.id = 'h' + num;
    this.num = num;

    this.dice = new DiceValue(-1);
    this.isOcean = params.isOcean;

    // flowlint-next-line sketchy-null:off
    this.resources = params.resources
      ? params.resources === '*'
        ? Object.keys(scenario.resources).filter(res => { res !== 'ocean' })
        : params.resources.split(',')
      : [];

    this.hexes = {};
    this.juncs = {};
    this.roads = {};

  }

  eachNeighbor(next: (Hex, string) => void) {

    const keys = Object.keys(this.hexes);
    keys.forEach(key => {
      const val = this.hexes[key];
      next(val, key);
    });
    
  }

  /*
  eachJunc(next: (Junc, string) => void) {
    _.each(this.juncs, next);
  }

  eachRoad(next: (Road, string) => void) {
    _.each(this.roads, next);
  }
  */

  serialize(): HexSerialT {
    return {
      num: this.num,
      coords: this.coords,
      dice: this.dice,
      isOcean: this.isOcean,
      resource: this.resource.name,
      hexes: _.mapObject(this.hexes, hex =>  hex  ? hex.num  : null),
      juncs: _.mapObject(this.juncs, junc => junc ? junc.num : null),
      roads: _.mapObject(this.roads, road => road ? road.num : null),
    };
  }

  static deserialize(serial: HexSerialT): Hex {
    throw new CatonlineError('not implemented');
  }

  /*
  render(): HexRenderT {

    const coords = this.getRenderedCoords();
    const points = _
      .map(this.juncs, junc => junc.getRenderedCoords());
    const pString = pointsArrayToString(points);

    return {
      cx: coords.x,
      cy: coords.y,
      points: pString,
      dice: this.dice.value,
    };

  }
  */

}
