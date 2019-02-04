// @flow strict

import type {

  BoardSerialT,
  ClockPosition,
  CubeCoordsT,
  DiceT,
  GameParamsT,
  OffsetsT,
  ScenarioT,

} from '../../utils';
import _ from 'underscore';
import { CatonlineError, eachOffset, getOffsets, Serializable, shuffle } from '../../utils';
import { CoordinateCache } from './cache';
import { BoardNode } from './board-node';
import { Hex } from './hex';
import { Junc } from './junc';
import { Port } from './port';
import { Road } from './road';
import { Resource } from './resource';
import { Robber } from './robber';
import { DiceValue } from './dice-value';

export class Board implements Serializable {

  scenario: ScenarioT;
  hexes: { [string]: Hex };
  juncs: { [string]: Junc };
  ports: { [string]: Port };
  roads: { [string]: Road };

  robber: Robber;

  constructor(scenario: ScenarioT) {

    this.scenario = scenario;
    this.hexes = {};
    this.juncs = {};
    this.ports = {};
    this.roads = {};

    this.robber = new Robber();

    // build structure

    // set up helpers
    var cache = new CoordinateCache();
    var counters = {
      hexes: 0,
      juncs: 0,
      ports: 0,
      roads: 0,
    };

    // create hexes
    scenario.topology.forEach(params => {

      const hex = new Hex(counters.hexes, params, scenario);

      this.hexes['' + counters.hexes] = hex;
      cache.setHex(hex.coords, hex);

      ++counters.hexes;

    });

    // create ports
    scenario.ports.forEach(params => {

      const port = new Port(counters.ports, params);

      this.ports['' + counters.ports] = port;

      ++counters.ports;

    });

    // connect hexes to hexes, juncs, and roads
    _.each(this.hexes, (hex: Hex) => {

      eachOffset('odd', 1, (offset, clockPos) => {

        const coords = hex.offset(offset);
        const neighborHex = cache.getHex(coords);

        hex.hexes[clockPos] = neighborHex;

      });

      eachOffset('even', 1/3, (offset, clockPos) => {

        const coords = hex.offset(offset);
        let junc: BoardNode;

        if (cache.hasJunc(coords)) {

          junc = cache.getJunc(coords);

        } else {

          junc = new Junc(counters.juncs, coords);
          this.juncs['' + counters.juncs] = junc;
          cache.setJunc(coords, junc);

          ++counters.juncs;

        }

        hex.juncs[clockPos] = junc;

      });

      eachOffset('odd', 1/2, (offset, clockPos) => {

        const coords = hex.offset(offset);
        let road: BoardNode;

        if (cache.hasRoad(coords)) {

          road = cache.getRoad(coords);

        } else {

          road = new Road(counters.roads, coords);
          this.roads['' + counters.roads] = road;
          cache.setRoad(coords, road);

          ++counters.roads;

        }

        if (!hex.isOcean)
          road.isPaveable = true;
          
        hex.roads[clockPos] = road;

      });

    });

    // connect juncs to juncs, hexes, and roads
    _.each(this.juncs, (junc: Junc) => {

      eachOffset('even', 1/3, (offset, clockPos) => {

        const coords = junc.offset(offset);

        const neighborJunc = cache.getJunc(coords);
        junc.juncs[clockPos] = neighborJunc;

        const hex = cache.getHex(coords);
        junc.hexes[clockPos] = hex;

      });

      eachOffset('even', 1/6, (offset, clockPos) => {

        const coords = junc.offset(offset);
        const road = cache.getRoad(coords);
        junc.roads[clockPos] = road;

      });

      // enforce all juncs that are "settleable" are near some resource
      _.each(junc.hexes, hex => {
        if (hex && !hex.isOcean)
          junc.isSettleable = true;
      });

    });

    // set port coords and connect port to underlying road
    _.each(this.ports, (port: Port) => {
      port.bindToRoad(cache);
    });

    // connect roads to roads, hexes, and juncs
    _.each(this.roads, (road: Road) => {

      eachOffset('odd', 1/2, (offset, clockPos) => {

        const coords = road.offset(offset);

        const neighborRoad = cache.getRoad(coords);
        road.roads[clockPos] = neighborRoad;

        const hex = cache.getHex(coords);
        road.hexes[clockPos] = hex;

      });

      eachOffset('even', 1/6, (offset, clockPos) => {

        const coords = road.offset(offset);
        const junc = cache.getJunc(coords);
        road.juncs[clockPos] = junc;

      });
    });

  }

