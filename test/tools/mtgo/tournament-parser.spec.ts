/**
 *
 */
import assert from 'node:assert';
import { generateUniqueID } from '../../../src/core/utils';
import { tournamentParser } from '../../../src/tools/mtgo/tournament-parser';

/**
 *
 */
describe('Test tournamentParser against a legacy showcase', function() {
  this.timeout(5000);
  const urlLegacyShowCase = 'https://www.mtgo.com/en/mtgo/decklist/legacy-showcase-challenge-2022-06-2612434036';
  const legacyShowCase = tournamentParser(urlLegacyShowCase);

  it('should send back an OBJ with a tournament OBJ which we want to check', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(result.tournament, {
      name: 'legacy-showcase-challenge-2022-06-2612434036',
      format: 'legacy',
      level_of_play: 'showcase-challenge',
      year: 2022,
      month: 6,
      link: urlLegacyShowCase,
      platform: 'mtgo',
      total_players: 32,
      sub_id: generateUniqueID(urlLegacyShowCase)
    });
  });

  it('should send back an OBJ with a big string which contains a long string name rawdata', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(typeof result.rawData, 'string');
  });

  it('should send back an OBJ with a decklist obj', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(result.deckLists instanceof Array, true);
  });
});
