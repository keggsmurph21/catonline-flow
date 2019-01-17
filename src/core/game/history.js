// @flow strict

import type {

  EdgeArgumentT,
  EdgeReturnT,
  HistoryItemT,
  HistorySerialT,
  Participant,

} from '../../utils';
import { CatonlineError, Serializable } from '../../utils';

export class History implements Serializable {

  _items: HistoryItemT[];

  constructor() {
    this._items = [];
  }

  // flowlint-next-line unsafe-getters-setters:off
  get length(): number {
    return this._items.length;
  }

  store(item: HistoryItemT) {
    this._items.push(item);
  }

  serialize(): HistorySerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HistorySerialT): History {
    throw new CatonlineError('not implemented');
  }

}
