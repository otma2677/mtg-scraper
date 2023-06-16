import { IDeck, IFilter } from './types';

export const filterer = (deck: Pick<IDeck, 'main_cards'>, filter: IFilter, minimumValue = 3) => {
  let includingXCards = 0;

  for (const card of deck.main_cards) {
    for (const fCard of filter.includes) {
      const sameName = card.name.toLowerCase() === fCard.name.toLowerCase();
      const sameNumb = fCard.quantity === 0 ? true : card.quantity === fCard.quantity;

      if (sameName && sameNumb) includingXCards += 1;
    }

    for (const eCard of filter.excludes) {
      const sameName = card.name.toLowerCase() === eCard.name.toLowerCase();

      if (sameName) return 'unknown';
    }
  }

  if (includingXCards >= minimumValue) return filter.name;

  return 'unknown';
};
