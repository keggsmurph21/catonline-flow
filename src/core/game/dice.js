// @flow strict

import { getRandomInt, CatonlineError } from '../../utils';

export class Dice {

  values: [number, number];

  constructor() {

    this.values = [-1, -1];

  }

  roll() {

    this.values = [ getRandomInt(1,6), getRandomInt(1,6) ];

  }

  getTotal(): number {
    return this.values[0] + this.values[1];
  }

  setRolls(n1: number, n2: number) {

    // $TODO
    // if (!this.DEBUG_MODE)
    //    throw new CatonlineError(`You can only do this in DEBUG_MODE`)

    if (0 > n1 || n1 > 6)
      throw new CatonlineError(`Cannot set dice to "${n1}" and "${n2}"`);

    this.values = [n1, n2];

  }

}
