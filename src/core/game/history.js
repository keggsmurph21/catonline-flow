// @flow strict

import type {

  EdgeArgument,
  EdgeReturnT,
  HistoryItemT,
  HistoryItemSerialT,
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

  serialize(): HistoryItemSerialT[] {

    return this._items.map(item => {
      return {
        participantNum: item.participant.num,
        edgeName: item.edge.name,
        argString: item.args.toString(),
        result: item.result
      };
    });
  }

}
