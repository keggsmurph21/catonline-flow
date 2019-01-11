// @flow

import type { FlagsSerialT, InitialConditionsT, TradeT, TradeRateT } from '../../utils';
import type { Hand } from '../player/hand';
import type { Game } from '.';
import { CatonlineError, Serializable } from '../../utils';
import { Player } from '../player';

export class Flags implements Serializable {

  initialConditions: InitialConditionsT;
  status: string;
  turn: number;

  isFirstTurn: boolean;
  isSecondTurn: boolean;
  isGameOver: boolean;
  isRollSeven: boolean;
  waiting: Player[];
  canSteal: boolean;
  tradeAccepted: boolean;
  waitForDiscard: boolean;
  currentTrade: TradeT;
  currentPlayerID: number;
  hasRolled: boolean;

  largestArmy: number;
  hasLargestArmy: Player;
  longestRoad: number;
  hasLongestRoad: Player;

  // player-specific state-values
  players: {

    vertex: string,
    adjacents: string[],

    isHuman: boolean,
    discard: number,
    hasDeclinedTrade: boolean,
    canAcceptTrade : boolean,
    hasHeavyPurse : boolean,
    bankTradeRates: TradeRateT,
    numKnights: number,
    hand: Hand,

  }[];

  setInitialConditions(conds: InitialConditionsT) {
    this.initialConditions = conds;
  }

  serialize(): FlagsSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: FlagsSerialT): Flags {
    throw new CatonlineError('not implemented');
  }

}
