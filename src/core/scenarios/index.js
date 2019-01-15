// @flow strict

import { readFileSync } from 'fs';
import { join } from 'path';
// flowlint-next-line untyped-import:off
import { parse } from 'toml';
import type { ScenarioT } from '../../utils';
import { GAME_PARAM_SCENARIO_OPTIONS as scenarioNames } from '../../utils';

const scenarioDir = join('assets', 'scenarios');
const scenarioExt = '.toml';

function _parse(scenarioName: string): ScenarioT {

  const scenarioPath = join(scenarioDir, scenarioName + scenarioExt);
  const scenarioBuf = readFileSync(scenarioPath);
  const scenarioStr = scenarioBuf.toString();

  return parse(scenarioStr);

}

export let scenarios: { [string]: ScenarioT } = {};
scenarioNames.forEach(name => {

  scenarios[name] = _parse(name);

});
