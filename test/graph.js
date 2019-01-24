'use strict';

const _ = require('underscore');
const utils = require('../lib/utils');
const expect = require('chai').expect;
const Game = require('../lib/core/game').Game;
const defaults = require('../lib/core/game').defaults;
const Human = require('../lib/core/player').Human;

function getExpectation(g) {
  return {

    turn: 1,
    canSteal: false,
    currentTrade: null,
    currentParticipantID: 0,
    hasRolled: false,
    largestArmy: 2,
    hasLargestArmy: null,
    longestRoad: 4,
    hasLongestRoad: null,
    historyLength: 0,
    isFirstTurn: true,
    isSecondTurn: false,
    isOver: false,
    isRollSeven: false,
    isFull: true,
    getWaiting: [g.getCurrentParticipant()],
    getStatus: 'in-progress',

    p: g.participants.map(p => {
      return {

        toDiscard: 0,
        hasDeclinedTrade: false,
        hasHeavyPurse: false,
        bankTradeRate: g.bank.DEFAULT_TRADE_RATE,
        settlements: [],
        roads: [],
        getPublicScore: 0,
        getPrivateScore: 0,
        getNumDevCards: 0,
        getNumDevCardsInHand: 0,
        getNumResources: 0,
        getNumSettlements: 0,
        getNumCities: 0,
        getNumRoads: 0,
        //getLongestRoad: [],
        //getLargestArmy: 0,
        canAcceptCurrentTrade: false,
        canTradeWithBank: false,
        canBuild_city: false,
        canBuild_devCard: false,
        canBuild_road: false,
        canBuild_settlement: false,
        canPlayDevCard_knight: false,
        canPlayDevCard_monopoly: false,
        canPlayDevCard_rb: false,
        canPlayDevCard_vp: false,
        canPlayDevCard_yop: false,

        vertexName: '_v_end_turn',
        edgeNames: [],

      };
    })

  };
}

function createGame(numHumans) {

  defaults.numHumans = numHumans;

  const owner = new Human('owner');
  const game = new Game(owner, defaults);

  for (let i = 1; i < numHumans; i++) {

    const name = 'player_' + (i+1);
    const human = new Human(name);
    game.addPlayer(human);

  }

  game.begin();

  return game;

}

function checkGraph(g, e) {

  // test some graph stuff
  expect(g.turn).to.equal(e.turn);
  expect(g.canSteal).to.equal(e.canSteal);
  expect(g.currentTrade).to.equal(e.currentTrade);
  expect(g.currentParticipantID).to.equal(e.currentParticipantID);
  expect(g.hasRolled).to.equal(e.hasRolled);
  expect(g.largestArmy).to.equal(e.largestArmy);
  expect(g.hasLargestArmy).to.equal(e.hasLargestArmy);
  expect(g.longestRoad).to.equal(e.longestRoad);
  expect(g.hasLongestRoad).to.equal(e.hasLongestRoad);
  expect(g.history.length).to.equal(e.historyLength);
  expect(g.isFirstTurn()).to.equal(e.isFirstTurn);
  expect(g.isSecondTurn()).to.equal(e.isSecondTurn);
  //expect(g.isOver()).to.equal(e.isOver);
  expect(g.isRollSeven()).to.equal(e.isRollSeven);
  expect(g.isFull()).to.equal(e.isFull);
  expect(g.getWaiting()).to.deep.equal(e.getWaiting);
  expect(g.getStatus()).to.equal(e.getStatus);

  g.participants.forEach((p, i) => {

    expect(p.toDiscard).to.equal(e.p[i].toDiscard);
    expect(p.hasDeclinedTrade).to.equal(e.p[i].hasDeclinedTrade);
    expect(p.hasHeavyPurse).to.equal(e.p[i].hasHeavyPurse);
    expect(p.bankTradeRate).to.equal(e.p[i].bankTradeRate);
    expect(p.settlements.map(s => s.num)).to.deep.equal(e.p[i].settlements);
    expect(p.roads.map(r => r.num)).to.deep.equal(e.p[i].roads);
    expect(p.getPublicScore()).to.equal(e.p[i].getPublicScore);
    expect(p.getPrivateScore()).to.equal(e.p[i].getPrivateScore);
    expect(p.getNumDevCards()).to.equal(e.p[i].getNumDevCards);
    expect(p.getNumDevCardsInHand()).to.equal(e.p[i].getNumDevCardsInHand);
    expect(p.getNumResources()).to.equal(e.p[i].getNumResources);
    expect(p.getNumSettlements()).to.equal(e.p[i].getNumSettlements);
    expect(p.getNumCities()).to.equal(e.p[i].getNumCities);
    expect(p.getNumRoads()).to.equal(e.p[i].getNumRoads);
    //expect(p.getLongestRoad()).to.deep.equal(e.p[i].getLongestRoad);
    //expect(p.getLargestArmy()).to.equal(e.p[i].getLargestArmy);
    expect(p.canAcceptCurrentTrade()).to.equal(e.p[i].canAcceptCurrentTrade);
    expect(p.canTradeWithBank()).to.equal(e.p[i].canTradeWithBank);
    expect(p.canBuild('city')).to.equal(e.p[i].canBuild_city);
    expect(p.canBuild('devCard')).to.equal(e.p[i].canBuild_devCard);
    expect(p.canBuild('road')).to.equal(e.p[i].canBuild_road);
    expect(p.canBuild('settlement')).to.equal(e.p[i].canBuild_settlement);
    expect(p.canPlayDevCard('knight')).to.equal(e.p[i].canPlayDevCard_knight);
    expect(p.canPlayDevCard('monopoly')).to.equal(e.p[i].canPlayDevCard_monopoly);
    expect(p.canPlayDevCard('rb')).to.equal(e.p[i].canPlayDevCard_rb);
    expect(p.canPlayDevCard('vp')).to.equal(e.p[i].canPlayDevCard_vp);
    expect(p.canPlayDevCard('yop')).to.equal(e.p[i].canPlayDevCard_yop);

    expect(p.vertex.name).to.equal(e.p[i].vertexName);
    expect(p.getEdges().map(e => e.name)).to.deep.equal(e.p[i].edgeNames);

  });

}

