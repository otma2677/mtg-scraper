/**
 *
 */
import assert from 'node:assert';
import { generateUniqueID } from '../../src/core/utils';

/**
 *
 */
describe('Test generateUniqueID', () => {
  it('should generate the same length output for different length input', () => {
    const p = generateUniqueID('pomme');
    const d = generateUniqueID('derby');
    const l = generateUniqueID('super long thing to transform but its ok');

    assert.equal(d.length, p.length);
    assert.equal(d.length, l.length);
  });

  it('should generate the same output for the same input', () => {
    const a1 = generateUniqueID('abracadbra');
    const a2 = generateUniqueID('abracadbra');

    assert.equal(a1, a2);
  });
});
