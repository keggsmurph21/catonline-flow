// @flow strict

import type {

  EdgeArgumentT,
  GameParamsT,
  GameSerialT,
  InitialConditionsHexT,
  InitialConditionsPortT,
  InitialConditionsT,
  Junc,
  PlayerIDT,
  Road,
  RawEdgeArgumentT,
  TradeT,

} from '../../utils';
import _ from 'underscore';
import Emitter from 'events';
import { CatonlineError, EdgeExecutionError, objectsMatch, round, Serializable, shuffle } from '../../utils';
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
import { Participant } from './participant';
import { Resource } from '../board/resource';
import { DiceValue } from '../board/dice-value';

export class Game extends Emitter implements Serializable {

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

  turn: number;
  // waiting: Participant[]; // do i need this?
  canSteal: boolean;
  // tradeAccepted: boolean; // do i need this?
  currentTrade: TradeT | null;
  currentParticipantID: number;
  hasRolled: boolean;

  largestArmy: number;
  hasLargestArmy: Participant | null;
  longestRoad: number;
  hasLongestRoad: Participant | null;

  history: History;

  createdAt: Date;
  modifiedAt: Date;

  constructor(owner: Player, params: GameParamsT) {

    super();

    this.params = validate(params); // might throw

    const scenario = scenarios[this.params.scenario];

    this.graph = new Graph(this);
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

    if (!this.isFull())
      throw new CatonlineError('cannot begin a game until all participants have joined');

    this.fillWithComputers();
    this.randomize();

    this.turn = 1;
    // this.waiting = Participant[]; // do i need this?
    this.canSteal = false;
    // this.tradeAccepted = boolean; // do i need this?
    this.currentTrade = null;
    this.currentParticipantID = 0;
    this.hasRolled = false;

    this.largestArmy = 2;
    this.hasLargestArmy = null;
    this.longestRoad = 4;
    this.hasLongestRoad = null;

    this.modify();

  }

  randomize() {

    if (this.isRandomized)
      throw new CatonlineError('game has already been randomized');

    if (!this.isFull())
      throw new CatonlineError('cannot randomize game until all participants have joined');

    shuffle(this.participants);
    this.board.randomize(this.params);
    this.deck.shuffle();

    this.isRandomized = true;
    this.initialConditions = this.getInitialConditions();

    this.modify();

  }

  static initialize(conds: InitialConditionsT, owner: Player, players: { [PlayerIDT]: Player }): Game {

    // make params the same
    const game = new Game(owner, conds.params);
    const scenario = scenarios[conds.params.scenario];

    // add all the players
    conds.players.forEach(id => {

      const player = players[id];
      if (!player)
        throw new CatonlineError(`cannot find player with id "${id}"`);

      if (!game.isOwner(player))
        game.addPlayer(player);

    });

    // do an independent randomization for the new game
    game.begin();

    // overwrite the participant order
    game.participants = conds.players.map(id => {

      const player = players[id];
      const participant = game.getParticipant(player);
      return participant;

    });

    // overwrite the board hex values
    _.each(conds.board.hexes, (hex: InitialConditionsHexT, i: string) => {
      game.board.hexes[i].resource = new Resource(hex.resource);
      game.board.hexes[i].dice = new DiceValue(hex.dice);
    });

    // overwrite the board port values
    _.each(conds.board.ports, (port: InitialConditionsPortT, i: string) => {
      game.board.ports[i].type = port;
    });

    // overwrite the deck
    game.deck.setCards(scenario, conds.deck);

    return game;

  }

  getWaiting(): Participant[] {

    let waiting = [];
    this.participants.forEach(participant => {

      if (participant.getEdges().length)
        waiting.push(participant);

    });

    return waiting;

  }

  mutate(participant: Participant, name: string, rawArgs: RawEdgeArgumentT): boolean {

    try {

      const edge = this.graph.getEdge(name);
      const args = edge.validateArgs(this, rawArgs);
      const result = edge.execute(this, participant, args);

      this.history.store({ participant, edge, args, result });

      const target = this.graph.getVertex(edge.target);
      participant.vertex = target;

      this.modify();

      return true;

    } catch (e) {

      if (e instanceof CatonlineError)
        return false;

      throw e;

    }

  }

  mutateBatch() {

  }

  iterateTurn() {

    let cpid = this.currentParticipantID;

    if (this.isFirstTurn()) {

      cpid += 1;
      if (cpid === this.participants.length)
        cpid -= 1;

    } else if (this.isSecondTurn()) {

      cpid -= 1;
      if (cpid === 0)
        cpid += 1;

    } else {

      cpid += 1;
      cpid %= this.participants.length;

    }

    this.currentParticipantID = cpid;

    this.turn++;
    this.hasRolled = false;

    this.participants.forEach(participant => {
      participant.resetDevCards();
    });

  }

  settle(participant: Participant, choice: Junc, isFree: boolean = false) {

    if (choice.owner === participant)
      throw new EdgeExecutionError(`You have already settled here`);

    if (!!choice.owner)
      throw new EdgeExecutionError(`Someone has already settled here`);

    if (!choice.isSettleable)
      throw new EdgeExecutionError(`You can't settle next an existing settlement`);

    if (!isFree) {
      const cost = this.board.scenario.buyable.settlement.cost;
      participant.spend(cost);
    }

    participant.settlements.push(choice);
    choice.owner = participant;
    choice.isSettleable = false;
    choice.getNeighbors().forEach(junc => {
      junc.isSettleable = false;
    });

    this.updateLongestRoad();
    this.isOver();

    if (choice.port != null) {

      let bankTradeRate = Object.assign({}, participant.bankTradeRate);
      const type = choice.port.type;

      if (type === 'mystery') {
        _.each(bankTradeRate, (rate: number, resource: string) => {
          if (3 < rate) {
            bankTradeRate[resource] = rate;
          }
        });
      } else {
        if (2 < bankTradeRate[type]) {
          bankTradeRate[type] = 2;
        }
      }

      participant.bankTradeRate = bankTradeRate;

    }

  }

