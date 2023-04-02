/**
 *
 */
import assert from 'node:assert';
import { filterer } from '../../src/core/filterer';
import { IDeck, IFilter } from '../../src/core/types';

/**
 *
 */
describe('Filterer function', () => {
  const deck: IDeck = {
    login_id: 'afkbzeifezf',
    tournament_name: 'hello',
    deck_name: 'unknown',
    player_name: 'newbie',
    format: 'modern',
    level_of_play: 'league',
    main_cards: [
      { name: 'ragavan', quantity: 4 },
      { name: 'murktide', quantity: 4 },
      { name: 'island', quantity: 4 }
    ],
    side_cards: [
      { name: 'tre', quantity: 1 }
    ]
  };



  it('Should return the name hero', () => {
    const aFilter: IFilter = {
      name: 'hero',
      format: 'modern',
      includes: [
        { name: 'ragavan', quantity: 4 },
        { name: 'murktide', quantity: 4 },
        { name: 'island', quantity: 4 }
      ],
      excludes: []
    };

    const res = filterer(deck, aFilter);
    assert.equal(res, 'hero');
  });

  it('Should return the name "unknown", because there is less than two cards corresponding', () => {
    const aFilter: IFilter = {
      name: 'nonono',
      format: 'modern',
      includes: [
        { name: 'azerr', quantity: 4 },
        { name: 'murktide', quantity: 4 }
      ],
      excludes: []
    };

    const res = filterer(deck, aFilter);
    assert.equal(res, 'unknown');
  });

  it('Should return the name "unknown", because the number of cards are not corresponding', () => {
    const aFilter: IFilter = {
      name: 'nonono',
      format: 'modern',
      includes: [
        { name: 'ragavan', quantity: 2 },
        { name: 'murktide', quantity: 2 }
      ],
      excludes: []
    };

    const res = filterer(deck, aFilter);
    assert.equal(res, 'unknown');
  });
});
