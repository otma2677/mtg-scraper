/**
 *
 */
import assert from 'node:assert';
import { checkURLFormat, checkURLLevelOfPlay, checkURLPlatform, generateUniqueID, getDateFromLink } from '../../src/core/utils';

/**
 *
 */
describe('Test utils functions', () => {
  it('getDateFromLink: Should test the getDate from tournament', () => {
    const link = [
      'https://www.mtgo.com/en/mtgo/decklist/legacy-challenge-32-2023-04-0112538310',
      'https://www.mtgo.com/en/mtgo/decklist/modern-league-2023-03-31'
    ];

    assert.deepStrictEqual(getDateFromLink(link[0]), {
      month: '04',
      year: '2023',
      day: '01'
    });

    assert.deepStrictEqual(getDateFromLink(link[1]), {
      month: '03',
      year: '2023',
      day: '31'
    });
  });

  it('generateUniqueID: Should generate strict-length string identifier based on md5', () => {
    const words = [ 'apple', 'orange', 'https://www.mtgo.com/en/mtgo/decklist/modern-league-2023-03-31' ];

    assert.equal(generateUniqueID(words[0]).length, generateUniqueID(words[1]).length);
    assert.equal(generateUniqueID(words[2]).length, generateUniqueID(words[1]).length);
    assert.notEqual(generateUniqueID(words[0]), generateUniqueID(words[1]));
    assert.notEqual(generateUniqueID(words[2]), generateUniqueID(words[1]));
    assert.equal(generateUniqueID(words[0]).length, 32);
  });

  it('checkURLFormat', () => {
    const links = [
      'https://www.mtgo.com/en/mtgo/decklist/legacy-challenge-32-2023-04-0112538310',
      'https://www.mtgo.com/en/mtgo/decklist/modern-league-2023-03-31',
      'https://www.mtgo.com/en/mtgo/decklist/pauper-league-2023-03-31',
    ];

    assert.equal(checkURLFormat(links[0]), 'legacy');
    assert.equal(checkURLFormat(links[1]), 'modern');
    assert.equal(checkURLFormat(links[2]), 'pauper');
  });

  it('checkURLLevelOfPlay', () => {
    const links = [
      'https://www.mtgo.com/en/mtgo/decklist/legacy-challenge-32-2023-04-0112538310',
      'https://www.mtgo.com/en/mtgo/decklist/modern-league-2023-03-31',
      'https://www.mtgo.com/en/mtgo/decklist/pauper-league-2023-03-31',
    ];

    assert.equal(checkURLLevelOfPlay(links[0]), 'challenge');
    assert.equal(checkURLLevelOfPlay(links[1]), 'league');
    assert.equal(checkURLLevelOfPlay(links[2]), 'league');
  });

  it('checkURLPlatform', () => {
    const links = [
      'https://www.mtgo.com/en/mtgo/decklist/legacy-challenge-32-2023-04-0112538310',
      'https://www.mtgo.com/en/mtgo/decklist/modern-league-2023-03-31',
      'https://mtgo.com/en/mtgo/decklist/pauper-league-2023-03-31',
    ];

    assert.equal(checkURLPlatform(links[0]), 'mtgo');
    assert.equal(checkURLPlatform(links[1]), 'mtgo');
    assert.equal(checkURLPlatform(links[2]), 'mtgo');
  });
});
