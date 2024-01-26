/**
 *
 */
import assert from 'node:assert';
import { setTimeout as sleep } from 'node:timers/promises';
import { MTGOTournamentScraper } from '../../../src/tools/mtgo/tournament-scraper-new';

/**
 *
 */
describe('tournamentScraperNew', function () {
  this.timeout(10000);

  it('tournamentScraper should be an Array.', async () => {
    await sleep(250);
    const data = await MTGOTournamentScraper(9, 2022);
    assert.equal(data instanceof Array, true);
  });

  it('tournamentScraper should have more than 0 links for available date', async () => {
    await sleep(250);
    const data = await MTGOTournamentScraper(9, 2022);
    assert.equal(data.length > 0, true);
  });
});
