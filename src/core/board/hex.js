// @flow

import _ from 'underscore';

import type { DiceT, HexParamsT, HexRenderT, HexSerialT, ScenarioT } from '../../utils';
import { CatonlineError, pointsArrayToString, Serializable, thin } from '../../utils';
import { BoardNode } from './board-node';
import { Junc } from './junc';
import { Road } from './road';
import { Resource } from './resource';

export class Hex extends BoardNode implements Serializable {

  id: string;
  num: number;

  dice: DiceT;
  isOcean: boolean;
  resource: Resource;   // to be displayed
  resources: string[]; // to be drawn

  hexes: { [number]: Hex };
  juncs: { [number]: Junc };
  roads: { [number]: Road };

  constructor(num: number, params: HexParamsT, scenario: ScenarioT) {

    super('Hex', params.coords);

    this.id = 'h' + num;
    this.num = num;

    this.dice = {
      roll: null,
      dots: null,
    };
    this.isOcean = params.isOcean;
    this.resources = params.resources
      ? params.resources === '*'
        ? _.filter(Object.keys(scenario.resources), res => res !== 'ocean')
        : params.resources.split(',')
      : [];

    this.hexes = {};
    this.juncs = {};
    this.roads = {};

  }

  eachNeighbor(next: (Hex, string) => any) {
    _.each(this.hexes, next);
  }

  eachJunc(next: (Junc, string) => any) {
    _.each(this.juncs, next);
  }

  eachRoad(next: (Road, string) => any) {
    _.each(this.roads, next);
  }

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

  render(): HexRenderT {

    const coords = this.renderedCoords;
    const points = _
      .map(this.juncs, junc => junc.renderedCoords);
    const pString = pointsArrayToString(points);

    return {
      cx: coords.x,
      cy: coords.y,
      points: pString,
      dice: this.dice,
    };

  }

}
