/**
 *
 */
import assert from 'node:assert';
import { guardLevelOfPlay } from '../../src/core/guard-level';

/**
 *
 */
describe('Test for guard level', () => {
  it('Should return back showcase-challenge', () => {
    const url = 'https://www.mtgo.com/en/mtgo/decklist/pioneer-showcase-challenge-2023-01-0812508209';
    const result = guardLevelOfPlay(url);

    assert.equal(result, 'showcase-challenge');
  });

  it('Should return back challenge', () => {
    const url = 'https://www.mtgo.com/en/mtgo/decklist/vintage-challenge-2023-01-0112504294';
    const result = guardLevelOfPlay(url);

    assert.equal(result, 'challenge');
  });
});
