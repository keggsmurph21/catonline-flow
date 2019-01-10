// @flow

export const offsetsByClockPosition = {
  '1':  { x:  1, y:  0, z: -1 },
  '2':  { x:  2, y: -1, z: -1 },
  '3':  { x:  1, y: -1, z:  0 },
  '4':  { x:  1, y: -2, z:  1 },
  '5':  { x:  0, y: -1, z:  1 },
  '6':  { x: -1, y: -1, z:  2 },
  '7':  { x: -1, y:  0, z:  1 },
  '8':  { x: -2, y:  1, z:  1 },
  '9':  { x: -1, y:  1, z:  0 },
  '10': { x: -1, y:  2, z: -1 },
  '11': { x:  0, y:  1, z: -1 },
  '12': { x:  1, y:  1, z: -2 },
};

export const GAME_PARAM_ISPUBLIC_DEFAULT = true;

export const GAME_PARAM_SCENARIO_OPTIONS = [ 'standard' ];
export const GAME_PARAM_SCENARIO_DEFAULT = GAME_PARAM_SCENARIO_OPTIONS[0];

export const GAME_PARAM_PORTSTYLE_OPTIONS = [ 'fixed', 'random' ];
export const GAME_PARAM_PORTSTYLE_DEFAULT = GAME_PARAM_PORTSTYLE_OPTIONS[0];

export const GAME_PARAM_TILESTYLE_OPTIONS = [ /*'fixed', */'random' ];
export const GAME_PARAM_TILESTYLE_DEFAULT = GAME_PARAM_TILESTYLE_OPTIONS[0];

export const GAME_PARAM_NUMCOMPUTERS_MIN = 0;
export const GAME_PARAM_NUMCOMPUTERS_MAX = 0;
export const GAME_PARAM_NUMCOMPUTERS_DEFAULT = 0;

export const GAME_PARAM_NUMHUMANS_MIN = 0;
export const GAME_PARAM_NUMHUMANS_MAX = 5;
export const GAME_PARAM_NUMHUMANS_DEFAULT = 4;

export const GAME_PARAM_VPGOAL_MIN = 8;
export const GAME_PARAM_VPGOAL_MAX = 12;
export const GAME_PARAM_VPGOAL_DEFAULT = 10;

export const DEVCARD_NAMES_MAP = {
  vp: { singular: 'victory point', plural: 'victory points' },
  knight: { singular: 'knight', plural: 'knights' },
  monopoly: { singular: 'monopoly', plural: 'monopolies' },
  rb: { singular: 'road builder', plural: 'road builders' },
  yop: { singular: 'year of plenty', plural: 'year of plenties' },
};
