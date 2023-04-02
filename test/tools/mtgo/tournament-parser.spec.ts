/**
 *
 */
import assert from 'node:assert';
import { MTGOTournamentParser } from '../../../src/tools/mtgo/tournament-parser';
import { guardCard, guardDeck, guardFullResult, guardTournament } from '../../../src/core/guards';

/**
 *
 */
describe('Test tournamentParser against a legacy showcase', function() {
  this.timeout(5000);

  it('Test against modern challenge', async () => {
    const link = 'https://www.mtgo.com/en/mtgo/decklist/modern-challenge-2023-04-0112538312';
    const data = await MTGOTournamentParser(link);

    assert.equal(data.tournament.format, 'modern');
    assert.equal(typeof data.rawData, 'string');
    assert.equal(data.tournament.total_players, 32);
    assert.equal(guardDeck(data.deckLists[1]), true);
    assert.equal(guardTournament(data.tournament), true);
    assert.equal(guardCard(data.deckLists[6].main_cards[1]), true);
    assert.equal(guardFullResult(data), true);
  });

  it('Test against vintage showcase qualifier', async () => {
    const link = 'https://www.mtgo.com/en/mtgo/decklist/vintage-showcase-qualifier-2023-04-0112538282';
    const data = await MTGOTournamentParser(link);

    assert.equal(data.tournament.format, 'vintage');
    assert.equal(typeof data.rawData, 'string');
    assert.equal(data.tournament.level_of_play, 'showcase-qualifier');
    assert.equal(guardDeck(data.deckLists[2]), true);
    assert.equal(guardTournament(data.tournament), true);
    assert.equal(guardCard(data.deckLists[4].main_cards[2]), true);
    assert.equal(guardFullResult(data), true);
  });
});
