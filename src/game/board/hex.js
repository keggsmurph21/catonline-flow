// @flow

import _ from 'underscore';

import type { DiceT, HexParamsT, HexRenderT, ScenarioT } from '../../utils';
import { CatonlineError } from '../../utils';
import { Node } from './node';

export class Hex extends Node {

  id: string;
  num: number;

  dice: DiceT;
  isOcean: boolean;
  resource: ?string;   // to be displayed
  resources: string[]; // to be drawn

  neighbors: [];
  juncs: [];
  roads: [];

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

  }

  render(): HexRenderT {

    throw new CatonlineError('not implemented');

  }

}
