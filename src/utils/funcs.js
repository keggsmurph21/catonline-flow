// @flow

import { offsetsByClockPosition } from './consts';
import type { CartesianCoordsT, CubeCoordsT, RenderedCoordsT } from './types';
import { CatonlineError } from './errors';

export function cartesianToCube(coords: CartesianCoordsT): CubeCoordsT {

  throw new CatonlineError('not implemented');

}

export function cartesianToRendered(coords: CartesianCoordsT): RenderedCoordsT {

  return {
    type: 'rendered',
    x: coords.x * Math.cos(Math.PI/6),
    y: coords.y * 1.5,
  };

}

export function cubeToCartesian(coords: CubeCoordsT): CartesianCoordsT {

  return {
    type: 'cartesian',
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

export function thin(arg: any): any {
  return !!arg
    ? arg
    : undefined;
}

export function getOffsets(parity: string, factor: number = 1): { [number]: { x: number, y: number, z: number } } {

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
