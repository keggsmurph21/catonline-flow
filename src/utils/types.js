// @flow

export type CartesianCoordsT = {
  type: string,
  x: number,
  y: number,
};

export type CubeCoordsT = {
  type: string,
  x: number,
  y: number,
  z: number,
};

export type RenderedCoordsT = {
  type: string,
  x: number,
  y: number,
};

export type DiceT = {
  roll: ?number,
  dots: ?number,
};

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

export type ScenarioT = {
  name: string,
  dice: DiceT[],
  topology: HexParamsT[],
  ports: PortParamsT[],
  buyable: {
    [string]: {
      name: string,
      max_num: number,
      cost: CostT,
    }
  },
  devCards: {
    [string]: {
      count: number,
    }
  },
  resources: {
    [string]: number,
  }
}

export type HexRenderT = {
  cy: number,
  cx: number,
  points: string,
  dice: ?DiceT,
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

  scenario: ScenarioT,
  isPublic: boolean,
  portStyle: string,
  tileStyle: string,
  numComputers: number,
  numHumans: number,
  vpGoal: number,

};

export type GameSerialT = {};
export type BoardSerialT = {};
export type HexSerialT = {};
export type JuncSerialT = {};
export type PortSerialT = {};
export type RoadSerialT = {};
    
export type DevCardParamsT = {
  name: string,
  count: number,
  cost: CostT,
}
