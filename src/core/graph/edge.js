// @flow strict

import type {

  EdgeArgumentT,
  EdgeReturnT,
  Game,
  Participant,
  RawEdgeArgumentT,

} from '../../utils';
import { CatonlineError, EdgeArgumentError, EdgeExecutionError, } from '../../utils';

export class Edge {

  name: string;
  label: string;

  target: string;

  isPriority: boolean;
  arguments: string;//('hex' | 'resource' | 'road' | 'settlement' | 'trade')[];

  check: (Game, Participant) => boolean;
  validateArgs: (Game, RawEdgeArgumentT) => EdgeArgumentT;
  execute: (Game, Participant, EdgeArgumentT) => EdgeReturnT;

  constructor(name: string) {

    this.name = name;

    switch (name) {
      case ('_e_accept_trade'):
        this.target = '_v_accept_trade';
        this.check = (game, participant) => {
          return !!game.currentTrade; // f.tradeAccepted;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); //  acceptTradeAsOffer(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_accept_trade_other'):
        this.target = '_v_accept_trade_other';
        this.check = (game, participant) => {
          return participant.canAcceptCurrentTrade(); // f.canAcceptCurrentTrade;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); //  acceptTradeAsOther(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_after_discard_other'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return true; // true;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_after_trade_other'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return true; // true;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_build_city'):
        this.target = '_v_fortify';
        this.check = (game, participant) => {
          return game.hasRolled && participant.canBuild('city'); // f.hasRolled && f.canBuild.city;
        };
        this.validateArgs = (game, args) => {
          // settlement
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // fortify(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          return game.hasRolled && participant.canBuild('road'); // f.hasRolled && f.canBuild.road;
        };
        this.validateArgs = (game, args) => {
          // road
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // pave(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_build_settlement'):
        this.target = '_v_settle';
        this.check = (game, participant) => {
          return game.hasRolled && participant.canBuild('settlement'); // f.hasRolled && f.canBuild.settlement;
        };
        this.validateArgs = (game, args) => {
          // settlement
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // settle(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_buy_dc'):
        this.target = '_v_buy_dc';
        this.check = (game, participant) => {
          return game.hasRolled && participant.canBuild('dev card'); // f.hasRolled && f.canBuy.dc;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); //  buyDevCard(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_cancel_trade'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          return true; // true;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // cancelTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_decline_trade'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return participant.canAcceptCurrentTrade(); // f.canAcceptTrade;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // declineTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_discard_move_robber'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // TODO: implement this
          /*
          return participant.isCurrentPlayer()
            && game.isRollSeven()
            && false; // f.isCurrentPlayer && f.isRollSeven && !f.waitForDiscard;
          */
        };
        this.validateArgs = (game, args) => {
          // hex
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // moveRobber(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_end_game'):
        this.target = '_v_end_game';
        this.check = (game, participant) => {
          return game.isOver(); // f.isGameOver;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // end(m,g);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_end_init'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return game.isFirstTurn() || game.isSecondTurn(); // f.isFirstTurn || f.isSecondTurn;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {

          game.iterateTurn();

        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_end_turn'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return game.hasRolled; // f.hasRolled;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // iterateTurn(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_fail_trade'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.waitForTrade; // TODO: implement this
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // failTrade(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_init_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          return game.isFirstTurn(); // f.isFirstTurn;
        };
        this.validateArgs = (game, args) => {

          const road = game.board.roads[args.road];

          if (!road)
            throw new EdgeArgumentError(`cannot get Road at "${args.road}"`);

          return { road };

        };
        this.execute = (game, participant, args) => {

          game.initPave(participant, args.road);

        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_init_collect'):
        this.target = '_v_init_collect';
        this.check = (game, participant) => {
          return game.isSecondTurn(); // f.isSecondTurn;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {

          game.initCollect(participant);

        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_init_settle'):
        this.target = '_v_settle';
        this.check = (game, participant) => {
          return game.isFirstTurn() || game.isSecondTurn(); // f.isFirstTurn || f.isSecondTurn;
        };
        this.validateArgs = (game, args) => {

          const junc = game.board.juncs[args.junc];

          if (!junc)
            throw new EdgeArgumentError(`cannot get Junc at "${args.junc}"`);

          return { junc };

        };
        this.execute = (game, participant, args) => {

          game.settle(participant, args.junc, true);

        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_init2_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          return game.isSecondTurn(); // f.isSecondTurn;
        };
        this.validateArgs = (game, args) => {

          const road = game.board.roads[args.road];

          if (!road)
            throw new EdgeArgumentError(`cannot get Road at "${args.road}"`);

          return { road };

        };
        this.execute = (game, participant, args) => {

          game.initPave(participant, args.road);

        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_no_steal_robber'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          return !game.canSteal; // !f.canSteal;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_offer_trade'):
        this.target = '_v_offer_trade';
        this.check = (game, participant) => {
          return !game.isFirstTurn()
            && !game.isSecondTurn()
            && !game.hasRolled
            && !participant.canAcceptCurrentTrade(); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTrade;
        };
        this.validateArgs = (game, args) => {
          // trade
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // offerTrade(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_knight'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          return participant.canPlayDevCard('knight'); // f.canPlayDC.knight;
        };
        this.validateArgs = (game, args) => {
          // hex
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'knight',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_monopoly'):
        this.target = '_v_play_monopoly';
        this.check = (game, participant) => {
          return participant.canPlayDevCard('monopoly'); // f.canPlayDC.monopoly;
        };
        this.validateArgs = (game, args) => {
          // resource
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'monopoly',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_rb'):
        this.target = '_v_play_rb';
        this.check = (game, participant) => {
          return participant.canPlayDevCard('rb'); // f.canPlayDC.rb;
        };
        this.validateArgs = (game, args) => {
          // road road
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'rb',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_vp'):
        this.target = '_v_play_vp';
        this.check = (game, participant) => {
          return participant.canPlayDevCard('vp'); // f.canPlayDC.vp;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); //  playDC(m,g,p,'vp');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_yop'):
        this.target = '_v_play_yop';
        this.check = (game, participant) => {
          return participant.canPlayDevCard('yop'); // f.canPlayDC.yop;
        };
        this.validateArgs = (game, args) => {
          // resource resource
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'yop',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll'):
        this.target = '_v_roll';
        this.check = (game, participant) => {
          return !game.hasRolled
            && !game.isFirstTurn()
            && !game.isSecondTurn(); // !f.hasRolled && !f.isFirstTurn && !f.isSecondTurn;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // return roll(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll_collect'):
        this.target = '_v_collect';
        this.check = (game, participant) => {
          return game.isRollSeven(); // !f.isRollSeven;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // collectResources(m,g);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_roll_discard'):
        this.target = '_v_discard';
        this.check = (game, participant) => {
          return participant.toDiscard > 0; // f.discard > 0
        };
        this.validateArgs = (game, args) => {
          // trade
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // discard(m,g,p,a.out);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll_discard_other'):
        this.target = '_v_discard_other';
        this.check = (game, participant) => {
          return participant.toDiscard > 0; // f.discard > 0
        };
        this.validateArgs = (game, args) => {
          // trade
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // discard(m,g,p,a.out);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll_move_robber'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // TODO: implement this
          /*
          return participant.isCurrentPlayer()
            && game.isRollSeven()
            && false; // f.isCurrentPlayer && f.isRollSeven && !f.waitForDiscard;
          */
        };
        this.validateArgs = (game, args) => {
          // hex
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // moveRobber(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_steal_robber'):
        this.target = '_v_steal';
        this.check = (game, participant) => {
          return game.canSteal; // f.canSteal;
        };
        this.validateArgs = (game, args) => {
          // player
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // steal(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_take_turn'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          return participant.isCurrentParticipant(); // f.isCurrentPlayer;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => { };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_to_root'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          return !game.isFirstTurn(); // !f.isFirstTurn;
        };
        this.validateArgs = (game, args) => { };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = false;//true; // why was this here??
        this.label = '';
        break;

      case ('_e_trade_bank'):
        this.target = '_v_trade_with_bank';
        this.check = (game, participant) => {
          return !game.isFirstTurn()
            && !game.isSecondTurn()
            && game.hasRolled
            && participant.canTradeWithBank(); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTradeBank;
        };
        this.validateArgs = (game, args) => {
          // trade
          throw new EdgeArgumentError('not implemented');
        };
        this.execute = (game, participant, args) => {
          throw new CatonlineError('not implemented'); // tradeWithBank(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      default:
        throw new CatonlineError(`unable to create edge with name "${name}"`);

    }
  }
}
