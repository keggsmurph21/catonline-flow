// @flow

import _ from 'underscore';

import type { DiceT, HexParamsT, HexRenderT, ScenarioT } from '../../utils';
import { CatonlineError, pointsArrayToString } from '../../utils';
import { BoardNode } from './board-node';
import { Junc } from './junc';
import { Road } from './road';

export class Hex extends BoardNode {

  id: string;
  num: number;

  dice: DiceT;
  isOcean: boolean;
  resource: ?string;   // to be displayed
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
    this.resource = null;
    this.resources = params.resources
      ? params.resources === '*'
        ? _.filter(Object.keys(scenario.resources), res => res !== 'ocean')
        : params.resources.split(',')
      : [];

    this.hexes = {};
    this.juncs = {};
    this.roads = {};

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
