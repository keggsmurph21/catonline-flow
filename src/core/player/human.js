// @flow

import { Player } from './player';

export class Human extends Player {

  constructor(id: string) {
    super('Human', id);
  }

}
