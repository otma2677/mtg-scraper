/**
 *
 */
import assert from 'node:assert';
import { ICard, IDeck, IFilter, ITournament } from '../../src';
import { guardCard, guardDeck, guardFilter, guardFullResult, guardTournament } from '../../src/core/guards';
import { IFullResult } from '../../src/core/types';

/**
 *
 */
describe('Test guards function', () => {
  const trueCard: ICard = { name: 'fook', quantity: 4 };
  const fakeCard = { name: null, quantity: 'str' };

  const trueDeck: IDeck = {
    login_id: 'efzef',
    tournament_name: 'fezf',
    player_name: 'fzeezf',
    format: 'fzfezf',
    level_of_play: 'fzefez',
    main_cards: [ trueCard, trueCard, trueCard ],
    side_cards: [  ],
    deck_name: 'efzefezf'
  };

  const fakeDeck = {
    login_id: 'efzef',
    tournament_name: 'fezf',
    player_name: 'zefezfezfezfefzzfezf',
    format: 'fzfezf',
    level_of_play: 'fzefez',
    main_cards: [ trueCard, trueCard, trueCard ],
    side_cards: [ fakeCard ],
    deck_name: 'efzefezf'
  };

  const trueTourney: ITournament = {
    original_id: 'zefezf',
    name: 'ezfezfezf',
    link: 'aeohfnezoifezf',
    format: 'zefzefezfezf',
    platform: 'zefzefezf',
    level_of_play: 'afezfezf',
    total_players: 45
  };

  const fakeTourney = {
    original_id: 'zefezf',
    name: 'ezfezfezf',
    link: 'aeohfnezoifezf',
    format: 'zefzefezfezf',
    platform: 'zefzefezf',
    level_of_play: 'afezfezf',
    total_players: null
  };

  it('Test guardCard', () => {
    assert.equal(guardCard(trueCard), true);
    assert.equal(guardCard(fakeCard), false);
  });

  it('Test guardFilter', () => {
    const trueFilter: IFilter = {
      name: 'fzefzef',
      format: 'efzefezf',
      includes: [ trueCard ],
      excludes: [  ]
    };

    const fakeFilter = {
      name: 'fzefzef',
      format: 'efzefezf',
      includes: [ fakeCard ],
      excludes: [ { name: 'fook', quantity: 4 } ]
    };

    assert.equal(guardFilter(trueFilter), true);
    assert.equal(guardFilter(fakeFilter), false);
  });

  it('Test guardDeck', () => {
    assert.equal(guardDeck(trueDeck), true);
    assert.equal(guardDeck(fakeDeck), false);
  });

  it('Test guardTournament', () => {
    assert.equal(guardTournament(trueTourney), true);
    assert.equal(guardTournament(fakeTourney), false);
  });

  it('Test guardFullResult', () => {
    const trueFullResult: IFullResult = {
      tournament: trueTourney,
      deckLists: [ trueDeck, trueDeck ],
      rawData: 'efezfezfezf'
    };

    const fakeFullResult = {
      tournament: trueTourney,
      deckLists: [ trueDeck, trueDeck, fakeDeck ],
      rawData: 'efezfezfezf'
    };

    assert.equal(guardFullResult(trueFullResult), true);
    assert.equal(guardFullResult(fakeFullResult), false);
  });
});
