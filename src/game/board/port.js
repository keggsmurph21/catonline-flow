
import _ from 'underscore';

import type { PortParamsT, ScenarioT } from '../../utils';
import { CatonlineError } from '../../utils';
import { Hex } from './hex';
import { Road } from './road';
import { Node } from './node';

export class Port extends Node {

  id: string;
  num: number;


  constructor(num: number, params: PortParamsT, scenario: ScenarioT) {

    super(params.coords);

    this.id = 'p' + num;
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



}
