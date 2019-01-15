// @flow strict

import _ from 'underscore';
import { offsetsByClockPosition } from './consts';
import type { CartesianCoordsT, ClockPosition, CubeCoordsT, OffsetsT, ParityT, RenderedCoordsT } from './types';
import { CatonlineError } from './errors';

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

  console.log(offsets);
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

// flowlint-next-line unclear-type:off
export function expectToThrow(fn: any => any, err: { name?: string, message?: RegExp }) {
  try {
    fn();
  } catch (e) {

    // flowlint-next-line sketchy-null:off
    if (err.name && e.name !== err.name)
      throw e;

    if (err.message && !err.message.test(e.message))
      throw e;

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