function checkInitialGraph(g) {

  const e = getExpectation(g);
  e.p[g.currentParticipantID].edgeNames = ['_e_take_turn'];
  checkGraph(g, e);

  g.participants.forEach(p => {
    _.forEach(g.board.scenario.resources, (count, name) => {
      expect(p.canAfford({ [name]: 1 })).to.equal(false);
    });
  });

}

function randomInitSettle(g) {

  let settleIndex = 0;
  while (!g.board.juncs[settleIndex].isSettleable)
    ++settleIndex;
  g.getCurrentParticipant().do('_e_init_settle', { junc: settleIndex });

}

function randomInitBuildRoad(g, name) {

  let hasBuiltRoad = false;
  _.each(g.getCurrentParticipant().settlements.slice(-1)[0].roads, road => {
    if (road && !hasBuiltRoad) {
      g.getCurrentParticipant().do(name, { road: road.num });
      hasBuiltRoad = true;
    }
  });

}

describe('Graph', () => {

  it('creating a game should place people at the beginning spot', () => {

    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);

      const e = getExpectation(g);
      e.p[g.currentParticipantID].edgeNames = ['_e_take_turn'];
      checkGraph(g, e);

      g.participants.forEach(p => {
        _.forEach(g.board.scenario.resources, (count, name) => {
          expect(p.canAfford({ [name]: 1 })).to.equal(false);
        });
      });

    });

  });

  it('should be consistent after first _e_take_turn', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      g.getCurrentParticipant().do('_e_take_turn', {});

      const e = getExpectation(g);
      e.historyLength = 1;

      const ec = e.p[g.currentParticipantID];
      ec.vertexName = '_v_root';
      ec.edgeNames = ['_e_init_settle'];

      checkGraph(g, e);

    });
  });

  it('should be consistent after first _e_init_settle', () => {
    [1,2,3,4,5].forEach(num => {
      const g = createGame(num);
      g.getCurrentParticipant().do('_e_take_turn', {});
      [undefined, null, -1, Infinity, 2.5].forEach(arg => {
        const msg = new RegExp(`cannot get Junc at "${arg}"`);
        expect(() => g.getCurrentParticipant().do('_e_init_settle', { junc: arg })).to.throw(/*EdgeArgumentError, */msg);
      });
      g.getCurrentParticipant().do('_e_init_settle', { junc: 22 });

      let e = getExpectation(g);
      e.historyLength = 2;

      const ec = e.p[g.currentParticipantID];
      ec.getPublicScore = 1;
      ec.getPrivateScore = 1;
      ec.getNumSettlements = 1;
      ec.settlements = [22];
      ec.vertexName = '_v_settle';
      ec.edgeNames = ['_e_init_build_road'];

      checkGraph(g, e);

    });
  });

  it('should be consistent after first _e_init_build_road', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      g.getCurrentParticipant().do('_e_take_turn', {});
      g.getCurrentParticipant().do('_e_init_settle', { junc: 22 });
      [undefined, null, -1, Infinity, 2.5].forEach(arg => {
        const msg = new RegExp(`cannot get Road at "${arg}"`);
        expect(() => g.getCurrentParticipant().do('_e_init_build_road', { road: arg })).to.throw(/*EdgeArgumentError, */msg);
      });
      expect(() => g.getCurrentParticipant().do('_e_init_build_road', { road: 20 })).to.throw(/*EdgeArgumentError, *//You must build a road next to your last settlement/);
      g.getCurrentParticipant().do('_e_init_build_road', { road: 26 }); // or: 27, 31

      let e = getExpectation(g);
      e.historyLength = 3;

      let ec = e.p[g.currentParticipantID];
      ec.getPublicScore = 1;
      ec.getPrivateScore = 1;
      ec.getNumSettlements = 1;
      ec.getNumRoads = 1;
      ec.settlements = [22];
      ec.roads = [26];
      ec.vertexName = '_v_pave';
      ec.edgeNames = ['_e_end_init'];

      checkGraph(g, e);

      g.getCurrentParticipant().do('_e_end_init', {});

      e.historyLength = 4;

      // the old ec
      ec.vertexName = '_v_end_turn';
      ec.edgeNames = [];

      // the new ec
      ec = e.p[g.currentParticipantID];
      ec.getPublicScore = 0;
      ec.getPrivateScore = 0;
      ec.getNumSettlements = 0;
      ec.getNumRoads = 0;
      ec.settlements = [];
      ec.roads = [];
      ec.vertexName = '_v_end_turn';
      ec.edgeNames = ['_e_take_turn'];

    });
  });

  if (false)
  it('should be consistent after the first player settles, paves, & ends', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      g.getCurrentParticipant().do('_e_take_turn', {});
      g.getCurrentParticipant().do('_e_init_settle', { junc: 22 });
      g.getCurrentParticipant().do('_e_init_build_road', { road: 26 });
      g.getCurrentParticipant().do('_e_end_init', {});

    });
  });

  it('should increment turns correctly for the first two rounds', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      for (let i=0; i<g.participants.length; i++) {
        g.getCurrentParticipant().do('_e_take_turn', {});
        randomInitSettle(g);
        randomInitBuildRoad(g, '_e_init_build_road');
        g.getCurrentParticipant().do('_e_end_init', {});
      }

      expect(g.turn).to.equal(g.participants.length + 1);
      expect(g.currentParticipantID).to.equal(g.participants.length - 1);

      for (let i=0; i<g.participants.length; i++) {

        g.getCurrentParticipant().do('_e_take_turn', {});
        randomInitSettle(g);

        const edges = g
          .getCurrentParticipant()
          .getEdges()
          .map(e => e.name);
        expect(edges).to.deep.equal(['_e_init_collect']);

        g.getCurrentParticipant().do('_e_init_collect', {});

        const lastSettlement = g.getCurrentParticipant().settlements.slice(-1)[0];

        const actualNum = g.getCurrentParticipant().getNumResources();
        let expectedNum = 0;
        _.each(lastSettlement.hexes, hex => {
          if (hex && hex.resource.yields)
            expectedNum += 1;
        });

        console.log(g.getCurrentParticipant().hand);
        expect(actualNum).to.be.greaterThan(0);
        expect(actualNum).to.equal(expectedNum);

        randomInitBuildRoad(g, '_e_init2_build_road');
        g.getCurrentParticipant().do('_e_end_init');

      }

      g.participants.forEach(p => {
        console.log(p.getEdges().map(e => e.name))
      });
      console.log()



    });
  });
});
