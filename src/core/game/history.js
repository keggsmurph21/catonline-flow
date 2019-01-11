// @flow

import type { HistorySerialT } from '../../utils';
import { CatonlineError, Serializable } from '../../utils';

export class History implements Serializable {

  serialize(): HistorySerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HistorySerialT): History {
    throw new CatonlineError('not implemented');
  }
  
}
