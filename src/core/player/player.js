// @flow

import type { PlayerSerialT } from '../../utils';
import { CatonlineError, Serializable } from '../../utils';

export class Player implements Serializable {

  type: string;
  id: string;

  constructor(type: string, id: string) {
    this.type = type;
    this.id = id;
  }

  serialize(): PlayerSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: PlayerSerialT): Player {
    throw new CatonlineError('not implemented');
  }

  equals(player: Player): boolean {
    return player.id === this.id;
  }

}
