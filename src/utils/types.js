// @flow strict

/*
// NB: need this block for static deserialize method on Serializable interface,
//       but support does not exist yet :(
import type { Game } from '../core/game';
import type { Board } from '../core/board';
import type { Hex } from '../core/board/hex';
import type { Junc } from '../core/board/junc';
import type { Port } from '../core/board/port';
import type { Road } from '../core/board/road';
*/
import type { Player } from '../core/player';
import type { Participant } from '../core/game/participant';
import type { Hand } from '../core/game/participant/hand';

export type CartesianCoordsT = {
  +x: number,
  +y: number,
};

export type CubeCoordsT = {
  +x: number,
  +y: number,
  +z: number,
};

export type RenderedCoordsT = {
  +x: number,
  +y: number,
};

export type DiceT = number;

export type HexParamsT = {
  coords: CubeCoordsT,
  isOcean: boolean,
  resources?: string,
};

export type PortParamsT = {
  hex: {
    orientation: number,
    coords: CubeCoordsT,
  },
  orientation: [number, number],
  type: string,
}

export type CostT = {
  [string]: number,
};

export type ScenarioDevCardsT = { count: number };

export type ScenarioT = {
  name: string,
  dice: DiceT[],
  topology: HexParamsT[],
  ports: PortParamsT[],
  buyable: {
    [string]: {
      name: string,
      maxNum: number,
      cost: CostT,
    }
  },
  devCards: { [string]: ScenarioDevCardsT },
  resources: {
    [string]: number,
  }
}

export type HexRenderT = {
  cy: number,
  cx: number,
  points: string,
  dice: DiceT,
};

export type JuncRenderT = {
  cx: number,
  cy: number,
};

export type PortRenderT = {};

export type RoadRenderT = {
  path: string,
};

export type GameParamsT = {

  scenario: string,//ScenarioT,
  isPublic: boolean,
  portStyle: string,
  tileStyle: string,
  numComputers: number,
  numHumans: number,
  vpGoal: number,

};

export type SerialT = GameSerialT
  | BoardSerialT
  | HexSerialT
  | JuncSerialT
  | PortSerialT
  | RoadSerialT
  | PlayerSerialT
  | ParticipantSerialT
  | StateSerialT
  | HistorySerialT
  | HandSerialT
  ;

/*
// NB: need this block for static deserialize method on Serializable interface,
//       but support does not exist yet :(
export type DeserialT = Game
  | Board
  | Hex
  | Junc
  | Port
  | Road
  | Player;
*/

export type GameSerialT = {};
export type BoardSerialT = {};
export type HexSerialT = {};
export type JuncSerialT = {};
export type PortSerialT = {};
export type RoadSerialT = {};
export type PlayerSerialT = {};
export type ParticipantSerialT = {};
export type StateSerialT = {};
export type HistorySerialT = {};
export type HandSerialT = {};

export type DevCardParamsT = {
  name: string,
  count: number,
  cost: CostT,
};

export type TradeT = {
  from: {
    participant: Participant,
    cards: CostT,
  },
  for: {
    participants: Participant[],
    cards: CostT,
  },
};

export type TradeRateT = {
  [string]: number,
};

export type InitialConditionsHexT = {
  resource: string,
  dice: number,
};

export type InitialConditionsPortT = string; // port.type

export type InitialConditionsT = {
  params: GameParamsT,
  players: PlayerIDT[],
  board: {
    hexes: { [string]: InitialConditionsHexT },
    ports: { [string]: InitialConditionsPortT },
  },
  deck: string[], // card.type
};

export type PublicStateT = {};

export type PlayerIDT = string;

export type DevCardName = 'vp'
  | 'rb'
  | 'yop'
  | 'knight'
  | 'monopoly';

export type ClockPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type OffsetsT = $ReadOnly<{
  [ClockPosition]: CubeCoordsT
}>;

export type ParityT = 'even' | 'odd';

/*
export type PlayerStateT = {

  id: string,
  vertex: string,
  adjacents: string[],

  isHuman: boolean,
  discard: number,
  hasDeclinedTrade: boolean,
  canAcceptTrade : boolean,
  hasHeavyPurse : boolean,
  bankTradeRates: TradeRateT,
  numKnights: number,
  hand: Hand,

};

export type PublicGameStateT = {

  status: string,
  turn: number,

  isFirstTurn: boolean,
  isSecondTurn: boolean,
  isGameOver: boolean,
  isRollSeven: boolean,
  waiting: Player[],
  canSteal: boolean,
  tradeAccepted: boolean,
  waitForDiscard: boolean,
  currentTrade: TradeT | null,
  currentPlayerID: number,
  hasRolled: boolean,

  largestArmy: number,
  hasLargestArmy: Player | null,
  longestRoad: number,
  hasLongestRoad: Player | null,

  players: PublicPlayerStateT[],

};

export type PublicPlayerStateT = {



};
*/
