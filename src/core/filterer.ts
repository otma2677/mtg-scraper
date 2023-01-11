import {IDeck, IFilter } from './types';

export const filterer = (deck: IDeck, filter: IFilter) => {
  if (deck.format !== filter.format) return 'unknown';

  let includingXCards = 0;
  let excludingACard = 0;

  for (const card of deck.main_cards) {
    for (const fCard of filter.includes) {
      const sameName = card.name === fCard.name;
      const sameNumb = fCard.quantity === 0 ? true : card.quantity === fCard.quantity;

      if (sameName && sameNumb) includingXCards += 1;
    }

    for (const eCard of filter.excludes) {
      const sameName = card.name === eCard.name;

      if (sameName) excludingACard += 1;
    }
  }

  if (excludingACard >= 1) return 'unknown';
  if (includingXCards >= 2) return filter.name;

  return 'unknown'
};
