import { IDeck, IFilter } from './types';
import { z } from 'zod';

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

/**
 * NEW FILTERER
 */
export const archetype = z.object({
  name: z.string(),
  matches: z.object({
    including_cards: z.array(z.object({
      name: z.string(),
      quantity: z.number().optional()
    })),
    excluding_cards: z.array(z.object({
      name: z.string(),
      quantity: z.number().optional()
    })).optional()
  }),
  macroType: z.string().optional(),
  microType: z.string().optional()
});

export type Archetype = z.infer<typeof archetype>;

export function archetypeFilter(archetype: Archetype, list: any, value = 3) {
  let includedCards = 0;
  let excludedCards = 0;
  let cards: Array<{ name: string; quantity: number; }>;

  /**
   * Adapt cards format depending on if it comes from
   * MTGODecklistCache or mtg-scraper2 or from legacy-mtg-scraper2
   */
  if (list['main']) {
    const gotNameProp =
      typeof list['main'][0].name === 'string' &&
      typeof list['main'][0].quantity === 'number';
    if (gotNameProp)
      cards = list['main'];
    else
      return null;

  } else if (list['main_deck']) {
    const gotSubNameProp = typeof list['main_deck'][0]['card_attributes'].card_name === 'string';
    if (gotSubNameProp) {
      cards = list['main_deck'].map((card: any) => {
        return {
          name: card['card_attributes'].card_name as string,
          quantity: Number(card.qty) as number
        };
      });
    } else
      return null;
  } else if (list['Mainboard']) {
    const subName = typeof list['Mainboard'][0]['CardName'] === 'string';
    if (subName) {
      cards = list['Mainboard'].map((card: any) => {
        return {
          name: card['CardName'] as string,
          quantity: card['Count'] as number
        };
      });
    } else
      return null;
  } else
    return null;


  /**
   * Find matches
   */
  for (const card of cards) {
    if (!archetype.matches.including_cards)
      continue;

    for (const filterCard of archetype.matches.including_cards) {
      if (card.name.trim().toLowerCase() === filterCard.name.trim().toLowerCase())
        includedCards += 1;
    }

    if (!archetype.matches.excluding_cards)
      continue;

    for (const filterCard of archetype.matches.excluding_cards) {
      if (card.name.trim().toLowerCase() === filterCard.name.trim().toLowerCase())
        excludedCards += 1;
    }
  }

  if (excludedCards >= 1)
    return null;

  if (includedCards >= value)
    return archetype.name;

  return null;
}
