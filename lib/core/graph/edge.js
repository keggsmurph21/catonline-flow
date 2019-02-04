'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Edge = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //  strict

var _utils = require('../../utils');

var _edgeArgument = require('./edge-argument');

var _edgeResult = require('./edge-result');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = exports.Edge = function () {
  function Edge(name) {
    _classCallCheck(this, Edge);

    this.name = name;

    switch (name) {
      case '_e_accept_trade':
        this.target = '_v_accept_trade';
        this.check = function (game, participant) {
          return !!game.currentTrade; // f.tradeAccepted;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); //  acceptTradeAsOffer(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_accept_trade_other':
        this.target = '_v_accept_trade_other';
        this.check = function (game, participant) {
          return participant.canAcceptCurrentTrade(); // f.canAcceptCurrentTrade;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); //  acceptTradeAsOther(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_after_discard_other':
        this.target = '_v_end_turn';
        this.check = function (game, participant) {
          return true; // true;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_after_trade_other':
        this.target = '_v_end_turn';
        this.check = function (game, participant) {
          return true; // true;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_build_city':
        this.target = '_v_fortify';
        this.check = function (game, participant) {
          return game.hasRolled && participant.canBuild('city'); // f.hasRolled && f.canBuild.city;
        };
        this.argsType = 'junc'; // settlement
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // fortify(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_build_road':
        this.target = '_v_pave';
        this.check = function (game, participant) {
          return game.hasRolled && participant.canBuild('road'); // f.hasRolled && f.canBuild.road;
        };
        this.argsType = 'road'; // road
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // pave(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_build_settlement':
        this.target = '_v_settle';
        this.check = function (game, participant) {
          return game.hasRolled && participant.canBuild('settlement'); // f.hasRolled && f.canBuild.settlement;
        };
        this.argsType = 'junc'; // settlement
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // settle(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_buy_dc':
        this.target = '_v_buy_dc';
        this.check = function (game, participant) {
          return game.hasRolled && participant.canBuild('devCard'); // f.hasRolled && f.canBuy.dc;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); //  buyDevCard(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_cancel_trade':
        this.target = '_v_root';
        this.check = function (game, participant) {
          return true; // true;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // cancelTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_decline_trade':
        this.target = '_v_end_turn';
        this.check = function (game, participant) {
          return participant.canAcceptCurrentTrade(); // f.canAcceptTrade;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // declineTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_discard_move_robber':
        this.target = '_v_move_robber';
        this.check = function (game, participant) {
          return participant.isCurrentParticipant() && game.isRollSeven() && game.isWaitingForDiscard();
        };
        this.argsType = 'hex';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.moveRobber(participant, args.getHex());
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_end_game':
        this.target = '_v_end_game';
        this.check = function (game, participant) {
          return game.isOver(); // f.isGameOver;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // end(m,g);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_end_init':
        this.target = '_v_end_turn';
        this.check = function (game, participant) {
          return game.isFirstTurn() || game.isSecondTurn(); // f.isFirstTurn || f.isSecondTurn;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.iterateTurn();
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_end_turn':
        this.target = '_v_end_turn';
        this.check = function (game, participant) {
          return game.hasRolled; // f.hasRolled;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // iterateTurn(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_fail_trade':
        this.target = '_v_root';
        this.check = function (game, participant) {
          throw new _utils.CatonlineError('not implemented'); // !f.waitForTrade; // TODO: implement this
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // failTrade(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_init_build_road':
        this.target = '_v_pave';
        this.check = function (game, participant) {
          return game.isFirstTurn(); // f.isFirstTurn;
        };
        this.argsType = 'road';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.initPave(participant, args.getRoad());
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_init_collect':
        this.target = '_v_init_collect';
        this.check = function (game, participant) {
          return game.isSecondTurn(); // f.isSecondTurn;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.initCollect(participant);
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_init_settle':
        this.target = '_v_settle';
        this.check = function (game, participant) {
          return game.isFirstTurn() || game.isSecondTurn(); // f.isFirstTurn || f.isSecondTurn;
        };
        this.argsType = 'junc';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.settle(participant, args.getJunc(), true);
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_init2_build_road':
        this.target = '_v_pave';
        this.check = function (game, participant) {
          return game.isSecondTurn(); // f.isSecondTurn;
        };
        this.argsType = 'road';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.initPave(participant, args.getRoad());
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_no_steal_robber':
        this.target = '_v_root';
        this.check = function (game, participant) {
          return !game.canSteal; // !f.canSteal;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_offer_trade':
        this.target = '_v_offer_trade';
        this.check = function (game, participant) {
          return !game.isFirstTurn() && !game.isSecondTurn() && game.hasRolled && !!participant.getNumResources(); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTrade;
        };
        this.argsType = 'trade'; // trade
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // offerTrade(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_play_knight':
        this.target = '_v_move_robber';
        this.check = function (game, participant) {
          return participant.canPlayDevCard('knight'); // f.canPlayDC.knight;
        };
        this.argsType = 'hex'; // hex
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // playDC(m,g,p,'knight',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_play_monopoly':
        this.target = '_v_play_monopoly';
        this.check = function (game, participant) {
          return participant.canPlayDevCard('monopoly'); // f.canPlayDC.monopoly;
        };
        this.argsType = 'resource'; // resource
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // playDC(m,g,p,'monopoly',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_play_rb':
        this.target = '_v_play_rb';
        this.check = function (game, participant) {
          return participant.canPlayDevCard('rb'); // f.canPlayDC.rb;
        };
        this.argsType = 'road road'; // road road
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // playDC(m,g,p,'rb',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_play_vp':
        this.target = '_v_play_vp';
        this.check = function (game, participant) {
          return participant.canPlayDevCard('vp'); // f.canPlayDC.vp;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); //  playDC(m,g,p,'vp');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_play_yop':
        this.target = '_v_play_yop';
        this.check = function (game, participant) {
          return participant.canPlayDevCard('yop'); // f.canPlayDC.yop;
        };
        this.argsType = 'resource resource'; // resource resource
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // playDC(m,g,p,'yop',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_roll':
        this.target = '_v_roll';
        this.check = function (game, participant) {
          return !game.hasRolled && !game.isFirstTurn() && !game.isSecondTurn(); // !f.hasRolled && !f.isFirstTurn && !f.isSecondTurn;
        };
        this.argsType = 'diceroll';
        this.resultType = 'diceroll';
        this.execute = function (game, participant, args) {

          var ret = void 0;

          try {

            var num = args.getDiceroll();
            ret = game.rollNumber(num);
          } catch (e) {

            if (e instanceof _utils.CatonlineError) {

              ret = game.roll();
            } else {
              throw e;
            }
          }

          ret = String(ret);
          return _edgeResult.EdgeResult.fromString('diceroll', ret, game);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_roll_collect':
        this.target = '_v_collect';
        this.check = function (game, participant) {
          return !game.isRollSeven(); // !f.isRollSeven;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.collectResources();
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_roll_discard':
        this.target = '_v_discard';
        this.check = function (game, participant) {
          return participant.toDiscard > 0; // f.discard > 0
        };
        this.argsType = 'cost'; // trade
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // discard(m,g,p,a.out);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_roll_discard_other':
        this.target = '_v_discard_other';
        this.check = function (game, participant) {
          return participant.toDiscard > 0; // f.discard > 0
        };
        this.argsType = 'cost'; // trade
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // discard(m,g,p,a.out);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_roll_move_robber':
        this.target = '_v_move_robber';
        this.check = function (game, participant) {
          return participant.isCurrentParticipant() && game.isRollSeven() && !game.isWaitingForDiscard();
        };
        this.argsType = 'hex';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {

          game.moveRobber(participant, args.getHex());
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_steal_robber':
        this.target = '_v_steal';
        this.check = function (game, participant) {
          return game.canSteal; // f.canSteal;
        };
        this.argsType = 'participant'; // player
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // steal(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case '_e_take_turn':
        this.target = '_v_root';
        this.check = function (game, participant) {
          return participant.isCurrentParticipant(); // f.isCurrentPlayer;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_to_root':
        this.target = '_v_root';
        this.check = function (game, participant) {
          return !game.isFirstTurn() && !game.isSecondTurn(); // !f.isFirstTurn;
        };
        this.argsType = 'null';
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          return new _edgeResult.EdgeResult('null');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case '_e_trade_bank':
        this.target = '_v_trade_with_bank';
        this.check = function (game, participant) {
          return !game.isFirstTurn() && !game.isSecondTurn() && game.hasRolled && participant.canTradeWithBank(); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTradeBank;
        };
        this.argsType = 'cost'; // trade
        this.resultType = 'null';
        this.execute = function (game, participant, args) {
          throw new _utils.CatonlineError('not implemented'); // tradeWithBank(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      default:
        throw new _utils.CatonlineError('unable to create edge with name "' + name + '"');

    }
  }
  //parseArgs: (Game, RawEdgeArgumentT) => EdgeArgument;


  _createClass(Edge, [{
    key: 'parseArgs',
    value: function parseArgs(game, argString) {
      return _edgeArgument.EdgeArgument.fromString(this.argsType, argString, game);
    }
  }, {
    key: 'parseResult',
    value: function parseResult(game, resultString) {
      return _edgeResult.EdgeResult.fromString(this.resultType, resultString, game);
    }
  }]);

  return Edge;
}();