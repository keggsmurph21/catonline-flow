'use strict';

const _ = require('underscore');
const expect = require('chai').expect;
const scenarios = require('../lib/core/scenarios').scenarios;
const Board = require('../lib/core/board').Board
const cubeDistance = require('../lib/utils').cubeDistance;

describe('Board', () => {

  it('should initialize for all scenarios', () => {

    _.each(scenarios, (scenario, name) => {

      expect(() => new Board(scenario)).to.not.throw();

    });

  });

  it('should spit out a valid board', () => {

    // do this a bunch of times to see if we ever fail
    for (let i = 0; i < 100; i++) {
      _.each(scenarios, (scenario, name) => {

        const board = new Board(scenario);

        // test the hexes
        _.each(board.hexes, hex => {

          let acc = 0;
          hex.eachNeighbor(neighbor => {
            acc++;
            expect(cubeDistance(hex.coords, neighbor.coords)).to.equal(0);
          });

          if (hex.isOcean) {
            expect(acc < 6).to.equal(true);
          } else {
            expect(acc === 6).to.equal(true);
          }

        });

      });
    }

  });

  it('should get neighbor juncs', () => {

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

    expect(getNeighbors(b, 22)).deep.equal([8, 23, 25]);
    expect(getNeighbors(b, 28)).deep.equal([15, 29]);
    expect(getNeighbors(b, 95)).deep.equal([92, 94]);
    expect(getNeighbors(b, 46)).deep.equal([32, 47, 51]);

  });

});
