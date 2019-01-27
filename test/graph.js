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
    isWaitingForDiscard: false,
    getWaiting: [g.getCurrentParticipant().num],
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

function checkGraph(g, e, ignoreSpecifics = false) {

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
  expect(g.isWaitingForDiscard()).to.equal(e.isWaitingForDiscard);
  expect(g.getWaiting().map(p => p.num)).to.deep.equal(e.getWaiting);
  expect(g.getStatus()).to.equal(e.getStatus);
  g.participants.forEach((p, i) => {

    expect(p.toDiscard).to.equal(e.p[i].toDiscard);
    expect(p.hasDeclinedTrade).to.equal(e.p[i].hasDeclinedTrade);
    expect(p.bankTradeRate).to.equal(e.p[i].bankTradeRate);
    if (!ignoreSpecifics) {
      expect(p.settlements.map(s => s.num)).to.deep.equal(e.p[i].settlements);
      expect(p.roads.map(r => r.num)).to.deep.equal(e.p[i].roads);
      expect(p.getNumResources()).to.equal(e.p[i].getNumResources);
    }
    expect(p.hasHeavyPurse()).to.equal(e.p[i].hasHeavyPurse);
    expect(p.getPublicScore()).to.equal(e.p[i].getPublicScore);
    expect(p.getPrivateScore()).to.equal(e.p[i].getPrivateScore);
    expect(p.getNumDevCards()).to.equal(e.p[i].getNumDevCards);
    expect(p.getNumDevCardsInHand()).to.equal(e.p[i].getNumDevCardsInHand);
    expect(p.getNumSettlements()).to.equal(e.p[i].getNumSettlements);
    expect(p.getNumCities()).to.equal(e.p[i].getNumCities);
    expect(p.getNumRoads()).to.equal(e.p[i].getNumRoads);
    //expect(p.getLongestRoad()).to.deep.equal(e.p[i].getLongestRoad);
    //expect(p.getLargestArmy()).to.equal(e.p[i].getLargestArmy);
    expect(p.canAcceptCurrentTrade()).to.equal(e.p[i].canAcceptCurrentTrade);
    expect(p.canTradeWithBank()).to.equal(e.p[i].canTradeWithBank);
    if (!ignoreSpecifics) {
      expect(p.canBuild('city')).to.equal(e.p[i].canBuild_city);
      expect(p.canBuild('devCard')).to.equal(e.p[i].canBuild_devCard);
      expect(p.canBuild('road')).to.equal(e.p[i].canBuild_road);
      expect(p.canBuild('settlement')).to.equal(e.p[i].canBuild_settlement);
    }
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
  g.getCurrentParticipant()._do('_e_init_settle', `${settleIndex}`);

}

function randomInitBuildRoad(g, name) {

  let hasBuiltRoad = false;
  _.each(g.getCurrentParticipant().settlements.slice(-1)[0].roads, road => {
    if (road && !hasBuiltRoad) {
      g.getCurrentParticipant()._do(name, `${road.num}`);
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

  it('should parse args correctly', () => {

    function enforce(name, doNumbers = true) {

      const edge = g.graph.getEdge(name);
      const type = edge.argsType;

      [undefined, null, -1, Infinity, 2.5].forEach(arg => {
        expect(() => {

            edge.parseArgs(g, arg);

        }).to.throw(/*EdgeArgumentError, */new RegExp(`invalid argument type to "${type}" \\("${typeof arg}"\\)`));
      });

      if (doNumbers) {

        expect(() => {

          edge.parseArgs(g, '');

        }).to.throw(/*EdgeArgumentError, */new RegExp(`missing argument to "${type}" \\(undefined\\)`));
        ['-1', '10000', 'a', '.'].forEach(arg => {
          expect(() => {

            edge.parseArgs(g, arg);

          }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot get \\w+ at "${arg}"`));
        });
        expect(edge.parseArgs(g, '12').values.pop().num).to.equal(12);

      }

    }

    function parse(edge, arg) {
      return g.graph.getEdge(edge).parseArgs(g, arg);
    }

    var g = createGame(1);

    let args;

    enforce('_e_roll', false); // diceroll
    [' ', 'x', 'three'].forEach(arg => {
      expect(() => {
        parse('_e_roll', arg);
      }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot roll "NaN" \\("${arg}"\\)`));
    });
    ['-1', '0', '1'].forEach(arg => {
      expect(() => {
        parse('_e_roll', arg);
      }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot roll less than 2 \\("${arg}"\\)`));
    });
    ['13', '100', '69'].forEach(arg => {
      expect(() => {
        parse('_e_roll', arg);
      }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot roll greater than 12 \\("${arg}"\\)`));
    });
    ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].forEach(arg => {

      args = parse('_e_roll', arg);
      expect(args.getDiceroll()).to.equal(parseInt(arg));
      expect(args.toString()).to.equal(arg);

    });

    enforce('_e_roll_move_robber'); // hex
    args = parse('_e_roll_move_robber', '22');
    expect(args.getHex()).to.equal(g.board.hexes[22]);
    expect(args.toString()).to.equal('22');

    enforce('_e_init_settle'); // junc
    args = parse('_e_init_settle', '22');
    expect(args.getJunc()).to.equal(g.board.juncs[22]);
    expect(args.toString()).to.equal('22');

    args = parse('_e_to_root');
    expect(args.toString()).to.equal('null');
    args = parse('_e_to_root', null);
    expect(args.toString()).to.equal('null');
    args = parse('_e_to_root', undefined);
    expect(args.toString()).to.equal('null');

    enforce('_e_steal_robber', false); // player
    ['-1', '2'].forEach(arg => {
      expect(() => {
        parse('_e_steal_robber', arg)
      }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot get Participant at "${arg}"`));
    });
    args = parse('_e_steal_robber', '0');
    expect(args.getParticipant()).to.equal(g.participants[0]);
    expect(args.toString()).to.equal('0');

    enforce('_e_play_monopoly', false); // resource
    ['bilo', 'test', 'hello'].forEach(arg => {
      expect(() => {
        parse('_e_play_monopoly', arg)
      }).to.throw(/*EdgeArgumentError, */new RegExp(`unrecognized resource name "${arg}"`));
    });
    args = parse('_e_play_monopoly', 'wheat');
    expect(args.getResourceName()).to.equal('wheat');
    expect(args.toString()).to.equal('wheat');

    enforce('_e_play_yop', false); // resource resource
    ['bilo', 'test', 'hello', 'wheat'].forEach(arg1 => {
      ['bilo', 'test', 'hello'].forEach(arg2 => {
        const arg = arg1 + ' ' + arg2;
        expect(() => {
          parse('_e_play_yop', arg);
        }).to.throw(/*EdgeArgumentError, */new RegExp(`unrecognized resource name "(${arg1}|${arg2})"`));
      });
    });
    args = parse('_e_play_yop', 'wheat brick');
    expect(args.getResourceNames()).to.deep.equal(['wheat', 'brick']);
    expect(args.toString()).to.equal('wheat brick');

    enforce('_e_init_build_road'); // road
    args = parse('_e_init_build_road', '22');
    expect(args.getRoad()).to.equal(g.board.roads[22]);
    expect(args.toString()).to.equal('22');

    enforce('_e_play_rb', false); // road road
    [undefined, null, -1, Infinity, 2.5, 1000].forEach(arg2 => {
      const arg = '22 ' + arg2;
      expect(() => {
        parse('_e_play_rb', arg);
      }).to.throw(/*EdgeArgumentError, */new RegExp(`cannot get Road at "${arg}"`));
    });
    args = parse('_e_play_rb', '22 24');
    expect(args.getRoads().map(r => r.num)).to.deep.equal([22, 24]);
    expect(args.toString()).to.equal('22 24');

    enforce('_e_roll_discard', false); // cost
    expect(() => parse('_e_roll_discard', '')).to.throw(/unrecognized resource name ""/);
    expect(() => parse('_e_roll_discard', ',')).to.throw(/unrecognized resource name ","/);
    expect(() => parse('_e_roll_discard', 'foo')).to.throw(/unrecognized resource name "foo"/);
    expect(() => parse('_e_roll_discard', 'wheat:')).to.throw(/invalid resource quantity "NaN" \("wheat:"\)/);
    expect(() => parse('_e_roll_discard', 'wheat:foo')).to.throw(/invalid resource quantity "NaN" \("wheat:foo"\)/);
    expect(() => parse('_e_roll_discard', 'wheat:0')).to.throw(/invalid resource quantity < 1 \("wheat:0"\)/);
    args = parse('_e_roll_discard', 'wheat:1');
    expect(args.getCost()).to.deep.equal({ wheat: 1 });
    expect(args.toString()).to.equal('wheat:1');
    args = parse('_e_roll_discard', 'wheat:1;brick:2');
    expect(args.getCost()).to.deep.equal({ wheat: 1, brick: 2 });
    expect(args.toString()).to.equal('wheat:1;brick:2');
    args = parse('_e_roll_discard', 'wheat:1;brick:2;sheep:3');
    expect(args.getCost()).to.deep.equal({ wheat: 1, brick: 2, sheep: 3 });
    expect(args.toString()).to.equal('wheat:1;brick:2;sheep:3');
    args = parse('_e_roll_discard', 'wheat:1;wheat:1');
    expect(args.getCost()).to.deep.equal({ wheat: 2 });
    expect(args.toString()).to.equal('wheat:2');

    var g = createGame(3);

    enforce('_e_offer_trade', false); // trade
    expect(() => parse('_e_offer_trade', '')).to.throw(/too few arguments to "trade" \(""\)/);
    expect(() => parse('_e_offer_trade', ', , , ,')).to.throw(/cannot get Participant at "NaN"/);
    expect(() => parse('_e_offer_trade', '-1 , , ,')).to.throw(/cannot get Participant at "-1"/);
    expect(() => parse('_e_offer_trade', '0 foo:2 , ,')).to.throw(/unrecognized resource name "foo"/);
    expect(() => parse('_e_offer_trade', '0 wheat:1 , ,')).to.throw(/cannot get Participant at ","/);
    expect(() => parse('_e_offer_trade', '0 wheat:1 -1 ,')).to.throw(/cannot get Participant at "-1"/);
    expect(() => parse('_e_offer_trade', '0 wheat:1 1 foo:2')).to.throw(/unrecognized resource name "foo"/);
    args = parse('_e_offer_trade', '0 wheat:1 1 brick:2')
    expect(args.getTrade()).to.deep.equal({
      from: {
        participant: g.participants[0],
        cards: { wheat: 1 },
      },
      with: {
        participants: [g.participants[1]],
        cards: { brick: 2 },
      }
    });
    expect(args.toString()).to.equal('0 wheat:1 1 brick:2');
    args = parse('_e_offer_trade', '0 wheat:1;sheep:3 1 brick:2')
    expect(args.getTrade()).to.deep.equal({
      from: {
        participant: g.participants[0],
        cards: { wheat: 1, sheep: 3 },
      },
      with: {
        participants: [g.participants[1]],
        cards: { brick: 2 },
      }
    });
    expect(args.toString()).to.match(/0 (wheat:1;sheep:3|sheep:3;wheat:1) 1 brick:2/);
    args = parse('_e_offer_trade', '0 wheat:1 1;2 brick:2')
    expect(args.getTrade()).to.deep.equal({
      from: {
        participant: g.participants[0],
        cards: { wheat: 1 },
      },
      with: {
        participants: [g.participants[1], g.participants[2]],
        cards: { brick: 2 },
      }
    });
    expect(args.toString()).to.match(/0 wheat:1 (1;2|2;1) brick:2/);
    args = parse('_e_offer_trade', '1 wheat:1 0 brick:2')
    expect(args.getTrade()).to.deep.equal({
      from: {
        participant: g.participants[1],
        cards: { wheat: 1 },
      },
      with: {
        participants: [g.participants[0]],
        cards: { brick: 2 },
      }
    });
    expect(args.toString()).to.match(/1 wheat:1 0 brick:2/);

  });

  it('should be consistent after first _e_take_turn', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      g.getCurrentParticipant().do('_e_take_turn');

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
      g.getCurrentParticipant().do('_e_take_turn');
      g.getCurrentParticipant().do('_e_init_settle', '22');

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
      g.getCurrentParticipant().do('_e_take_turn');
      g.getCurrentParticipant().do('_e_init_settle', '22');
      g.getCurrentParticipant()._do('_e_init_build_road', `26`); // or: 27, 31

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

      g.getCurrentParticipant()._do('_e_end_init');

      e.turn = 2;
      e.historyLength = 4;
      e.isFirstTurn = (num !== 1);
      e.isSecondTurn = (num === 1);
      e.currentParticipantID = num > 1 ? 1 : 0;
      e.getWaiting = [num > 1 ? 1 : 0];

      // the old ec
      ec.vertexName = '_v_end_turn';
      ec.edgeNames = [];

      // the new ec
      ec = e.p[g.currentParticipantID];
      ec.getPublicScore = num > 1 ? 0 : 1;
      ec.getPrivateScore = num > 1 ? 0 : 1;
      ec.getNumSettlements = num > 1 ? 0 : 1;
      ec.getNumRoads = num > 1 ? 0 : 1;
      ec.settlements = num > 1 ? [] : [22];
      ec.roads = num > 1 ? [] : [26];
      ec.vertexName = '_v_end_turn';
      ec.edgeNames = ['_e_take_turn'];

      checkGraph(g, e);

    });
  });


  it('should increment turns correctly for the first two rounds', () => {
    [1,2,3,4,5].forEach(num => {

      const g = createGame(num);
      for (let i=0; i<g.participants.length; i++) {
        g.getCurrentParticipant()._do('_e_take_turn');
        randomInitSettle(g);
        randomInitBuildRoad(g, '_e_init_build_road');
        g.getCurrentParticipant()._do('_e_end_init');
      }

      expect(g.turn).to.equal(g.participants.length + 1);
      expect(g.currentParticipantID).to.equal(g.participants.length - 1);
      expect(g.getCurrentParticipant()).to.equal(g.participants.slice(-1)[0]);

      for (let i=0; i<g.participants.length; i++) {

        expect(g.currentParticipantID).to.equal(g.participants.length - i - 1);
        expect(g.getCurrentParticipant()).to.equal(g.participants.slice(- i - 1)[0]);

        g.getCurrentParticipant()._do('_e_take_turn');
        randomInitSettle(g);

        const edges = g
          .getCurrentParticipant()
          .getEdges()
          .map(e => e.name);
        expect(edges).to.deep.equal(['_e_init_collect']);

        g.getCurrentParticipant()._do('_e_init_collect');

        const lastSettlement = g.getCurrentParticipant().settlements.slice(-1)[0];

        const actualNum = g.getCurrentParticipant().getNumResources();
        let expectedNum = 0;
        _.each(lastSettlement.hexes, hex => {
          if (hex && hex.resource.yields) {
            expectedNum += 1;
          }
        });

        //expect(actualNum).to.be.greaterThan(0); // (could fail on desert)
        expect(actualNum).to.equal(expectedNum);

        randomInitBuildRoad(g, '_e_init2_build_road');
        g.getCurrentParticipant()._do('_e_end_init');

      }

      let e = getExpectation(g);
      e.turn = 1 + 2 * num;
      e.historyLength = 9 * num;
      e.isFirstTurn = false;
      e.isSecondTurn = false;
      e.currentParticipantID = 0;
      e.getWaiting = [0];

      for (let i=0; i<num; i++) {
        e.p[i].getPublicScore = 2;
        e.p[i].getPrivateScore = 2;
        e.p[i].getNumSettlements = 2;
        e.p[i].getNumRoads = 2;

        if (i === g.currentParticipantID) {
          e.p[i].vertexName = '_v_end_turn';
          e.p[i].edgeNames = ['_e_take_turn'];
        }
      }

      checkGraph(g, e, true);

    });
  });
});