  initPave(participant: Participant, choice: Road) {

    if (choice.owner === participant)
      throw new EdgeExecutionError(`You have already built a road here`);

    if (!!choice.owner)
      throw new EdgeExecutionError(`Someone has already built a road here`);

    const lastSettlement = participant.settlements.slice(-1)[0];

    let isValid = false;
    _.each(lastSettlement.roads, road => {
      if (road === choice)
        isValid = true;
    });

    if (!isValid)
      throw new EdgeExecutionError(`You must build a road next to your last settlement`);

    this._pave(participant, choice, true);

  }

  _pave(participant: Participant, choice: Road, isFree: boolean = false) {

    if (!isFree) {
      const cost = this.board.scenario.buyable.road.cost;
      participant.spend(cost);
    }

    participant.roads.push(choice);
    choice.owner = participant;

    this.updateLongestRoad();
    this.isOver();

  }

  updateLongestRoad() {
    //console.log(new CatonlineError('not implemented')); // $TODO
  }

  equals(game: Game): boolean {

    if (!(game instanceof Game))
      throw new CatonlineError(`cannot compare game to object of type "${typeof game}"`);

    if (!this.isRandomized || !game.isRandomized)
      throw new CatonlineError('can only compare games that are randomized');

    const thisConds = this.getInitialConditions();
    const thatConds = game.getInitialConditions();

    let equal = true;

    _.each(thisConds.board.hexes, (hex: InitialConditionsHexT, i: string) => {
      equal = equal && objectsMatch(hex, thatConds.board.hexes[i])
    });

    _.each(thatConds.board.hexes, (hex: InitialConditionsHexT, i: string) => {
      equal = equal && objectsMatch(hex, thisConds.board.hexes[i]);
    });

    _.each(thisConds.board.ports, (portType: InitialConditionsPortT, i: string) => {
      equal = equal && (portType === thatConds.board.ports[i]);
    });

    _.each(thatConds.board.ports, (portType: InitialConditionsPortT, i: string) => {
      equal = equal && (portType === thisConds.board.ports[i]);
    });

    return equal
      && objectsMatch(thisConds.params, thatConds.params)
      && objectsMatch(thisConds.players, thatConds.players)
      && objectsMatch(thisConds.deck, thatConds.deck);
  }

  serialize(): GameSerialT {
    throw new CatonlineError('not implemented');
  }

  static deserialize(serial: GameSerialT): Game {
    throw new CatonlineError('not implemented');
  }

  getInitialConditions(): InitialConditionsT {

    if (!this.isRandomized)
      throw new CatonlineError('cannot get initial conditions for non-randomized game');

    return {
      params: this.params,
      players: this.participants
        .map(participant => participant.player.id),
      board: {
        hexes: _.mapObject(this.board.hexes, hex => {
          return {
            resource: hex.resource.name,
            dice: hex.dice.value,
          }
        }),
        ports: _.mapObject(this.board.ports, port => port.type),
      },
      deck: this.deck.cards.map(card => card.type),
    };
  }

  getStatus(): string {
    if (this.isRandomized) {
      return 'in-progress';
    } else if (this.isFull()) {
      return 'ready';
    } else {
      return 'pending';
    }
  }

  isOwner(player: Player): boolean {
    return this.owner.equals(player);
  }

  getCurrentParticipant(): Participant {
    return this.participants[this.currentParticipantID];
  }

  getParticipant(player: Player): Participant {

    if (!this.hasPlayer(player))
      throw new CatonlineError(`player "${player.id}" not in game`);

    for (let i = 0; i < this.participants.length; i++) {

      if (this.participants[i].player.equals(player))
        return this.participants[i];

    }

    throw new CatonlineError(`unable to get state for player "${player.id}"`);

  }

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
    for (let i = 0; i < this.params.numComputers; i++) {
      const cpu = new Computer('CPU_' + (i + 1));
      this.addPlayer(cpu);
    }
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

  isFirstTurn(): boolean {

    if (!this.isRandomized)
      throw new CatonlineError('cannot calculate isFirstTurn() until game is randomized');

    return Math.floor((this.turn - 1) / this.participants.length) === 0;

  }

  isSecondTurn(): boolean {

    if (!this.isRandomized)
      throw new CatonlineError('cannot calculate isFirstTurn() until game is randomized');

    return Math.floor((this.turn - 1) / this.participants.length) === 1;

  }

  isRollSeven(): boolean {

    if (!this.isRandomized)
      throw new CatonlineError('cannot calculate isRollSeven() until game is randomized');

    return this.dice.getTotal() === 7;

  }

  isOver(): boolean {

    if (!this.isRandomized)
      throw new CatonlineError('cannot calculate isOver() until game is randomized');

    //console.log(new CatonlineError('not implemented')); // $TODO
    return false;
  }

  end() {
    throw new CatonlineError('not implemented');
  }

}

export { defaults } from './params';
