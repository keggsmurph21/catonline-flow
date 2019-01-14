'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vertex = undefined;

var _utils = require('../../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = exports.Vertex = function Vertex(name) {
  _classCallCheck(this, Vertex);

  this.name = name;

  switch (name) {

    case '_v_accept_trade':
      this.edges = ['_e_to_root'];
      break;

    case '_v_accept_trade_other':
      this.edges = ['_e_after_trade_other'];
      break;

    case '_v_buy_dc':
      this.edges = ['_e_end_game', '_e_to_root'];
      break;

    case '_v_collect':
      this.edges = ['_e_to_root'];
      break;

    case '_v_discard':
      this.edges = ['_e_discard_move_robber', '_e_roll_discard'];
      break;

    case '_v_discard_other':
      this.edges = ['_e_after_discard_other', '_e_roll_discard_other'];
      break;

    case '_v_end_game':
      this.edges = [];
      break;

    case '_v_end_turn':
      this.edges = ['_e_accept_trade_other', '_e_decline_trade', '_e_roll_discard_other', '_e_take_turn'];
      break;

    case '_v_fortify':
      this.edges = ['_e_end_game', '_e_to_root'];
      break;

    case '_v_init_collect':
      this.edges = ['_e_init2_build_road'];
      break;

    case '_v_move_robber':
      this.edges = ['_e_no_steal_robber', '_e_steal_robber'];
      break;

    case '_v_offer_trade':
      this.edges = ['_e_accept_trade', '_e_cancel_trade', '_e_fail_trade'];
      break;

    case '_v_pave':
      this.edges = ['_e_end_game', '_e_end_init', '_e_to_root'];
      break;

    case '_v_play_knight':
      this.edges = ['_e_end_game'];
      break;

    case '_v_play_monopoly':
      this.edges = ['_e_to_root'];
      break;

    case '_v_play_rb':
      this.edges = ['_e_to_root'];
      break;

    case '_v_play_vp':
      this.edges = ['_e_end_game', '_e_to_root'];
      break;

    case '_v_play_yop':
      this.edges = ['_e_to_root'];
      break;

    case '_v_roll':
      this.edges = ['_e_roll_collect', '_e_roll_discard', '_e_roll_move_robber'];
      break;

    case '_v_root':
      this.edges = ['_e_build_city', '_e_build_road', '_e_build_settlement', '_e_buy_dc', '_e_end_turn', '_e_init_settle', '_e_offer_trade', '_e_play_knight', '_e_play_monopoly', '_e_play_rb', '_e_play_vp', '_e_play_yop', '_e_roll', '_e_trade_bank'];
      break;

    case '_v_settle':
      this.edges = ['_e_end_game', '_e_init_build_road', '_e_init_collect', '_e_to_root'];
      break;

    case '_v_steal':
      this.edges = ['_e_to_root'];
      break;

    case '_v_trade_with_bank':
      this.edges = ['_e_to_root'];
      break;

    default:
      throw new _utils.CatonlineError('unable to create vertex with name \'' + name + '\'');

  }
};