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

  owner: Player;
  players: Player[];

  isRandomized: boolean;

  constructor(owner: Player, params: {}) {

    this.params = validate(params); // might throw

    const scenario = this.params.scenario;

    this.board = new Board(scenario);
    this.deck = new DevCardDeck(scenario);
    this.dice = new Dice();

    this.owner = owner;
    this.players = [];

    this.isRandomized = false;

    this.addPlayer(owner);

  }

  randomize() {

    if (!this.isFull())
      throw new CatonlineError('cannot randomize game until all players have joined');

    shuffle(this.players);
    this.board.randomize(this.params);
    this.deck.shuffle();

    this.isRandomized = true;

  }

  serialize(): GameSerialT {

    throw new CatonlineError('not implemented');

  }

  isOwner(player: Player): boolean {
    return this.owner.equals(player);
  }

  hasPlayer(player: Player): boolean {

    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].equals(player))
        return true;
    }

    return false;

  }

  addPlayer(player: Player) {

    if (!(player instanceof Player))
      throw new CatonlineError(`cannot add player of type "${typeof player}"`);

    if (this.hasPlayer(player))
      throw new CatonlineError('this player has already joined');

    if (this.isRandomized)
      throw new CatonlineError('cannot add players after game has been randomized');

    if (this.isFull())
      throw new CatonlineError('all players have already joined');

    this.players.push(player);

  }

  removePlayer(player: Player) {

    if (!(player instanceof Player))
      throw new CatonlineError(`cannot add player of type "${typeof player}"`);

    if (!this.hasPlayer(player))
      throw new CatonlineError('this player is not in this game');

    if (this.isRandomized)
      throw new CatonlineError('cannot remove players after game has been randomized');

    if (this.isOwner(player))
      throw new CatonlineError('the owner cannot leave the game');

    const i = this.players.indexOf(player);
    this.players.splice(i, 1);

  }

  isFull(): boolean {
    return this.params.numHumans + this.params.numComputers === this.players.length;
  }

}

export { defaults } from './params';
