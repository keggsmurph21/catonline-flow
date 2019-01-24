'use strict';

const expect = require('chai').expect;
const { objectsMatch } = require('../lib/utils');

describe('helper functions', () => {
  it('objects match', () => {
  
    const params0 = {
      scenario: 'standard',
      isPublic: true,
      portStyle: 'random',
      tileStyle: 'random',
      numComputers: 0,
      numHumans: 4,
      vpGoal: 10,
    };

    const params1 = {
      scenario: 'standard',
      isPublic: true,
      portStyle: 'random',
      tileStyle: 'random',
      numComputers: 0,
      numHumans: 4,
      vpGoal: 10,
    };

    const params2 = {
      scenario: 'standard',
      isPublic: true,
      portStyle: 'random',
      tileStyle: 'random',
      numComputers: 0,
      numHumans: 4,
      vpGoal: 11,
    };

    expect(objectsMatch(params0, params1)).to.equal(true);
    expect(objectsMatch(params0, params2)).to.equal(false);
    expect(objectsMatch(params1, params2)).to.equal(false);

    const arr0 = [ 'a', 'b', 'c' ];
    const arr1 = [ 'a', 'b', 'c' ];
    const arr2 = [ 'a', 'b', 'd' ];

    expect(objectsMatch(arr0, arr1)).to.equal(true);
    expect(objectsMatch(arr0, arr2)).to.equal(false);
    expect(objectsMatch(arr1, arr2)).to.equal(false);

  });
});
