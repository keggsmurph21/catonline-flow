// TODO: delete this file
// @ flow

import type {

  StateSerialT,
  InitialConditionsT,
  PlayerStateT,
  PublicGameStateT,
  TradeT,
  TradeRateT

} from '../../utils';
import type { Hand } from '../player/hand';
import type { Game } from '.';
import { CatonlineError, Serializable } from '../../utils';
import { Player } from '../player';
import { Bank, defaultBankRate } from './bank';

export class State implements Serializable {

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
  currentTrade: TradeT | null;
  currentPlayerID: number;
  hasRolled: boolean;

  largestArmy: number;
  hasLargestArmy: Player | null;
  longestRoad: number;
  hasLongestRoad: Player | null;

  // player-specific state-values
  players: PlayerStateT[];

  constructor(game: Game) {

    this.status = game.isFull()
      ? 'ready'
      : 'pending';

    this.turn = 1;

    this.isFirstTurn = true;
    this.isSecondTurn = false;
    this.isGameOver = false;
    this.isRollSeven = false;
    this.waiting = [];
    this.canSteal = false;
    this.tradeAccepted = false;
    this.waitForDiscard = false;
    this.currentTrade = null;
    this.currentPlayerID = 0;
    this.hasRolled = false;

    this.largestArmy = 2;
    this.hasLargestArmy = null;
    this.longestRoad = 4;
    this.hasLongestRoad = null;

    this.players = game.players.map(player => {
      return {

        id: player.id,
        vertex: 'v_end_turn',
        adjacents: [],

        isHuman: player.isHuman(),
        discard: 0,
        hasDeclinedTrade: false,
        canAcceptTrade: false,
        hasHeavyPurse: false,
        bankTradeRates: defaultBankRate,
        numKnights: 0,
        hand: player.hand,

      }
    });

  }

  setInitialConditions(conds: InitialConditionsT) {
    this.initialConditions = conds;
  }

  getPublic(game: Game): PublicGameStateT {
    return {

      status: this.status,
      turn: this.turn,

      isFirstTurn: this.isFirstTurn,
      isSecondTurn: this.isSecondTurn,
      isGameOver: this.isGameOver,
      isRollSeven: this.isRollSeven,
      waiting: this.waiting,
      canSteal: this.canSteal,
      tradeAccepted: this.tradeAccepted,
      waitForDiscard: this.waitForDiscard,
      currentTrade: this.currentTrade,
      currentPlayerID: this.currentPlayerID,
      hasRolled: this.hasRolled,

      largestArmy: this.largestArmy,
      hasLargestArmy: this.hasLargestArmy,
      longestRoad: this.longestRoad,
      hasLongestRoad: this.hasLongestRoad,

      players: this.players.map(player => player.getPublic(game)),

    }
  }

  serialize(): StateSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: StateSerialT): State {
    throw new CatonlineError('not implemented');
  }

}
