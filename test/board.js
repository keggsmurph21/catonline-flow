'use strict';

const _ = require('underscore');
const scenarios = require('../lib/core/scenarios').scenarios;
const Board = require('../lib/core/board').Board
const cubeDistance = require('../lib/utils').cubeDistance;

test('should initialize for all scenarios', () => {

  _.each(scenarios, (scenario, name) => {

    expect(() => new Board(scenario)).not.toThrow();

  });

});

test('should spit out a valid board', () => {

  // do this a bunch of times to see if we ever fail
  for (let i = 0; i < 100; i++) {
    _.each(scenarios, (scenario, name) => {

      const board = new Board(scenario);

      // test the hexes
      _.each(board.hexes, hex => {

        let acc = 0;
        hex.eachNeighbor(neighbor => {
          acc++;
          expect(cubeDistance(hex.coords, neighbor.coords)).toBe(0);
        });

        if (hex.isOcean) {
          expect(acc < 6).toBe(true);
        } else {
          expect(acc === 6).toBe(true);
        }

      });

    });
  }

});

test('should get neighbor juncs', () => {

  function getNeighbors(b, src) {

    return Array
      .from(b.juncs[src].getNeighbors())
      .map(n => n.num)
      .sort((x, y) => {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
      });

  }

  let b;

  b = new Board(scenarios.standard);

  expect(getNeighbors(b, 22)).toEqual([8, 23, 25]);
  expect(getNeighbors(b, 28)).toEqual([15, 29]);
  expect(getNeighbors(b, 95)).toEqual([92, 94]);
  expect(getNeighbors(b, 46)).toEqual([32, 47, 51]);

});
