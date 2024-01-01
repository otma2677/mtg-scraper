/**
 *
 */
import assert from 'node:assert';
import {
  checkFormat, checkLevelOfPlay,
  checkPlatform,
  checkURLFormat,
  checkURLLevelOfPlay,
  checkURLPlatform,
  getDateFromLink,
  getIDFromLink
} from '../../src/core/utils';

/**
 *
 */
describe('Test utils functions', () => {
  it('getIDFromLink: should test getIDFromLink from link', () => {
    const link = [
      'https://www.mtgo.com/decklist/legacy-league-2023-12-317779',
      'https://www.mtgo.com/decklist/legacy-league-2023-12-317759',
      'https://www.mtgo.com/decklist/modern-preliminary-2023-08-2812575836',
      'https://www.mtgo.com/decklist/modern-challenge-96-2023-12-3112599394'
    ];

    assert.deepStrictEqual(getIDFromLink(link[0]), '7779');
    assert.deepStrictEqual(getIDFromLink(link[1]), '7759');
    assert.deepStrictEqual(getIDFromLink(link[2]), '12575836');
    assert.deepStrictEqual(getIDFromLink(link[3]), '12599394');
  });

  it('getDateFromLink: Should test the getDate from tournament', () => {
    const link = [
      'https://www.mtgo.com/decklist/modern-challenge-96-2023-12-3112599394',
    ];

    assert.deepStrictEqual(getDateFromLink(link[0]), {
      month: '12',
      year: '2023',
      day: '31',
      timeInMS: 1703980800000,
    });
  });

  it('checkURLFormat', () => {
    const links = [
      'https://www.mtgo.com/decklist/modern-preliminary-2023-08-2812575836',
      'https://www.mtgo.com/decklist/modern-challenge-96-2023-12-3112599394',
      'https://www.mtgo.com/decklist/legacy-league-2023-12-317779',
    ];

    assert.equal(checkURLFormat(links[0]), 'modern');
    assert.equal(checkURLFormat(links[1]), 'modern');
    assert.equal(checkURLFormat(links[2]), 'legacy');
  });

  it('checkURLLevelOfPlay', () => {
    const links = [
      'https://www.mtgo.com/decklist/modern-preliminary-2023-08-2812575836',
      'https://www.mtgo.com/decklist/modern-challenge-96-2023-12-3112599394',
      'https://www.mtgo.com/decklist/legacy-league-2023-12-317779',
    ];

    assert.equal(checkURLLevelOfPlay(links[0]), 'preliminary');
    assert.equal(checkURLLevelOfPlay(links[1]), 'challenge');
    assert.equal(checkURLLevelOfPlay(links[2]), 'league');
  });

  it('checkURLPlatform', () => {
    const links = [
      'https://www.mtgo.com/decklist/modern-preliminary-2023-08-2812575836',
      'https://www.mtgo.com/decklist/modern-challenge-96-2023-12-3112599394',
      'https://www.mtgo.com/decklist/legacy-league-2023-12-317779',
    ];

    assert.equal(checkURLPlatform(links[0]), 'mtgo');
    assert.equal(checkURLPlatform(links[1]), 'mtgo');
    assert.equal(checkURLPlatform(links[2]), 'mtgo');
  });

  it('checkFormat', () => {
    const links = [
      'modern',
      'marden',
      'lorgacy',
      'legacy'
    ];

    assert.equal(checkFormat(links[0]), true);
    assert.equal(checkFormat(links[1]), false);
    assert.equal(checkFormat(links[2]), false);
    assert.equal(checkFormat(links[3]), true);
  });

  it('checkPlatform', () => {
    const links = [
      'mtgo',
      'taefzf',
    ];

    assert.equal(checkPlatform(links[0]), true);
    assert.equal(checkPlatform(links[1]), false);
  });

  it('checkLevelOfPlay', () => {
    const links = [
      'league',
      'largue',
      'shawcase',
      'showcase-qualifier'
    ];

    assert.equal(checkLevelOfPlay(links[0]), true);
    assert.equal(checkLevelOfPlay(links[1]), false);
    assert.equal(checkLevelOfPlay(links[2]), false);
    assert.equal(checkLevelOfPlay(links[3]), true);
  });
});
