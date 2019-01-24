// @flow strict

import type {

  CostT,
  DevCardName,
  Edge,
  EdgeArgumentT,
  HandSerialT,
  Junc,
  ParticipantSerialT,
  PublicStateT,
  Road,
  TradeRateT,
  Vertex,

} from '../../../utils';
import _ from 'underscore';
import { CatonlineError, EdgeExecutionError, Serializable } from '../../../utils';
import { Player } from '../../player';
import { Game } from '..';
import { Hand } from './hand';
import { scenarios } from '../../scenarios';

export class Participant implements Serializable {

  game: Game;
  player: Player;
  hand: Hand;

  vertex: Vertex;
  //adjacents: Edge[];

  //isHuman: player.isHuman(), // calculate this on the fly

  toDiscard: number;
  hasDeclinedTrade: boolean;
  //canAcceptTrade: boolean;
  hasHeavyPurse: boolean; // @ alejo

  bankTradeRate: TradeRateT;
  //numKnights: 0, // calculate this on the fly

  settlements: Junc[];
  roads: Road[];

  constructor(game: Game, player: Player) {

    this.game = game;
    this.player = player;
    this.hand = new Hand(game.board.scenario);

    this.vertex = this.game.graph.INITIAL_VERTEX;
    //this.adjacents = this.game.graph.getAdjacents(this);

    this.toDiscard = 0;
    this.hasDeclinedTrade = false;
    //this.canAcceptTrade = false;
    this.hasHeavyPurse = false;

    this.bankTradeRate = this.game.bank.DEFAULT_TRADE_RATE;

    this.settlements = [];
    this.roads = [];

  }

