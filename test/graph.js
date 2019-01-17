'use strict';

const _ = require('underscore');
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
    history_length: 0,
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

        vertex_name: '_v_end_turn',
        edge_names: [],

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
  expect(g.turn).toBe(e.turn);
  expect(g.canSteal).toBe(e.canSteal);
  expect(g.currentTrade).toBe(e.currentTrade);
  expect(g.currentParticipantID).toBe(e.currentParticipantID);
  expect(g.hasRolled).toBe(e.hasRolled);
  expect(g.largestArmy).toBe(e.largestArmy);
  expect(g.hasLargestArmy).toBe(e.hasLargestArmy);
  expect(g.longestRoad).toBe(e.longestRoad);
  expect(g.hasLongestRoad).toBe(e.hasLongestRoad);
  expect(g.history.length).toBe(e.history_length);
  expect(g.isFirstTurn()).toBe(e.isFirstTurn);
  expect(g.isSecondTurn()).toBe(e.isSecondTurn);
  //expect(g.isOver()).toBe(e.isOver);
  expect(g.isRollSeven()).toBe(e.isRollSeven);
  expect(g.isFull()).toBe(e.isFull);
  expect(g.getWaiting()).toEqual(e.getWaiting);
  expect(g.getStatus()).toBe(e.getStatus);

  g.participants.forEach((p, i) => {

    expect(p.toDiscard).toBe(e.p[i].toDiscard);
    expect(p.hasDeclinedTrade).toBe(e.p[i].hasDeclinedTrade);
    expect(p.hasHeavyPurse).toBe(e.p[i].hasHeavyPurse);
    expect(p.bankTradeRate).toBe(e.p[i].bankTradeRate);
    expect(p.settlements).toEqual(e.p[i].settlements);
    expect(p.roads).toEqual(e.p[i].roads);
    expect(p.getPublicScore()).toBe(e.p[i].getPublicScore);
    expect(p.getPrivateScore()).toBe(e.p[i].getPrivateScore);
    expect(p.getNumDevCards()).toBe(e.p[i].getNumDevCards);
    expect(p.getNumDevCardsInHand()).toBe(e.p[i].getNumDevCardsInHand);
    expect(p.getNumResources()).toBe(e.p[i].getNumResources);
    expect(p.getNumSettlements()).toBe(e.p[i].getNumSettlements);
    expect(p.getNumCities()).toBe(e.p[i].getNumCities);
    expect(p.getNumRoads()).toBe(e.p[i].getNumRoads);
    //expect(p.getLongestRoad()).toEqual(e.p[i].getLongestRoad);
    //expect(p.getLargestArmy()).toBe(e.p[i].getLargestArmy);
    expect(p.canAcceptCurrentTrade()).toBe(e.p[i].canAcceptCurrentTrade);
    expect(p.canTradeWithBank()).toBe(e.p[i].canTradeWithBank);
    expect(p.canBuild('city')).toBe(e.p[i].canBuild_city);
    expect(p.canBuild('devCard')).toBe(e.p[i].canBuild_devCard);
    expect(p.canBuild('road')).toBe(e.p[i].canBuild_road);
    expect(p.canBuild('settlement')).toBe(e.p[i].canBuild_settlement);
    expect(p.canPlayDevCard('knight')).toBe(e.p[i].canPlayDevCard_knight);
    expect(p.canPlayDevCard('monopoly')).toBe(e.p[i].canPlayDevCard_monopoly);
    expect(p.canPlayDevCard('rb')).toBe(e.p[i].canPlayDevCard_rb);
    expect(p.canPlayDevCard('vp')).toBe(e.p[i].canPlayDevCard_vp);
    expect(p.canPlayDevCard('yop')).toBe(e.p[i].canPlayDevCard_yop);

    const edge_names = p.getEdges().map(e => e.name);

    expect(p.vertex.name).toBe(e.p[i].vertex_name);
    expect(edge_names).toEqual(e.p[i].edge_names);

  });

}

function checkInitialGraph(g) {

  const e = getExpectation(g);
  e.p[g.currentParticipantID].edge_names = ['_e_take_turn'];
  checkGraph(g, e);

  g.participants.forEach(p => {
    _.forEach(g.board.scenario.resources, (count, name) => {
      expect(p.canAfford({ [name]: 1 })).toBe(false);
    });
  });

}

test('creating a game should place people at the beginning spot', () => {

  checkInitialGraph(createGame(1));
  checkInitialGraph(createGame(2));
  checkInitialGraph(createGame(3));
  checkInitialGraph(createGame(4));

});

test('should be consistent after first _e_take_turn', () => {
  [1,2,3,4,5].forEach(num => {

    const g = createGame(num);
    g.getCurrentParticipant().do('_e_take_turn', {});

    const e = getExpectation(g);
    e.history_length = 1;

    const ec = e.p[g.currentParticipantID];
    ec.vertex_name = '_v_root';
    ec.edge_names = ['_e_init_settle'];

    console.log(g.getCurrentParticipant())

    checkGraph(g, e);

  });
});

test('should be consistent after first _e_init_settle', () => {
  [1,2,3,4,5].forEach(num => {

    const g = createGame(num);
    g.getCurrentParticipant().do('_e_take_turn', {});
    g.getCurrentParticipant().do('_e_init_settle', { junc: 22 });

    let e = getExpectation(g);
    e.history_length = 2;

    const ec = e.p[g.currentParticipantID];
    ec.getPublicScore = 1;
    ec.getPrivateScore = 1;
    ec.getNumSettlements = 1;
    ec.current_vertex_name = '_v_settle';
    ec.current_edge_names = ['_e_init_build_road'];

    checkGraph(g, e);

  });
});
