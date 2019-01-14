// @flow

export const offsetsByClockPosition = {
  '1':  { x:  1, y:  0, z: -1 },
  '2':  { x:  2, y: -1, z: -1 },
  '3':  { x:  1, y: -1, z:  0 },
  '4':  { x:  1, y: -2, z:  1 },
  '5':  { x:  0, y: -1, z:  1 },
  '6':  { x: -1, y: -1, z:  2 },
  '7':  { x: -1, y:  0, z:  1 },
  '8':  { x: -2, y:  1, z:  1 },
  '9':  { x: -1, y:  1, z:  0 },
  '10': { x: -1, y:  2, z: -1 },
  '11': { x:  0, y:  1, z: -1 },
  '12': { x:  1, y:  1, z: -2 },
};

export const GAME_PARAM_ISPUBLIC_DEFAULT = true;

export const GAME_PARAM_SCENARIO_OPTIONS = [ 'standard' ];
export const GAME_PARAM_SCENARIO_DEFAULT = GAME_PARAM_SCENARIO_OPTIONS[0];

export const GAME_PARAM_PORTSTYLE_OPTIONS = [ 'fixed', 'random' ];
export const GAME_PARAM_PORTSTYLE_DEFAULT = GAME_PARAM_PORTSTYLE_OPTIONS[0];

export const GAME_PARAM_TILESTYLE_OPTIONS = [ /*'fixed', */'random' ];
export const GAME_PARAM_TILESTYLE_DEFAULT = GAME_PARAM_TILESTYLE_OPTIONS[0];

export const GAME_PARAM_NUMCOMPUTERS_MIN = 0;
export const GAME_PARAM_NUMCOMPUTERS_MAX = 0;
export const GAME_PARAM_NUMCOMPUTERS_DEFAULT = 0;

export const GAME_PARAM_NUMHUMANS_MIN = 0;
export const GAME_PARAM_NUMHUMANS_MAX = 5;
export const GAME_PARAM_NUMHUMANS_DEFAULT = 4;

export const GAME_PARAM_VPGOAL_MIN = 8;
export const GAME_PARAM_VPGOAL_MAX = 12;
export const GAME_PARAM_VPGOAL_DEFAULT = 10;

export const DEVCARD_NAMES_MAP = {
  vp: { singular: 'victory point', plural: 'victory points' },
  knight: { singular: 'knight', plural: 'knights' },
  monopoly: { singular: 'monopoly', plural: 'monopolies' },
  rb: { singular: 'road builder', plural: 'road builders' },
  yop: { singular: 'year of plenty', plural: 'year of plenties' },
};

export const BANK_TRADE_RATES = {
  wheat: 4,
  sheep: 4,
  brick: 4,
  wood: 4,
  ore: 4,
};

// these should live in the scenario config
export const EDGE_NAMES = [
  "_e_accept_trade",
  "_e_accept_trade_other",
  "_e_after_discard_other",
  "_e_after_trade_other",
  "_e_build_city",
  "_e_build_road",
  "_e_build_settlement",
  "_e_buy_dc",
  "_e_cancel_trade",
  "_e_decline_trade",
  "_e_discard_move_robber",
  "_e_end_game",
  "_e_end_init",
  "_e_end_turn",
  "_e_fail_trade",
  "_e_init_build_road",
  "_e_init_collect",
  "_e_init_settle",
  "_e_init2_build_road",
  "_e_no_steal_robber",
  "_e_offer_trade",
  "_e_play_knight",
  "_e_play_monopoly",
  "_e_play_rb",
  "_e_play_vp",
  "_e_play_yop",
  "_e_roll",
  "_e_roll_collect",
  "_e_roll_discard",
  "_e_roll_discard_other",
  "_e_roll_move_robber",
  "_e_steal_robber",
  "_e_take_turn",
  "_e_to_root",
  "_e_trade_bank",
];

export const VERTEX_NAMES = [
  '_v_accept_trade',
  '_v_accept_trade_other',
  '_v_buy_dc',
  '_v_collect',
  '_v_discard',
  '_v_discard_other',
  '_v_end_game',
  '_v_end_turn',
  '_v_fortify',
  '_v_init_collect',
  '_v_move_robber',
  '_v_offer_trade',
  '_v_pave',
  '_v_play_knight',
  '_v_play_monopoly',
  '_v_play_rb',
  '_v_play_vp',
  '_v_play_yop',
  '_v_roll',
  '_v_root',
  '_v_settle',
  '_v_steal',
  '_v_trade_with_bank',
];

export const DICE_DOTS_MAP = {
  '-1': 0,
  '0': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '8': 5,
  '9': 4,
  '10': 3,
  '11': 2,
  '12': 1,
};
