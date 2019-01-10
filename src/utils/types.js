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

export type ResourceCostT = {
  [string]: number,
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

export type ScenarioT = {
  name: string,
  dice: DiceT[],
  topology: HexParamsT[],
  ports: PortParamsT[],
  buyable: {
    [string]: {
      name: string,
      max_num: number,
      cost: ResourceCostT,
    }
  },
  developmentCards: {
    [string]: {
      count: number,
      name: {
        singular: string,
        plural: string,
      }
    }
  },
  resources: {
    [string]: {
      count: number,
      yields: boolean,
    }
  }
}

export type HexRenderT = {
  cy: number,
  cx: number,
  points: string,
  dice: ?DiceT,
};
