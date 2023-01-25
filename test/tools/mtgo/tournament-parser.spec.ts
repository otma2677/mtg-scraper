/**
 *
 */
import assert from 'node:assert';
import { generateUniqueID } from '../../../src/core/utils';
import { tournamentParser, getDate } from '../../../src/tools/mtgo/tournament-parser';

/**
 *
 */
describe('Test tournamentParser against a legacy showcase', function() {
  this.timeout(5000);
  const urlLegacyShowCase = 'https://www.mtgo.com/en/mtgo/decklist/legacy-showcase-challenge-2022-06-2612434036';
  const legacyShowCase = tournamentParser(urlLegacyShowCase);
  const timeForLegacyChallenge = new Date('2022-06-26');
  const dateGetted = getDate(urlLegacyShowCase);

  it('should be 26', async () => {
    assert.deepStrictEqual(dateGetted.day, 26);
  });

  it('should compare getdate function', async () => {
    assert.deepStrictEqual(new Date(`${dateGetted.year}-${dateGetted.month}-${dateGetted.day}`).getTime(), timeForLegacyChallenge.getTime());
  });

  it('should send back an OBJ with a tournament OBJ which we want to check', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(result.tournament.in_time, timeForLegacyChallenge.getTime());
  });

  it('should send back an OBJ with a big string which contains a long string name rawdata', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(typeof result.rawData, 'string');
  });

  it('should send back an OBJ with a decklist obj', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(result.deckLists instanceof Array, true);
  });

  it('should test if there is standings (true)', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(typeof result.standings, 'object');
  });

  it('should test if there is bracketrs (true)', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(typeof result.brackets, 'object');
  });

  it('should test if deckList is deep and structured', async () => {
    const result = await legacyShowCase;

    assert.deepStrictEqual(result.deckLists[0].deck_name, 'unknown');
    assert.deepStrictEqual(result.deckLists[0].format, 'legacy');
    assert.deepStrictEqual(typeof result.deckLists[0].main_cards[0].quantity, 'number');
    assert.deepStrictEqual(typeof result.deckLists[0].main_cards[0].type, 'string');
    assert.deepStrictEqual(typeof result.deckLists[0].main_cards[0].cost, 'number');
  });
});
