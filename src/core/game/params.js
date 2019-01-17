// @flow strict

import type {

  GameParamsT,

} from '../../utils';
import {

  InvalidGameParamsError,

  GAME_PARAM_ISPUBLIC_DEFAULT,

  GAME_PARAM_SCENARIO_OPTIONS,
  GAME_PARAM_SCENARIO_DEFAULT,

  GAME_PARAM_PORTSTYLE_OPTIONS,
  GAME_PARAM_PORTSTYLE_DEFAULT,

  GAME_PARAM_TILESTYLE_OPTIONS,
  GAME_PARAM_TILESTYLE_DEFAULT,

  GAME_PARAM_NUMCOMPUTERS_MIN,
  GAME_PARAM_NUMCOMPUTERS_MAX,
  GAME_PARAM_NUMCOMPUTERS_DEFAULT,

  GAME_PARAM_NUMHUMANS_MIN,
  GAME_PARAM_NUMHUMANS_MAX,
  GAME_PARAM_NUMHUMANS_DEFAULT,

  GAME_PARAM_VPGOAL_MIN,
  GAME_PARAM_VPGOAL_MAX,
  GAME_PARAM_VPGOAL_DEFAULT,

} from '../../utils';
import { scenarios } from '../scenarios';

function assertValidType(params: {}, name: string, expected: string) {

  const value = params[name];

  if (typeof value !== expected)
    throw new InvalidGameParamsError(`Invalid game parameter value for "${name}": `
      + `expected type "${expected}" got "${typeof value}"`);

}

function assertValidOption(params: {}, name: string, choices: string[]) {

  const value = params[name];

  if (choices.indexOf(value) === -1)
    throw new InvalidGameParamsError(`Invalid game parameter value for "${name}": `
      + `expected one of ["${choices.join('","')}"] got "${value}"`);

}

function assertValidRange(params: {}, name: string, min: number, max: number) {

  const value = params[name];

  if (value < min)
    throw new InvalidGameParamsError(`Invalid game parameter value for "${name}": `
      + `"${value}" less than minimum "${min}"`);

  if (value > max)
    throw new InvalidGameParamsError(`Invalid game parameter value for "${name}": `
      + `"${value}" greater than maximum "${max}"`);

}

export function validate(raw: GameParamsT): GameParamsT {

  assertValidType(raw, 'isPublic', 'boolean');

  assertValidType(raw, 'scenario', 'string');
  assertValidOption(raw, 'scenario', GAME_PARAM_SCENARIO_OPTIONS);

  assertValidType(raw, 'portStyle', 'string');
  assertValidOption(raw, 'portStyle', GAME_PARAM_PORTSTYLE_OPTIONS);

  assertValidType(raw, 'tileStyle', 'string');
  assertValidOption(raw, 'tileStyle', GAME_PARAM_TILESTYLE_OPTIONS);

  assertValidType(raw, 'numComputers', 'number');
  assertValidRange(raw, 'numComputers', GAME_PARAM_NUMCOMPUTERS_MIN, GAME_PARAM_NUMCOMPUTERS_MAX);

  assertValidType(raw, 'numHumans', 'number');
  assertValidRange(raw, 'numHumans', GAME_PARAM_NUMHUMANS_MIN, GAME_PARAM_NUMHUMANS_MAX);

  assertValidType(raw, 'vpGoal', 'number');
  assertValidRange(raw, 'vpGoal', GAME_PARAM_VPGOAL_MIN, GAME_PARAM_VPGOAL_MAX);

  // extra check that is redundant as long as we keeps utils/consts consistent
  if (!(raw.scenario in scenarios)) {

    const msg = `no scenario with name "${raw.scenario}"`;
    throw new InvalidGameParamsError(msg);

  }

  return {

    scenario: /*scenarios[*/raw.scenario/*]*/,
    isPublic: raw.isPublic,
    portStyle: raw.portStyle,
    tileStyle: raw.tileStyle,
    numComputers: raw.numComputers,
    numHumans: raw.numHumans,
    vpGoal: raw.vpGoal,

  };

}

export const defaults = {

  scenario: GAME_PARAM_SCENARIO_DEFAULT, // NB: this is a string!
  isPublic: GAME_PARAM_ISPUBLIC_DEFAULT,
  portStyle: GAME_PARAM_PORTSTYLE_DEFAULT,
  tileStyle: GAME_PARAM_TILESTYLE_DEFAULT,
  numComputers: GAME_PARAM_NUMCOMPUTERS_DEFAULT,
  numHumans: GAME_PARAM_NUMHUMANS_DEFAULT,
  vpGoal: GAME_PARAM_VPGOAL_DEFAULT,

};
