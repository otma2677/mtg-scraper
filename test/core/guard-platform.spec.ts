/**
 *
 */
import assert from 'node:assert';
import { guardPlatform } from '../../src/core/guard-platform';

/**
 *
 */
describe('Test for guard platform', () => {
  it('Platform should be "mtgo"', () => {
    const url = 'https://mtgo.com';
    const result = guardPlatform(url);

    assert.equal(result, 'mtgo');
  });

  it('Platform should be "unknown"', () => {
    const url = 'https://mteeeeego.com';
    const result = guardPlatform(url);

    assert.equal(result, 'unknown');
  });
});
