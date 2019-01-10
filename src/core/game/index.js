// @flow

import _ from 'underscore';
import type { GameParamsT, GameSerialT } from '../../utils';
import { CatonlineError } from '../../utils';
import { validate } from './params';
import { Board } from '../board';
import { Computer, Human, Player } from '../player';
import { Graph } from '../graph';
import { scenarios } from '../scenarios';
import { DevCardDeck } from './dev-card-deck';
import { Dice } from './dice';

export class Game {

  params: GameParamsT;
  board: Board;
  deck: DevCardDeck;
  dice: Dice;
  players: Player[];

  constructor(params: {}) {

    this.params = validate(params); // might throw

    const scenario = this.params.scenario;

    this.board = new Board(scenario);
    this.deck = new DevCardDeck(scenario);
    this.dice = new Dice();
    this.players = [];

  }

  randomize() {

    this.board.randomize(this.params);
    this.deck.shuffle();

  }

  serialize(): GameSerialT {

    throw new CatonlineError('not implemented');

  }
}

export { defaults } from './params';
