import { ICard, IDeck } from './types';

export function gatherer(deck: IDeck) {
  const newCards: Array<ICard> = [];
  const newSides: Array<ICard> = [];

  for (const card of deck.main_cards) {
    const found = newCards.findIndex(c => c.name === card.name);
    if (found === -1) newCards.push(card);
    else newCards[found].quantity += card.quantity;
  }

  for (const card of deck.side_cards) {
    const found = newSides.findIndex(c => c.name === card.name);
    if (found === -1) newSides.push(card);
    else newSides[found].quantity += card.quantity;
  }

  deck.main_cards = newCards;
  deck.side_cards = newSides;
}
