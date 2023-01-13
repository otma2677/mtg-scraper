/**
 *
 */
import assert from 'node:assert';
import { generateUniqueID } from '../../../src/core/utils';
import { tournamentParser } from '../../../src/tools/mtgo/tournament-parser';

/**
 *
 */
describe('Test Tournament parser', () => {
  it('should send back a predefined obj', async () => {
    const url = 'https://www.mtgo.com/en/mtgo/decklist/legacy-showcase-challenge-2022-06-2612434036';
    const result = await tournamentParser(url);

    assert.deepStrictEqual(result.tournament, {
      name: 'legacy-showcase-challenge-2022-06-2612434036',
      format: 'legacy',
      level_of_play: 'showcase-challenge',
      year: 2022,
      month: 6,
      link: url,
      platform: 'mtgo',
      total_players: 32,
      sub_id: generateUniqueID(url)
    });
  });
});
