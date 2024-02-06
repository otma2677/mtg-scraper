/**
 *
 */
import assert from 'node:assert';
import { setTimeout as sleep } from 'node:timers/promises';
import { MTGOTournamentScraper } from '../../src/mtgo/tournament-scraper-new';

/**
 *
 */
describe('tournamentScraperNew', function () {
  this.timeout(10_000);

  it('tournamentScraper should be an Array.', async () => {
    await sleep(250);
    const nine22 = new Date('2022-09-01');
    const data = await MTGOTournamentScraper(nine22);
    assert.equal(data instanceof Array, true);
  });

  it('tournamentScraper should have more than 0 links for available date', async () => {
    await sleep(250);
    const eleven23 = new Date('2023-11-01');
    const data = await MTGOTournamentScraper(eleven23);
    assert.equal(data.length > 0, true);
  });
});
