// @flow

import _ from 'underscore';
import type { ScenarioT, CostT } from '../../utils';
import { shuffle } from '../../utils';
import { DevCard } from './dev-card';

export class DevCardDeck {

  cards: DevCard[];

  constructor(scenario: ScenarioT) {

    const cost: CostT = scenario.buyable.devCard.cost;
    this.cards = [];

    _.each(scenario.devCards, (params, name) => {
      for (let i = 0; i < params.count; i++) {

        const card = new DevCard({
          name,
          count: params.count,
          cost
        });
        this.cards.push(card);

      }
    });

  }

  shuffle() {
    shuffle(this.cards);
  }

  draw(): DevCard {
    return this.cards.pop();
  }

  isEmpty(): boolean {
    return !!this.cards.length;
  }
}
