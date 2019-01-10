// @flow

import _ from 'underscore';
import type { GameParamsT, GameSerialT } from '../../utils';
import { CatonlineError } from '../../utils';
import { validate } from './params';
import { Board } from '../board';
import { Computer, Human, Player } from '../player';
import { Graph } from '../graph';
import { scenarios } from '../scenarios';

export class Game {

  params: GameParamsT;
  board: Board;
  players: Player[];

  constructor(params: {}) {

    this.params = validate(params); // might throw

    this.board = new Board(this.params.scenario);
    this.players = [];

  }

  randomize() {

  }

  serialize(): GameSerialT {

    throw new CatonlineError('not implemented');
    
  }
}

export { defaults } from './params';
