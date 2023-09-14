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
  getDateFromLink
} from '../../src/core/utils';

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
      day: '01',
      timeInMS: 1680307200000,
    });

    assert.deepStrictEqual(getDateFromLink(link[1]), {
      month: '03',
      year: '2023',
      day: '31',
      timeInMS: 1680220800000
    });
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
