/**
 *
 */
import assert from 'node:assert';
import { MTGOTournamentParser } from '../../../src/tools/mtgo/tournament-parser';
import { guardCard, guardDeck, guardFullResult, guardTournament } from '../../../src/core/guards';

/**
 *
 */
describe('Test tournamentParser', function() {
  this.timeout(7500);

  it('Test against modern challenge', async () => {
    const link = 'https://www.mtgo.com/decklist/modern-challenge-2023-04-0112538312';
    const data = await MTGOTournamentParser(link);
    let totalSideCards = 0;
    let totalMainCards = 0;
    for (const deck of data.deckLists) {
      for (const card of deck.side_cards)
        totalSideCards += card.quantity;
      for (const card of deck.main_cards)
        totalMainCards += card.quantity;
    }

    assert.equal(data.tournament.format, 'modern');
    assert.equal(typeof data.rawData, 'string');
    assert.equal(data.tournament.total_players, 32);
    assert.equal(guardDeck(data.deckLists[1]), true);
    assert.equal(guardTournament(data.tournament), true);
    assert.equal(guardCard(data.deckLists[6].main_cards[1]), true);
    assert.equal(guardFullResult(data), true);

    assert.equal(totalSideCards, 480);
    assert.equal(totalMainCards, 1920);
  });

  it('Test against vintage showcase qualifier', async () => {
    const link = 'https://www.mtgo.com/decklist/vintage-showcase-qualifier-2023-04-0112538282';
    const data = await MTGOTournamentParser(link);
    let totalSideCards = 0;
    let totalMainCards = 0;
    for (const deck of data.deckLists) {
      for (const card of deck.side_cards)
        totalSideCards += card.quantity;
      for (const card of deck.main_cards)
        totalMainCards += card.quantity;
    }

    assert.equal(data.tournament.format, 'vintage');
    assert.equal(typeof data.rawData, 'string');
    assert.equal(data.tournament.level_of_play, 'showcase-qualifier');
    assert.equal(guardDeck(data.deckLists[2]), true);
    assert.equal(guardTournament(data.tournament), true);
    assert.equal(guardCard(data.deckLists[4].main_cards[2]), true);
    assert.equal(guardFullResult(data), true);

    assert.equal(totalSideCards, 195);
    assert.equal(totalMainCards, 780);
  });

  it('Test against pioneer preliminary', async () => {
    const link = 'https://www.mtgo.com/decklist/pioneer-preliminary-2022-08-2712464053';
    const data = await MTGOTournamentParser(link);
    let totalSideCards = 0;
    let totalMainCards = 0;
    for (const deck of data.deckLists) {
      for (const card of deck.side_cards)
        totalSideCards += card.quantity;
      for (const card of deck.main_cards)
        totalMainCards += card.quantity;
    }

    assert.equal(data.tournament.format, 'pioneer');
    assert.equal(typeof data.rawData, 'string');
    assert.equal(data.tournament.level_of_play, 'preliminary');
    assert.equal(guardDeck(data.deckLists[2]), true);
    assert.equal(guardTournament(data.tournament), true);
    assert.equal(guardCard(data.deckLists[4].main_cards[2]), true);
    assert.equal(guardFullResult(data), true);

    assert.equal(totalSideCards, 210);
    assert.equal(totalMainCards, 860); //14 decks BUT one has 80 cards instead of 60
  });
});
