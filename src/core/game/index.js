// @flow

import _ from 'underscore';
import type { GameParamsT, GameSerialT } from '../../utils';
import { CatonlineError, shuffle } from '../../utils';
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

    if (!this.isFull())
      throw new CatonlineError('cannot randomize game until all players have joined');

    shuffle(this.players);
    this.board.randomize(this.params);
    this.deck.shuffle();

  }

  serialize(): GameSerialT {

    throw new CatonlineError('not implemented');

  }

  hasPlayer(player: Player): boolean {

    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].equals(player))
        return true;
    }

    return false;

  }

  addPlayer(player: Player) {

    if (this.isFull())
      throw new CatonlineError('all players have already joined');

  }

  removePlayer(player: Player) {

  }

  isFull(): boolean {
    return this.params.numHumans + this.params.numComputers === this.players.length;
  }

}

export { defaults } from './params';
