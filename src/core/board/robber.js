// @flow strict

//import { Player } from '../player';

import type { Hex } from '../../utils';

export class Robber {

  hex: Hex;

  constructor() {

  }

  moveTo(hex: Hex) {
    this.hex = hex;
  }

}
