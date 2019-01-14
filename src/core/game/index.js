// @flow

import _ from 'underscore';
import type { GameParamsT, GameSerialT, InitialConditionsT } from '../../utils';
import { CatonlineError, Serializable, shuffle } from '../../utils';
import { validate } from './params';
import { Board } from '../board';
import { Computer, Human, Player } from '../player';
import { Graph } from '../graph';
import { scenarios } from '../scenarios';
import { DevCardDeck } from './dev-card-deck';
import { Dice } from './dice';
//import { State } from './state';
import { History } from './history';
import { Bank } from './bank';
import { Participant } from './Participant';

export class Game implements Serializable {

  params: GameParamsT;
  graph: Graph;
  board: Board;
  deck: DevCardDeck;
  dice: Dice;
  bank: Bank;

  owner: Player;
  participants: Participant[];

  initialConditions: InitialConditionsT;
  isRandomized: boolean;

  //state: State;
  history: History;

  createdAt: Date;
  modifiedAt: Date;

  constructor(owner: Player, params: {}) {

    this.params = validate(params); // might throw

    const scenario = this.params.scenario;

    this.graph = new Graph(scenario);
    this.board = new Board(scenario);
    this.deck = new DevCardDeck(scenario);
    this.dice = new Dice();
    this.bank = new Bank();

    this.owner = owner;
    this.participants = [];

    this.isRandomized = false;

    this.addPlayer(owner);

    //this.state = new State(this);
    this.history = new History();

    this.createdAt = new Date();
    this.modify();

  }

  modify() {
    this.modifiedAt = new Date();
  }

  begin() {

    if (this.isFull())
      throw new CatonlineError('cannot begin a game until all participants have joined');

    this.fillWithComputers();
    this.randomize();

    this.modify();

  }

  randomize() {

    if (!this.isFull())
      throw new CatonlineError('cannot randomize game until all participants have joined');

    shuffle(this.participants);
    this.board.randomize(this.params);
    this.deck.shuffle();

    this.initialConditions = this.getInitialConditions();

    this.isRandomized = true;
    this.modify();

  }

  serialize(): GameSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: GameSerialT): Game {
    throw new CatonlineError('not implemented');
  }

  getInitialConditions(): InitialConditionsT {
    return {
      participants: this.participants
        .map(participant => participant.player.id),
      board: {
        hexes: _.mapObject(this.board.hexes, hex => {
          return {
            resource: hex.resource.name,
            dice: hex.dice.roll,
          }
        }),
        ports: _.mapObject(this.board.ports, port => port.type),
      },
      deck: this.deck.cards.map(card => card.type),
    };
  }

  isOwner(player: Player): boolean {
    return this.owner.equals(player);
  }

  /*
  getParticipant(player: Player): Participant {

    if (!this.hasPlayer(player))
      throw new CatonlineError(`player "${player.id}" not in game`);

    for (let i = 0; i < this.participants.length; i++) {

      if (this.participants[i].player.equals(player))
        return this.participants[i];

    }

    throw new CatonlineError(`unable to get state for player "${player.id}"`);

  }
  */

  hasPlayer(player: Player): boolean {

    for (let i = 0; i < this.participants.length; i++) {
      if (this.participants[i].player.equals(player))
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
      throw new CatonlineError('cannot add participants after game has been randomized');

    if (this.isFull())
      throw new CatonlineError('all participants have already joined');

    const participant = new Participant(this, player);
    this.participants.push(participant);
    this.modify();

  }

  removePlayer(player: Player) {

    if (!(player instanceof Player))
      throw new CatonlineError(`cannot add player of type "${typeof player}"`);

    if (!this.hasPlayer(player))
      throw new CatonlineError('this player is not in this game');

    if (this.isRandomized)
      throw new CatonlineError('cannot remove participants after game has been randomized');

    if (this.isOwner(player))
      throw new CatonlineError('the owner cannot leave the game');

    const i = this.participants.indexOf(player);
    this.participants.splice(i, 1);
    this.modify();

  }

  isFull(): boolean {
    return this.params.numHumans === this.getNumHumans();
  }

  fillWithComputers() {
    throw new CatonlineError('not implemented');
  }

  getNumHumans(): number {
    return this.participants
      .filter(p => p.isHuman())
      .length;
  }

  getNumComputers(): number {
    return this.participants
      .filter(p => !p.isHuman())
      .length;
  }

}

export { defaults } from './params';
