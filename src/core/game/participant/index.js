// @flow

import _ from 'underscore';
import type { Junc } from '../../board/junc';
import type { Road } from '../../board/road';
import type { Edge, Vertex } from '../../graph';
import type { CostT, HandSerialT, ParticipantSerialT, PublicStateT, TradeRateT } from '../../../utils';
import { CatonlineError, Serializable } from '../../../utils';
import { BANK_TRADE_RATES as DEFAULT_TRADE_RATE } from '../../../utils';
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
    this.hand = new Hand();

    this.vertex = this.game.graph.INITIAL_VERTEX;
    //this.adjacents = this.game.graph.getAdjacents(this);

    this.toDiscard = 0;
    this.hasDeclinedTrade = false;
    //this.canAcceptTrade = false;
    this.hasHeavyPurse = false;

    this.bankTradeRate = DEFAULT_TRADE_RATE;

    this.settlements = [];
    this.roads = [];

  }

  serialize(): HandSerialT {
    throw new CatonlineError('not implemented');
  }

  deserialize(serial: HandSerialT): History {
    throw new CatonlineError('not implemented');
  }

  isCurrentPlayer(): boolean {
    return this.player.equals(this.game.getCurrentParticipant().player);
  }

  isOwner(): boolean {
    return this.game.isOwner(this.player);
  }

  getEdges(): Edge[] {
    return this.game.graph.getAdjacents(this);
  }

  getNumDevCardsInHand(): number {

    let acc: number = 0;
    _.each(this.hand.unplayedDCs, num => acc += num);
    _.each(this.hand.unplayableDCs, num => acc += num);

    return acc;

  }

  getNumResources(): number {

    let acc: number = 0;
    _.each(this.hand.resources, num => acc += num);

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

  canAcceptTrade(): boolean {

    const trade = this.game.currentTrade;
    if (!trade)
      return false;

    if (trade.from.participant.player.equals(this.player))
      return false;

    if (trade.for.participants.indexOf(this) === -1)
      return false;

    return this.hand.canAfford(trade.for.cards);

  }

  canBuild(obj: string): boolean {

    const scenario = scenarios[this.game.params.scenario];
    if (!(obj in scenario.buyable))
      throw new CatonlineError(`cannot calculate canBuild(): unrecognized object "${obj}"`);

    const cost = scenario.buyable[obj].cost;

    switch (obj) {

      case 'city':
        return this.hand.canAfford(cost) && this.getNumCities() < scenario.buyable.city.max_num;

      case 'road':
      case 'settlement':
      case 'dev card':
        throw new CatonlineError('not implemented');

      default:
        throw new CatonlineError(`cannot calculate canBuild(): unrecognized object "${obj}"`);

    }
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
