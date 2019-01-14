// @flow

import _ from 'underscore';
import type { Edge, Vertex } from '../../graph';
import type { HandSerialT, ParticipantSerialT, PublicStateT, TradeRateT } from '../../../utils';
import { CatonlineError, Serializable } from '../../../utils';
import { BANK_TRADE_RATES as DEFAULT_TRADE_RATE } from '../../../utils';
import { Player } from '../../player';
import { Game } from '..';
import { Hand } from './hand';

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
    return false;
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
