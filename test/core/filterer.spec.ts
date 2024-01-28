/**
 *
 */
import assert from 'node:assert';
import { filterer, archetypeFilter, Archetype } from '../../src/core/filterer';
import { IDeck, IFilter } from '../../src/core/types';

/**
 *
 */
describe('archetypeFilter as Filterer Function', () => {
  const archetype: Archetype = {
    name: 'someDeckYes',
    matches: {
      including_cards: [
        { name: 'hello' },
        { name: 'hella' },
        { name: 'helli' }
      ]
    }
  };

  const listFromOldMtgScraper2 = {
    main: [
      { name: 'hello', quantity: 1 },
      { name: 'hella', quantity: 2 },
      { name: 'helli', quantity: 2 },
    ]
  };

  const listFromDaybreak = {
    main_deck: [
      { qty: 2, card_attributes: { card_name: 'hello' } },
      { qty: 4, card_attributes: { card_name: 'hella' } },
      { qty: 4, card_attributes: { card_name: 'helle' } },
    ]
  };

  const listFromMTGODecklistCache = {
    Mainboard: [
      { Count: 4, CardName: 'hilli' },
      { Count: 77, CardName: 'hullu' }
    ]
  };

  it('Test that Old MTGScraper api Works', function () {
    assert.equal(archetypeFilter(archetype, listFromOldMtgScraper2), archetype.name);
  });

  it('Test that daybreak api Works', function () {
    assert.equal(archetypeFilter(archetype, listFromDaybreak), null);
  });

  it('Test that MTGODecklistCache api Works', function () {
    assert.equal(archetypeFilter(archetype, listFromMTGODecklistCache), null);
  });
});

describe('Legacy (deprecated) Filterer function', () => {
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
