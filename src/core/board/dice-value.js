// @flow strict

import { CatonlineError, DICE_DOTS_MAP } from '../../utils';

export class DiceValue {

  value: number;
  dots: number;

  constructor(value: number) {

    this.value = value;

    const dots = DICE_DOTS_MAP[value];

    if (dots === undefined)
      throw new CatonlineError(`cannot initialize DiceValue for value "${value}"`);

    this.dots = dots;
    
  }
}
