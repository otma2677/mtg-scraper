/**
 *
 */
import assert from 'node:assert';
import { IDeck } from '../../src';
import { gatherer } from '../../src/core/gatherer';

/**
 *
 */
describe('Test gatherer', function () {
  it('Test if deck is gathered', function () {
    const deck: IDeck = {
      format: 'modern',
      level_of_play: 'league',
      tournament_name: '',
      player_name: 'hello',
      deck_name: 'unknown',
      login_id: 'fze',
      standing: undefined,
      main_cards: [
        { name: 'island', quantity: 1 },
        { name: 'island', quantity: 1 },
        { name: 'mountain', quantity: 1 },
        { name: 'island', quantity: 2 }
      ],
      side_cards: [
        { name: 'forest', quantity: 1 },
        { name: 'forest', quantity: 1 },
        { name: 'mountain', quantity: 1 },
        { name: 'forest', quantity: 2 }
      ],
    };

    assert.equal(deck.main_cards[0].quantity, 1);
    assert.equal(deck.side_cards[0].quantity, 1);

    gatherer(deck);
    const islands = deck.main_cards.filter(card => card.name === 'island');
    const forests = deck.side_cards.filter(card => card.name === 'forest');

    assert.equal(islands[0]?.quantity, 4);
    assert.equal(forests[0]?.quantity, 4);
  });
});
