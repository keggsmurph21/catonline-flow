// @flow

import _ from 'underscore';
import type { HandSerialT } from '../../../utils';
import { CatonlineError, Serializable } from '../../../utils';

export class Hand implements Serializable {

  playedDCs: { [string]: number };
  unplayedDCs: { [string]: number };
  unplayableDCs: { [string]: number };
  resources: { [string]: number };

  constructor() {

    this.playedDCs = {};
    this.unplayedDCs = {};
    this.unplayableDCs = {};
    this.resources = {};

  }

  serialize(): HandSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HandSerialT): History {
    throw new CatonlineError('not implemented');
  }

  getNumDevCardsInHand(): number {

    let acc: number = 0;
    _.each(this.unplayedDCs, num => acc += num);
    _.each(this.unplayableDCs, num => acc += num);

    return acc;

  }

  getNumResources(): number {

    let acc: number = 0;
    _.each(this.resources, num => acc += num);

    return acc;

  }

}