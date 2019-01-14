// @flow

import type { Game } from '../game';
import type { Participant } from '../game/participant';
import { CatonlineError } from '../../utils';

export class Edge {

  name: string;
  label: string;

  target: string;

  isPriority: boolean;
  arguments: string;//('hex' | 'resource' | 'road' | 'settlement' | 'trade')[];

  check: (Game, Participant) => boolean;
  execute: (Game, Participant, any[]/* arguments */) => { game: Game, messages: string[] };

  constructor(name: string) {

    this.name = name;

    switch (name) {
      case ('_e_accept_trade'):
        this.target = '_v_accept_trade';
        this.check = (game, participant) => {
          return !!game.currentTrade; // f.tradeAccepted;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); //  acceptTradeAsOffer(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_accept_trade_other'):
        this.target = '_v_accept_trade_other';
        this.check = (game, participant) => {
          return participant.canAcceptTrade(); // f.canAcceptTrade;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); //  acceptTradeAsOther(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_after_discard_other'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // true;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_after_trade_other'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // true;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_build_city'):
        this.target = '_v_fortify';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.hasRolled && f.canBuild.city;
        };
        this.arguments = 'settlement';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // fortify(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.hasRolled && f.canBuild.road;
        };
        this.arguments = 'road';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // pave(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_build_settlement'):
        this.target = '_v_settle';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.hasRolled && f.canBuild.settlement;
        };
        this.arguments = 'settlement';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // settle(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_buy_dc'):
        this.target = '_v_buy_dc';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.hasRolled && f.canBuy.dc;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); //  buyDevCard(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_cancel_trade'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // true;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // cancelTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_decline_trade'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          return participant.canAcceptTrade(); // f.canAcceptTrade;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // declineTrade(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_discard_move_robber'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          return game.getCurrentParticipant().player.equals(participant.player)
            && game.dice.getTotal() === 7
            && false; // f.isCurrentPlayer && f.isRollSeven && !f.waitForDiscard;
        };
        this.arguments = 'hex';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // moveRobber(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_end_game'):
        this.target = '_v_end_game';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isGameOver;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // end(m,g);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_end_init'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isFirstTurn || f.isSecondTurn;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // iterateTurn(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_end_turn'):
        this.target = '_v_end_turn';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.hasRolled;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // iterateTurn(m,g,p);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_fail_trade'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.waitForTrade;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // failTrade(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_init_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isFirstTurn;
        };
        this.arguments = 'road';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // initPave(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_init_collect'):
        this.target = '_v_init_collect';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isSecondTurn;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // initCollect(m,g,p);
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_init_settle'):
        this.target = '_v_settle';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isFirstTurn || f.isSecondTurn;
        };
        this.arguments = 'settlement';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // initSettle(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_init2_build_road'):
        this.target = '_v_pave';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.isSecondTurn;
        };
        this.arguments = 'road';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // initPave(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_no_steal_robber'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.canSteal;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_offer_trade'):
        this.target = '_v_offer_trade';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTrade;
        };
        this.arguments = 'trade';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // offerTrade(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_knight'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canPlayDC.knight;
        };
        this.arguments = 'hex';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'knight',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_monopoly'):
        this.target = '_v_play_monopoly';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canPlayDC.monopoly;
        };
        this.arguments = 'resource';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'monopoly',a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_rb'):
        this.target = '_v_play_rb';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canPlayDC.rb;
        };
        this.arguments = 'road road';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'rb',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_vp'):
        this.target = '_v_play_vp';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canPlayDC.vp;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); //  playDC(m,g,p,'vp');
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_play_yop'):
        this.target = '_v_play_yop';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canPlayDC.yop;
        };
        this.arguments = 'resource resource';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // playDC(m,g,p,'yop',a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll'):
        this.target = '_v_roll';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.hasRolled && !f.isFirstTurn && !f.isSecondTurn;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // return roll(m,g,p,a);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll_collect'):
        this.target = '_v_collect';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.isRollSeven;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
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
        this.arguments = 'trade';
        this.execute = (game, participant, argv) => {
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
        this.arguments = 'trade';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // discard(m,g,p,a.out);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_roll_move_robber'):
        this.target = '_v_move_robber';
        this.check = (game, participant) => {
          return game.getCurrentParticipant().player.equals(participant.player); // f.isCurrentPlayer && f.isRollSeven && !f.waitForDiscard;
        };
        this.arguments = 'hex';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // moveRobber(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_steal_robber'):
        this.target = '_v_steal';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // f.canSteal;
        };
        this.arguments = 'player';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented'); // steal(m,g,p,a[0]);
        };
        this.isPriority = false;
        this.label = '';
        break;

      case ('_e_take_turn'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          return game.getCurrentParticipant().player.equals(participant.player); // f.isCurrentPlayer;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_to_root'):
        this.target = '_v_root';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.isFirstTurn;
        };
        this.arguments = '';
        this.execute = (game, participant, argv) => {
          throw new CatonlineError('not implemented');
        };
        this.isPriority = true;
        this.label = '';
        break;

      case ('_e_trade_bank'):
        this.target = '_v_trade_with_bank';
        this.check = (game, participant) => {
          throw new CatonlineError('not implemented'); // !f.isFirstTurn && !f.isSecondTurn && f.hasRolled && f.canTradeBank;
        };
        this.arguments = 'trade';
        this.execute = (game, participant, argv) => {
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