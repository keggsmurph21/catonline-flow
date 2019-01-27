// @flow strict

import type {

  CostT,
  Hex,
  Junc,
  Game,
  Participant,
  RawEdgeArgumentT,
  Road,
  TradeT,

} from '../../utils';
import _ from 'underscore';
import { CatonlineError, EdgeArgumentError } from '../../utils';

function parseIndex(name: string, s: RawEdgeArgumentT): number {

  if (typeof s !== 'string')
    throw new EdgeArgumentError(`invalid argument type to "${name}" ("${typeof s}")`);

  if (s.length === 0)
    throw new EdgeArgumentError(`missing argument to "${name}" (undefined)`)

  return parseInt(s);

}

function parseCost(game: Game, s: RawEdgeArgumentT): CostT {

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

function parseResource(game: Game, s: RawEdgeArgumentT): string {

  const allResources = Object.keys(game.board.scenario.resources);

  if (typeof s !== 'string')
    throw new EdgeArgumentError(`invalid argument type to "resource" ("${typeof s}")`);

  if (allResources.indexOf(s) < 0)
    throw new EdgeArgumentError(`unrecognized resource name "${s}"`);

  return s;

}

function costToString(cost: CostT): string {
  return _.map(cost, (num: number, resource: string) => {
    return resource + ':' + num;
  }).join(';');
}

export class EdgeArgument {

  type: $TODO;
  values: $TODO[];

  constructor(type: string) {

    this.type = type;

  }

  static fromString(type: string, s: RawEdgeArgumentT, game: Game): EdgeArgument {
    const arg = new EdgeArgument(type);

    let i;

    switch (type) {

      case 'cost':
        const cost = parseCost(game, s);
        arg.values = [cost];
        break;

      case 'diceroll':

        i = parseIndex('diceroll', s);

        // $TODO
        // if (this.DEBUG_MODE) {

          if (isNaN(i))
            throw new EdgeArgumentError(`cannot roll "${i}" ("${s || ''}")`);

          if (i < 2)
            throw new EdgeArgumentError(`cannot roll less than 2 ("${s || ''}")`);

          if (i > 12)
            throw new EdgeArgumentError(`cannot roll greater than 12 ("${s || ''}")`);

          arg.values = [i];

        // } else {
        //    throw new CatonlineError(`You can only do this in DEBUG_MODE`);
        // }

        break;

      case 'hex':

        i = parseIndex('hex', s) + '';
        const hex = game.board.hexes[i];
        if (!hex)
          throw new EdgeArgumentError(`cannot get Hex at "${s || ''}"`);

        arg.values = [hex]
        break;

      case 'junc':

        i = parseIndex('junc', s) + '';
        const junc = game.board.juncs[i];
        if (!junc)
          throw new EdgeArgumentError(`cannot get Junc at "${s || ''}"`);

        arg.values = [junc];
        break;

      case 'null':
        arg.values = [];
        break;

      case 'participant':

        i = parseIndex('participant', s);

        const participant = game.participants[i];
        if (!participant)
          throw new EdgeArgumentError(`cannot get Participant at "${s || ''}")`);

        arg.values = [participant];
        break;

      case 'resource':
        const r = parseResource(game, s);
        arg.values = [r];
        break;

      case 'resource resource':

        if (typeof s !== 'string')
          throw new EdgeArgumentError(`invalid argument type to "resource resource" ("${typeof s}")`);

        arg.values = s.split(/\s/).map(r => parseResource(game, r));
        break;

      case 'road':

        i = parseIndex('road', s) + '';
        const road = game.board.roads[i];
        if (!road)
          throw new EdgeArgumentError(`cannot get Road at "${s || ''}"`);

        arg.values = [road];
        break;

      case 'road road':

        if (typeof s !== 'string')
          throw new EdgeArgumentError(`invalid argument type to "road road" ("${typeof s}")`);

        const slice = s.split(/\s/);
        if (slice.length !== 2)
          throw new EdgeArgumentError(`invalid argument number to "road road" ("${s}")`);

        arg.values = slice.map(i => {

          const road = game.board.roads[i];
          if (!road)
            throw new EdgeArgumentError(`cannot get Road at "${s}"`);

          return road;

        });
        break;

      case 'trade':

        if (typeof s !== 'string')
          throw new EdgeArgumentError(`invalid argument type to "trade" ("${typeof s}")`);

        const words = s.split(/\s/);

        if (words.length !== 4)
          throw new EdgeArgumentError(`too few arguments to "trade" ("${s}")`);

        let [fromP, fromC, withP, withC] = words;

        i = parseInt(words[0]);
        fromP = game.participants[i];
        if (!fromP)
          throw new EdgeArgumentError(`cannot get Participant at "${i}")`);

        fromC = parseCost(game, fromC);

        withP = withP.split(';').map(i => {

          const p = parseIndex('participant', i);
          const participant = game.participants[p];
          if (!participant)
            throw new EdgeArgumentError(`cannot get Participant at "${i}"`);

          return participant;

        });

        withC = parseCost(game, withC);

        const trade: TradeT = {
          from: { participant: fromP, cards: fromC },
          with: { participants: withP, cards: withC },
        };

        arg.values = [trade];
        break;

      default:
        throw new CatonlineError(`unexpected EdgeArgumentType "${type}"`);
    }

    return arg;
  }

  toString(): string {

    let s;

    switch (this.type) {

      case 'cost':
        return costToString(this.getCost());

      case 'diceroll':
        return this.getDiceroll() + '';

      case 'hex':
        return this.getHex().num + '';

      case 'junc':
        return this.getJunc().num + '';

      case 'null':
        return 'null';

      case 'participant':
        return this.getParticipant().num + '';

      case 'resource':
        return this.values[0];

      case 'resource resource':
        return this.values.slice(0, 2).join(' ');

      case 'road':
        return this.getRoad().num + '';

      case 'road road':
        return this.getRoads().map(road => road.num).join(' ');

      case 'trade':

        const trade = this.values[0];

        return [
          trade.from.participant.num + '',
          costToString(trade.from.cards),
          trade.with.participants
            .map(participant => participant.num + '')
            .join(';'),
          costToString(trade.with.cards),
        ].join(' ');

      default:
        throw new CatonlineError(`unexpected EdgeArgumentType "${this.type}"`);

    }
  }

  getCost(): CostT {

    if (this.type !== 'cost')
      throw new CatonlineError(`cannot call getCost() for type "${this.type}"`);

    return this.values[0];

  }

  getDiceroll(): number {

    if (this.type !== 'diceroll')
      throw new CatonlineError(`cannot call getDiceroll for type "${this.type}"`);

    return this.values[0];

  }

  getHex(): Hex {

    if (this.type !== 'hex')
      throw new CatonlineError(`cannot call getHex() for type "${this.type}"`);

    return this.values[0];

  }

  getJunc(): Junc {

    if (this.type !== 'junc')
      throw new CatonlineError(`cannot call getJunc() for type "${this.type}"`);

    return this.values[0];

  }

  getParticipant(): Participant {

    if (this.type !== 'participant')
      throw new CatonlineError(`cannot call getParticipant() for type "${this.type}"`);

    return this.values[0];

  }

  getResourceName(): string {

    if (this.type !== 'resource')
      throw new CatonlineError(`cannot call getResourceName() for type "${this.type}"`);

    return this.values[0];

  }

  getResourceNames(): string[] {

    if (this.type !== 'resource resource')
      throw new CatonlineError(`cannot call getResourceNames() for type "${this.type}"`);

    return this.values.slice(0,2);

  }

  getRoad(): Road {

    if (this.type !== 'road')
      throw new CatonlineError(`cannot call getRoad() for type "${this.type}"`);

    return this.values[0];

  }

  getRoads(): Road[] {

    if (this.type !== 'road road')
      throw new CatonlineError(`cannot call getRoads() for type "${this.type}"`);

    return this.values.slice(0, 2);

  }

  getTrade(): TradeT {

    if (this.type !== 'trade')
      throw new CatonlineError(`cannot call getTrade() for type "${this.type}"`);

    return this.values[0];

  }
}
