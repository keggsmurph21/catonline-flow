// @flow strict

import type {

  Board,
  CartesianCoordsT,
  ClockPosition,
  CostT,
  CubeCoordsT,
  Game,
  OffsetsT,
  ParityT,
  RawEdgeArgumentT,
  RenderedCoordsT,

} from './types';
import _ from 'underscore';
import { offsetsByClockPosition } from './consts';
import { CatonlineError, EdgeArgumentError } from './errors';

export function cartesianToCube(coords: CartesianCoordsT): CubeCoordsT {

  throw new CatonlineError('not implemented');

}

export function cartesianToRendered(coords: CartesianCoordsT): RenderedCoordsT {

  return {
    x: coords.x * Math.cos(Math.PI/6),
    y: coords.y * 1.5,
  };

}

export function cubeToCartesian(coords: CubeCoordsT): CartesianCoordsT {

  return {
    x: coords.x - coords.y,
    y: coords.z,
  };

}

export function cubeToRendered(coords: CubeCoordsT): RenderedCoordsT {

  const cartesianCoords: CartesianCoordsT = cubeToCartesian(coords);
  return cartesianToRendered(cartesianCoords);

}

export function pointsArrayToPath(arr: RenderedCoordsT[]): string {
  return arr
    .map((point, i) => {
      return (i ? 'L ' : 'M ') + point.x + ',' + point.y;
    })
    .join(' ');
}

export function pointsArrayToString(arr: RenderedCoordsT[]): string {
  return arr
    .map(point => point.x + ',' + point.y)
    .join(' ');
}

export function round(num: number, places: number = 0): number {

  const exp = 10 ** places;
  return Math.round(num * exp) / exp;

}

export function thin<T>(arg: T): T | void {
  // flowlint-next-line sketchy-null-mixed:off
  return !!arg
    ? arg
    : undefined;
}

export function eachOffset(
    parity: ParityT
  , factor: number
  , callback: (offset: CubeCoordsT, clock: string) => void) {

  for (let i = 1; i <= 12; i++) {
    if (!!(i % 2) == (parity === 'odd')) {

      const offset = {
        x: offsetsByClockPosition[i].x * factor,
        y: offsetsByClockPosition[i].y * factor,
        z: offsetsByClockPosition[i].z * factor,
      };

      callback(offset, '' + i); // cast to string

    }
  }
}

export function getOffsets(parity: string, factor: number = 1): OffsetsT {

  let offsets = {};
  for (let i = 1; i <= 12; i++) {
    if (!!(i % 2) == (parity === 'odd')) {
      offsets[i] = {
        x: offsetsByClockPosition[i].x * factor,
        y: offsetsByClockPosition[i].y * factor,
        z: offsetsByClockPosition[i].z * factor,
      };
    }
  }

  return offsets;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomChoice<T>(arr: T[]): T {

  let i = getRandomInt(0, arr.length - 1);
  return arr[i];

}

export function shuffle<T>(arr: T[]) {

  // in-place

  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    const _tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = _tmp;
  }

}

export function hashToHexColor(str: string): string {

  let hash: number = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;

}

export function objectsMatch<T>(obj1: {} | T[], obj2: {} | T[]): boolean {
  return _.isMatch(obj1, obj2) && _.isMatch(obj2, obj1);
}

export function cubeDistance(p: CubeCoordsT, q: CubeCoordsT) {
  return (p.x - q.x) + (p.y - q.y) + (p.z - q.z);
}

export function print(b: Board) {

  function frame(i) {
    const { x, y } = i.getRenderedCoords();
    dims.minX = Math.min(x, dims.minX);
    dims.maxX = Math.max(x, dims.maxX);
    dims.minY = Math.min(y, dims.minY);
    dims.maxY = Math.max(y, dims.maxY);
  }

  function lock(x) {
    return round(x * 4 * width, 0);
  }

  function place(i) {

    let { x, y } = i.getRenderedCoords();
    x = lock(x) - dims.minX;
    y = lock(y) - dims.minY;

    if (m[x][y] !== ' '.repeat(width))
      throw new Error('overlap');

    m[x][y] = pad(i.id);

  }

  function pad(num) {
    return (num + ' '.repeat(width)).slice(0, width);
  }

  var width = 3;

  var dims = {
    minX:  Infinity,
    maxX:  -Infinity,
    minY:  Infinity,
    maxY:  -Infinity,
  };

  _.each(b.hexes, frame);
  _.each(b.juncs, frame);
  _.each(b.roads, frame);

  dims.minX = lock(dims.minX);
  dims.maxX = lock(dims.maxX);
  dims.minY = lock(dims.minY);
  dims.maxY = lock(dims.maxY);

  var m = [];
  for (let i = dims.minX; i <= dims.maxX; i++) {
    let n = [];
    for (let j = dims.minY; j <= dims.maxY; j++) {
      n.push(' '.repeat(width));
    }
    m.push(n);
  }

  try {

    _.each(b.hexes, place)
    _.each(b.juncs, place)
    _.each(b.roads, place)

  } catch (e) {
    console.log(dims);
    throw e;
  }

  return m.map(n => n.join('')).join('\n');

}

export function parseIndex(name: string, s: RawEdgeArgumentT): number {

  if (typeof s !== 'string')
    throw new EdgeArgumentError(`invalid argument type to "${name}" ("${typeof s}")`);

  if (s.length === 0)
    throw new EdgeArgumentError(`missing argument to "${name}" (undefined)`)

  return parseInt(s);

}

export function parseCost(game: Game, s: RawEdgeArgumentT): CostT {

  if (typeof s !== 'string')
    throw new EdgeArgumentError(`invalid argument type to "cost" ("${typeof s}")`);

  let cost = {};

  (s || '').split(/;/).forEach(pair => {

    let [key, value] = pair.split(':');
    key = parseResource(game, key)

    if (cost[key] === undefined)
      cost[key] = 0;

    value = parseInt(value);

    if (isNaN(value))
      throw new EdgeArgumentError(`invalid resource quantity "${value}" ("${s}")`);

    if (value < 1)
      throw new EdgeArgumentError(`invalid resource quantity < 1 ("${s}")`);

    cost[key] += value;

  });

  if (Object.keys(cost).length === 0)
    throw new EdgeArgumentError(`must specify at least one resource ("${s}")`);

  return cost;

}

export function parseResource(game: Game, s: RawEdgeArgumentT): string {

  const allResources = Object.keys(game.board.scenario.resources);

  if (typeof s !== 'string')
    throw new EdgeArgumentError(`invalid argument type to "resource" ("${typeof s}")`);

  if (allResources.indexOf(s) < 0)
    throw new EdgeArgumentError(`unrecognized resource name "${s}"`);

  return s;

}

export function costToString(cost: CostT): string {
  return _.map(cost, (num: number, resource: string) => {
    return resource + ':' + num;
  }).join(';');
}
