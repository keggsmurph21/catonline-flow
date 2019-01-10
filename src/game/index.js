// @flow

import _ from 'underscore';
import { Board } from './board';
import { scenarios } from './scenarios';

export var boards: { [string]: Board } = {};
_.each(scenarios, scenario => {
  boards[scenario.name] = new Board(scenario);
});

export { Board } from './board';
export * from './scenarios';
