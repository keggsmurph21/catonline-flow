// @flow strict

import type {

  EdgeArgument,
  GameParamsT,
  GameSerialT,
  Hex,
  HistoryItemT,
  HistoryItemSerialT,
  InitialConditionsHexT,
  InitialConditionsPortT,
  InitialConditionsT,
  Junc,
  PlayerIDT,
  PlayerMapT,
  Road,
  RawEdgeArgumentT,
  TradeT,

} from '../../utils';
import _ from 'underscore';
import Emitter from 'events';
import {

  CatonlineError,
  EdgeExecutionError,
  EdgeResult,
  objectsMatch,
  round,
  Serializable,
  shuffle

} from '../../utils';
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

  // <state>
  turn: number;
  canSteal: boolean;
  // tradeAccepted: boolean; // do i need this?
  currentTrade: TradeT | null;
  currentParticipantID: number;
  hasRolled: boolean;

  largestArmy: number;
  hasLargestArmy: Participant | null;
  longestRoad: number;
  hasLongestRoad: Participant | null;
  // </state>

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
    _.each(this.participants, (participant: Participant, num: string) => {
      participant.num = parseInt(num);
    });
    this.board.randomize(this.params);
    this.deck.shuffle();

    this.isRandomized = true;
    this.initialConditions = this.getInitialConditions();

    this.modify();

  }

  static initialize(conds: InitialConditionsT, owner: Player, players: PlayerMapT): Game {

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
    conds.board.hexes.forEach((hex: string, i: number) => {

      const index = String(i);
      const [resource, diceString] = hex.split(' ');
      const diceValue = parseInt(diceString);

      game.board.hexes[index].resource = new Resource(resource);
      game.board.hexes[index].dice = new DiceValue(diceValue);

    });

    // overwrite the board port values
    conds.board.ports.forEach((port: string, i: number) => {

      const index = String(i);
      game.board.ports[index].type = port;

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

  getDiscardingParticipants(): Participant[] {

    let discarding = [];
    this.participants.forEach(participant => {

      if (participant.toDiscard > 0)
        discarding.push(participant);

    });

    return discarding;

  }

  isWaitingForDiscard(): boolean {
    return this.getDiscardingParticipants().length > 0;
  }

  mutate(participant: Participant, name: string, rawArgs: RawEdgeArgumentT): EdgeResult {

    try {

      const edge = this.graph.getEdge(name);
      const args = edge.parseArgs(this, rawArgs);
      const result = edge.execute(this, participant, args);

      this.history.store({ participant, edge, args, result });

      const target = this.graph.getVertex(edge.target);
      participant.vertex = target;

      this.modify();

      return result;

    } catch (e) {

      if (e instanceof CatonlineError)
        return new EdgeResult('null');

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
      if (cpid === -1)
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

    if (!choice.isSettleable) {
      _.each(choice.hexes, (hex: Hex) => {
        if (hex && !hex.isOcean)
          throw new EdgeExecutionError(`You can't settle next an existing settlement`);
      });
      throw new EdgeExecutionError(`You can't settle in the ocean`);
    }

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

  initCollect(participant: Participant) {

    const lastSettlement = participant.settlements.slice(-1)[0];
    _.each(lastSettlement.hexes, hex => {

      if (!hex)
        return;

      const res = hex.resource;

      if (res.yields)
        participant.collect({ [res.name]: 1 });

    });

  }

  _roll() {

    const roll = this.dice.getTotal();
    this.hasRolled = true;

    if (roll === 7) {
      this.participants.forEach(participant => {
        if (participant.hasHeavyPurse()) {

          const toDiscard = Math.floor(participant.getNumResources() / 2);
          participant.toDiscard = toDiscard;

        }
      });
    }

  }

  roll(): number {

    this.dice.roll();
    this._roll();
    return this.dice.getTotal();

  }

  rollNumber(num: number): number {

    // $TODO
    // if (!this.DEBUG_MODE)
    //    throw new CatonlineError(`You can only do this in DEBUG_MODE`)

    const n1 = 6;
    const n2 = num - n1;

    this.dice.setRolls(n1, n2);
    this._roll();

    return this.dice.getTotal();

  }

  collectResources(): void {

    const total = this.dice.getTotal();
    _.each(this.board.hexes, (hex: Hex) => {

      if (hex === this.board.robber.hex)
        return;

      if (!hex.resource.yields)
        return;

      if (hex.dice !== total)
        return;

      _.each(hex.juncs, (junc: Junc) => {

        if (!junc.owner)
          return;

        const res = hex.resource.name;
        const harvest = { [res]: 1 };

        if (junc.isCity)
          harvest[res] += 1;

        junc.owner.collect(harvest);

      });

    });

  }

  getStealableParticipants(stealer: Participant): Participant[] {

    let stealable = [];

    _.each(this.board.robber.hex.juncs, (junc: Junc) => {

      if (junc.owner !== stealer)
        stealable.push(junc.owner);

    });

    return stealable;

  }

  moveRobber(mover: Participant, hex: Hex) {

    if (hex === this.board.robber.hex)
      throw new EdgeExecutionError(`robber is already here`);

    if (hex.isOcean)
      throw new EdgeExecutionError(`cannot place robber in the ocean`);

    this.board.robber.moveTo(hex);

    const targets = this.getStealableParticipants(mover);
    this.canSteal = targets.length > 0;

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

    return true
      && (() => {

          let equal = true;

          if (equal)
            thisConds.board.hexes.forEach((hex: string, i: number) => {
              equal = hex === thatConds.board.hexes[i];
            });

          if (equal)
            thatConds.board.hexes.forEach((hex: string, i: number) => {
              equal = hex === thisConds.board.hexes[i];
            });

          if (equal)
            thisConds.board.ports.forEach((port: string, i: number) => {
              equal = port === thatConds.board.ports[i];
            });

          if (equal)
            thatConds.board.ports.forEach((port: string, i: number) => {
              equal = port === thisConds.board.ports[i];
            });

          return equal;

        })()
      && objectsMatch(thisConds.params, thatConds.params)
      && objectsMatch(thisConds.players, thatConds.players)
      && objectsMatch(thisConds.deck, thatConds.deck)
      && this.history.length === game.history.length
      && this.history._items.reduce(
        (memo: boolean, item: HistoryItemT, i: number) => {

          const other = game.history._items[i];

          return memo
            && item.edge.name === other.edge.name
            && item.args.toString() === other.args.toString()
            && item.participant.num === other.participant.num
            && item.result.toString() === other.result.toString();

        }, true);

  }

  serialize(): GameSerialT {

    return {
      history: this.history.serialize(),
      initialConditions: this.initialConditions,
    };

  }

  static deserialize(serial: GameSerialT): Game {

    // $TODO get a better way to create this stuff
    const originalConds = serial.initialConditions;
    const originalOwner = new Human(originalConds.owner);
    const originalPlayers = {};
    originalConds.players.forEach(id => {
      originalPlayers[id] = new Human(id);
    });

    const game = Game.initialize(originalConds, originalOwner, originalPlayers);


    serial.history.forEach((item: HistoryItemSerialT) => {

      const [
        participantNumString,
        edgeName,
        argString,
        resultString,
      ] = item.split(' ');
      const participantNum = parseInt(participantNumString);

      const participant = game.participants[participantNum];
      const edge = game.graph.getEdge(edgeName);
      const result = edge.parseResult(game, resultString)

      if (result.type === 'null') {
        participant._do(edgeName, argString);
      } else {
        participant._do(edgeName, resultString);
      }

    });

    return game;

  }

  getInitialConditions(): InitialConditionsT {

    if (!this.isRandomized)
      throw new CatonlineError('cannot get initial conditions for non-randomized game');

    return {
      params: this.params,
      owner: this.owner.id,
      players: this.participants
        .map(participant => participant.player.id),
      board: {
        hexes: _.map(this.board.hexes, hex => {
          return [ hex.resource.name, hex.dice.value ].join(' ');
        }),
        ports: _.map(this.board.ports, port => port.type)
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
