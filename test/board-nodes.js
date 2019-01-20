'use strict';

const expect = require('chai').expect;
const BoardNode = require('../lib/core/board/board-node').BoardNode;
const Hex = require('../lib/core/board/hex').Hex;
const Junc = require('../lib/core/board/junc').Junc;
const Road = require('../lib/core/board/road').Road;

describe('BoardNode', () => {
  it('should initialize', () => {
    expect(() => new BoardNode()).to.not.throw();
  });
});

describe('Hex', () => {
  it('should initialize', () => {
    expect(() => new Hex(0, {}, {})).to.not.throw();
  });
});

describe('Junc', () => {
  it('should initialize', () => {
    expect(() => new Junc()).to.not.throw();
  });
});

describe('Road', () => {
  it('should initialize', () => {
    expect(() => new Road()).to.not.throw();
  });
});
