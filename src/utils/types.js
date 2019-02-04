// @flow strict

/*
import type { Game } from '../core/game';
import type { Board } from '../core/board';
import type { Hex } from '../core/board/hex';
import type { Junc } from '../core/board/junc';
import type { Port } from '../core/board/port';
import type { Road } from '../core/board/road';
*/
import type { Participant } from '../core/game/participant';
import type { Hand } from '../core/game/participant/hand';
import type { Player } from '../core/player';
import type { Edge, EdgeArgument, EdgeResult } from '../core/graph';

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

//export type ScenarioDevCardsT = { count: number };

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
  devCards: { [string]: number },
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

export type PortRenderT = $TODO;

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

export type PlayerMapT = {
  [PlayerIDT]: Player
};

export type GameSerialT = {

  initialConditions: InitialConditionsT,
  history: HistorySerialT,

};

export type BoardSerialT = $TODO;
export type HexSerialT = $TODO;
export type JuncSerialT = $TODO;
export type PortSerialT = $TODO;
export type RoadSerialT = $TODO;
export type PlayerSerialT = $TODO;
export type ParticipantSerialT = $TODO;
export type StateSerialT = $TODO;
export type HistorySerialT = $TODO;
export type HandSerialT = $TODO;

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
  with: {
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
  owner: PlayerIDT,
  players: PlayerIDT[],
  board: {
    hexes: string[],
    ports: string[],
  },
  deck: string[], // card.type
};

export type PublicStateT = $TODO;

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

export type RawEdgeArgumentT = string | void;
export type EdgeArgumentSerialT = string;

export type RawEdgeResultT = string;
export type EdgeResultSerialT = string;

export type HistoryItemT = {
  participant: Participant,
  edge: Edge,
  args: EdgeArgument,
  result: EdgeResult,
};

export type HistoryItemSerialT = string;/*{
  participantNum: number,
  edgeName: string,
  argString: EdgeArgumentSerialT,
  resultString: EdgeResultSerialT,
};*/

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

export type { Board } from '../core/board';
export type { BoardNode } from '../core/board/board-node';
export type { CoordinateCache } from '../core/board/cache';
export type { DiceValue } from '../core/board/dice-value';
export type { Hex } from '../core/board/hex';
export type { Junc } from '../core/board/junc';
export type { Port } from '../core/board/port';
export type { Resource } from '../core/board/resource';
export type { Road } from '../core/board/road';
export type { Robber } from '../core/board/robber';

export type { Game } from '../core/game';
export type { Participant } from '../core/game/participant';
export type { Hand } from '../core/game/participant/hand';
export type { Bank } from '../core/game/bank';
export type { DevCardDeck } from '../core/game/dev-card-deck';
export type { DevCard } from '../core/game/dev-card';
export type { Dice } from '../core/game/dice';
export type { History } from '../core/game/history';

export type { Player } from '../core/player';
export type { Computer } from '../core/player/computer';
export type { Human } from '../core/player/human';

export type { Graph, Edge, EdgeArgument, EdgeResult, Vertex } from '../core/graph';
