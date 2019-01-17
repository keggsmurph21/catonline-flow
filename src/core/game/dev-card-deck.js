// @flow strict

import type {

  CostT,
  ScenarioT,

} from '../../utils';
import _ from 'underscore';
import { shuffle } from '../../utils';
import { DevCard } from './dev-card';

export class DevCardDeck {

  cards: DevCard[];

  constructor(scenario: ScenarioT) {

    const cost: CostT = scenario.buyable.devCard.cost;
    this.cards = [];

    _.each(scenario.devCards, (count: number, name: string) => {
      for (let i = 0; i < count; i++) {

        const card = new DevCard({ name, count, cost });
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

  setCards(scenario: ScenarioT, cards: string[]) {
    this.cards = cards.map(name => new DevCard({
      name,
      count: scenario.devCards[name],
      cost: scenario.buyable.devCard.cost,
    }));
  }
}
