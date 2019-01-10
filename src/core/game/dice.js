// @flow

import { getRandomInt } from '../../utils';

export class Dice {

  values: [number, number];

  constructor() {

    this.values = [-1, -1];

  }

  roll() {

    this.values = [ getRandomInt(1,6), getRandomInt(1,6) ];

  }
}