  serialize(): HandSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HandSerialT): History {
    throw new CatonlineError('not implemented');
  }

  isCurrentParticipant(): boolean {
    return this === this.game.getCurrentParticipant();
  }

  isOwner(): boolean {
    return this.game.isOwner(this.player);
  }

  resetDevCards() {
    _.each(this.hand.unplayableDCs, (count: number, name: string) => {

      this.hand.unplayableDCs[name] -= count;
      this.hand.playedDCs[name] += count;

    });
  }

  getEdges(): Edge[] {

    let edges = this.game.graph.getAdjacents(this);

    let priorityEdge = null;
    edges.forEach(edge => {
      if (edge.isPriority) {

        if (priorityEdge)
          throw new CatonlineError(`cannot have multiple priority edges! (${priorityEdge.name}, ${edge.name})`);

        priorityEdge = edge;

      }
    });

    if (priorityEdge)
      return [ priorityEdge ];

    return edges;

  }

  getNumDevCards(): number {

    let acc: number = 0;
    _.each(this.hand.playedDCs, (num: number) => { acc += num });
    _.each(this.hand.unplayedDCs, (num: number) => { acc += num });
    _.each(this.hand.unplayableDCs, (num: number) => { acc += num });

    return acc;

  }

  getNumDevCardsInHand(): number {

    let acc: number = 0;
    _.each(this.hand.unplayedDCs, (num: number) => { acc += num });
    _.each(this.hand.unplayableDCs, (num: number) => { acc += num });

    return acc;

  }

  getNumResources(): number {

    let acc: number = 0;
    _.each(this.hand.resources, (num: number) => { acc += num });

    return acc;

  }

  getNumSettlements(): number {
    return this.settlements.length;
  }

  getNumCities(): number {
    return this.settlements.filter(junc => junc.isCity).length;
  }

  getNumRoads(): number {
    return this.roads.length;
  }

  getLongestRoad(): Road[] {
    throw new CatonlineError('not implemented');
  }

  getLargestArmy(): number {
    throw new CatonlineError('not implemented');
  }

  isHuman(): boolean {
    return this.player.type === 'Human';
  }

  getPublic(game: Game): PublicStateT {

    throw new CatonlineError('not implemented');

    /*
    const playerState = game.getPlayerState(this);

    return {

      id: this.id,
      color: this.color,
      isHuman: this.isHuman(),

      numDevCardsInHand: this.hand.getNumDevCardsInHand(),
      numPlayedKnights: this.hand.playedDCs.knight,
      numResourcesInHand: this.hand.getNumResources(),
      hasLargestArmy: this.equals(game.state.hasLargestArmy),

      longestRoad: playerState

    }
    */
  }

  canAcceptCurrentTrade(): boolean {

    const trade = this.game.currentTrade;
    if (!trade)
      return false;

    if (trade.from.participant.player.equals(this.player))
      return false;

    if (trade.for.participants.indexOf(this) === -1)
      return false;

    return this.canAfford(trade.for.cards);

  }

  canTradeWithBank(): boolean {

    let canTrade = false;

    _.each(this.bankTradeRate, (num: number, name: string) => {

      const cost = { [name]: num };
      canTrade = canTrade || this.canAfford(cost);

    });

    return canTrade;

  }

  canBuild(obj: string): boolean {

    const scenario = scenarios[this.game.params.scenario];
    if (!(obj in scenario.buyable))
      throw new CatonlineError(`cannot calculate canBuild(): unrecognized object "${obj}"`);

    const cost = scenario.buyable[obj].cost;
    const max = scenario.buyable[obj].maxNum;

    switch (obj) {

      case 'city':
        return this.canAfford(cost) && this.getNumCities() < max;

      case 'devCard':
        return this.canAfford(cost) && this.getNumDevCards() < max;

      case 'road':
        return this.canAfford(cost) && this.getNumRoads() < max;

      case 'settlement':
        return this.canAfford(cost) && this.getNumSettlements() < max;

      default:
        throw new CatonlineError(`cannot calculate canBuild(): unrecognized object "${obj}"`);

    }
  }

  canPlayDevCard(name: DevCardName): boolean {
    return this.hand.unplayedDCs[name] > 0;
  }

  canAfford(cost: CostT): boolean {

    let canAfford = true;

    _.each(cost, (num: number, name: string) => {
      if (this.hand.resources[name] < num)
        canAfford = false;
    });

    return canAfford;

  }

  spend(cost: CostT) {

    if (!this.canAfford(cost))
      throw new CatonlineError(`cannot afford! cost: "${JSON.stringify(cost)}", resources: "${JSON.stringify(this.hand.resources)}"`);

    _.each(cost, (num: number, name: string) => {
      this.hand.resources[name] -= num;
    });

  }

  collect(cost: CostT) {
    _.each(cost, (num: number, name: string) => {
      this.hand.resources[name] += num;
    });
  }

  do(name: string, args: EdgeArgumentT): $TODO {

    const edges = this.getEdges().map(edge => edge.name);
    if (edges.indexOf(name) === -1)
      throw new EdgeExecutionError(`cannot do edge "${name}", edge is not adjacent`);

    const ret = this.game.mutate(this, name, args);

  }

  getPublicScore(): number {

    return this.hand.playedDCs.vp
      + this.getNumSettlements()
      + this.getNumCities()
      + (this === this.game.hasLongestRoad ? 2 : 0)
      + (this === this.game.hasLargestArmy ? 2 : 0);

  }

  getPrivateScore(): number {
    return this.getPublicScore() + this.hand.unplayedDCs.vp;
  }

}

/*
playerID        : player.playerID,
color           : player.color,
isHuman         : player.isHuman,
devCardsInHand  : sumOverObject(player.unplayedDCs) + sumOverObject(player.unplayableDCs),
numKnights      : player.numKnights,
hasLargestArmy  : (this.state.hasLargestArmy===player.playerID),
resourcesInHand : sumOverObject(player.resources), // TODO: move this to funcs, combine with the similar funciton in LOGIC
longestRoad     : player.longestRoad,
publicScore     : player.publicScore,
roads           : player.roads,
settlements     : player.settlements,
cities          : player.cities,
lobbyData       : player.lobbyData
*/
