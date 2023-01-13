/**
 *
 */
import assert from 'node:assert';
import { guardFormat } from '../../src/core/guard-format';

/**
 *
 */
describe('Tests for guard format', () => {
  it('should return back Modern', () => {
    const url = 'https://www.mtgo.com/en/mtgo/decklist/modern-preliminary-2023-01-1012508258';
    const result = guardFormat(url);

    assert.equal(result, 'modern');
  });

  it('should return back Pioneer', () => {
    const url = 'https://www.mtgo.com/en/mtgo/decklist/pioneer-showcase-challenge-2023-01-0812508209';
    const result = guardFormat(url);

    assert.equal(result, 'pioneer');
  });
});
