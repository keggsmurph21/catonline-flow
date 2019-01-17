// @flow strict

import type {

  CostT,
  HandSerialT,
  ScenarioT,

} from '../../../utils';
import _ from 'underscore';
import { CatonlineError, Serializable } from '../../../utils';

export class Hand implements Serializable {

  playedDCs: { [string]: number };
  unplayedDCs: { [string]: number };
  unplayableDCs: { [string]: number };
  resources: { [string]: number };

  constructor(scenario: ScenarioT) {

    this.playedDCs = {};
    this.unplayedDCs = {};
    this.unplayableDCs = {};
    _.each(scenario.devCards, (count: number, name: string) => {

      this.playedDCs[name] = 0;
      this.unplayedDCs[name] = 0;
      this.unplayableDCs[name] = 0;

    });

    this.resources = {};
    _.each(scenario.resources, (count: number, name: string) => {

      this.resources[name] = 0;

    });

  }

  serialize(): HandSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HandSerialT): History {
    throw new CatonlineError('not implemented');
  }

  /*
  getNumDevCardsInHand(): number {

    let acc: number = 0;
    _.each(this.unplayedDCs, (num: number) => { acc += num });
    _.each(this.unplayableDCs, (num: number) => { acc += num });

    return acc;

  }

  getNumResources(): number {

    let acc: number = 0;
    _.each(this.resources, (num: number) => { acc += num });

    return acc;

  }
  */

}
