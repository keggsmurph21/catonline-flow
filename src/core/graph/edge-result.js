// @flow strict

import type {

  Game,
  Resource,
  RawEdgeResultT,

} from '../../utils';
import {

  CatonlineError,
  EdgeResultError,
  parseIndex,
  parseResource,

} from '../../utils';

export class EdgeResult {

  type: $TODO;
  values: $TODO[];

  constructor(type: string) {

    this.type = type;

  }

  static fromString(type: string, s: RawEdgeResultT, game: Game): EdgeResult {
    const arg = new EdgeResult(type);

    let i;

    switch (type) {

      case 'diceroll':

        i = parseIndex('diceroll', s);

        // $TODO
        // if (this.DEBUG_MODE) {

          if (isNaN(i))
            throw new EdgeResultError(`cannot roll "${i}" ("${s || ''}")`);

          if (i < 2)
            throw new EdgeResultError(`cannot roll less than 2 ("${s || ''}")`);

          if (i > 12)
            throw new EdgeResultError(`cannot roll greater than 12 ("${s || ''}")`);

          arg.values = [i];

        // } else {
        //    throw new CatonlineError(`You can only do this in DEBUG_MODE`);
        // }

        break;

      case 'null':
        arg.values = [];
        break;

      case 'resource':
        const r = parseResource(game, s);
        arg.values = [r];
        break;

      case 'resource?':
        if (s === undefined) {
          arg.values = [null];
        } else {
          arg.values = [parseResource(game, s)];
        }
        break;

      default:
        throw new CatonlineError(`unexpected EdgeArgumentType "${type}"`);
    }

    return arg;
  }

  toString(): string {

    let s;

    switch (this.type) {

      case 'diceroll':
        return this.getDiceroll() + '';

      case 'null':
        return '_';

      case 'resource':
        return this.values[0];

      case 'resource?':
        return '';

      default:
        throw new CatonlineError(`unexpected EdgeArgumentType "${this.type}"`);

    }
  }

  getDiceroll(): number {

    if (this.type !== 'diceroll')
      throw new CatonlineError(`cannot call getDiceroll for type "${this.type}"`);

    return this.values[0];

  }

  getResourceName(): string {

    if (this.type !== 'resource' || this.type !== 'resource?')
      throw new CatonlineError(`cannot call getResourceName() for type "${this.type}"`);

    return this.toString();

  }

}
