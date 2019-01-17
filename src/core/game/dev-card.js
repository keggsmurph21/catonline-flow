// @flow strict

import type {

  DevCardParamsT,
  CostT,

} from '../../utils';
import { DEVCARD_NAMES_MAP } from '../../utils';

export class DevCard {

  type: string;
  name: {
    singular: string,
    plural: string,
  };
  count: number;
  cost: CostT;

  constructor(params: DevCardParamsT) {

    this.type = params.name;
    this.name = DEVCARD_NAMES_MAP[params.name];
    this.count = params.count;
    this.cost = {};

  }

}
