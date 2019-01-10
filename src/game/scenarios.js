// @flow

import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { parse } from 'toml';

import type { CubeCoordsT, ScenarioT } from '../utils';

const scenarioDir = join('assets', 'scenarios');
console.log(resolve(scenarioDir))

function _parse(scenarioName: string): ScenarioT {

  const scenarioPath = join(scenarioDir, scenarioName);
  const scenarioBuf = readFileSync(scenarioPath);
  const scenarioStr = scenarioBuf.toString();

  return parse(scenarioStr);

}

export const scenarios = {

  standard: _parse('standard.toml'),

}
