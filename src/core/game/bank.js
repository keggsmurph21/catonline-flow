// @flow strict

import type {

  TradeRateT,

} from '../../utils';
import { CatonlineError, BANK_TRADE_RATES } from '../../utils';

export class Bank {

  DEFAULT_TRADE_RATE: TradeRateT;

  constructor() {

    this.DEFAULT_TRADE_RATE = BANK_TRADE_RATES;

  }

}