  randomize(params: GameParamsT) {

    // shuffle resources
    let resources: Resource[] = [];
    _.each(this.scenario.resources, (count: number, name: string) => {
      if (name !== 'ocean')
        for (let i = 0; i < count; i++) {

          const res = new Resource(name);
          resources.push(res);

        }
    });
    shuffle(resources);

    // shuffle dicevalues (maybe)
    let dice: DiceT[] = [...this.scenario.dice];
    if (params.tileStyle === 'random')
      shuffle(dice);

    // place resources and dicevalues
    const nullDice = { roll: 0, dots: 0 };
    _.each(this.hexes, (hex: Hex, i: string) => {

      if (hex.isOcean) {

        const res = new Resource('ocean');
        hex.resource = res;
        hex.dice = new DiceValue(0);

      } else {

        const res = resources.pop();
        hex.resource = res;

        if (res.name === 'desert') {

          hex.dice = new DiceValue(0);
          this.robber.moveTo(hex);

        } else {

          hex.dice = new DiceValue(dice.pop());

        }

      }
    });

    // make sure this is a legal configuration
    if (!this.isLegal())
      return this.randomize(params);

    // (shuffle and) place the ports
    const ports = this.scenario.ports.map(port => port.type);
    if (params.portStyle === 'random')
      shuffle(ports);

    _.each(this.ports, port => {
      port.type = ports.pop();
    });

  }

  isLegal(): boolean {

    let isLegal: boolean = true;

    _.each(this.hexes, hex => {
      if (hex.dice.value === 6 || hex.dice.value === 8) {
        hex.eachNeighbor(neighbor => {
          if (neighbor.dice.value === 6 || neighbor.dice.value === 8) {

            isLegal = false;

          }
        });
      }
    });

    return isLegal;

  }

  serialize(): BoardSerialT {

    return {
      hexes: _.map(this.hexes, hex => hex.serialize()),
    };

  }

  static deserialize(serial: BoardSerialT): Board {
    throw new CatonlineError('not implemented');
  }

  getById() {

  }

  getHexById() {

  }

  getJuncById() {

  }

  getRoadById() {

  }

  /*
  toSVG() {

    const $ = cheerio.load(bootstrapSVG),
      TILE_CHIP_RADIUS = 0.55,
      TILE_TEXT_OFFSET_Y = "-0.13em",
      TILE_CHIP_DOTS_OFFSET_Y = 0.35,
      TILE_CHIP_DOTS_OFFSET_X = 0.075,
      TILE_CHIP_DOTS_RADIUS = 0.05;

    $('svg')
      .attr('viewBox', '-2 -1.5 15 12')

    _.each(this.hexes, hex => {
      $('svg').append((() => {

        const rendered = hex.render();
        const $ = cheerio.load(`<g class="tile-group clickable"> type="title" id="tile_${hex.id}" num="${hex.id}">`);

        $('.tile-group')
          .append(`<polygon points="${rendered.points}" style="fill:#2d2;">`)
          .append('<g class="tile-chip">')
          .append('<title>');

        $('.tile-chip')
          .append(`<circle class="tile-chip-circle" cx="${rendered.cx}" cy="${rendered.cy}" r="${TILE_CHIP_RADIUS}" style="fill:#ccc;">`)
          .append(`<text x="${rendered.cx}" y="${rendered.cy}" dy="${TILE_TEXT_OFFSET_Y}">`)
          .append('<g class="tile-chip-dots">')

        $('.tile-chip text').css('font-size', '0.1em').css('color', 'aqua').text(rendered.roll);

        $('.tile-chip-dots')
          .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-4}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-3}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-2}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9 chip-dot-3 chip-dot-11" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*-1}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10 chip-dot-2 chip-dot-12" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*0}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9 chip-dot-3 chip-dot-11" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*1}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8 chip-dot-4 chip-dot-10" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*2}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-5 chip-dot-9" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*3}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`)
          .append(`<circle class="tile-chip-dot chip-dot-6 chip-dot-8" cx="${rendered.cx + TILE_CHIP_DOTS_OFFSET_X*4}" cy="${rendered.cy + TILE_CHIP_DOTS_OFFSET_Y}" r="${TILE_CHIP_DOTS_RADIUS}">`);

        return $('.tile-group');

      })());
    });

    _.each(this.ports, port => {

    });

    _.each(this.roads, road => {
      $('svg').append((() => {

        const rendered = road.render();
        const $ = cheerio.load(`<g class="road-group clickable" type="road" id="num_${road.id}" num="${road.id}">`);

        $('.road-group')
          .append(`<path d="${rendered.path}" style="stroke-width:0.1; stroke:#555;">`)
          .append('<title>');

        return $('.road-group');

      })());
    });

    _.each(this.juncs, junc => {

      const rendered = junc.render();
      $('svg').append(`<circle cx="${rendered.cx}" cy="${rendered.cy}" r="0.2">`);

    });

    return $.html();

  }
  */
}
