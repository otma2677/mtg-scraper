# MTGScraper (mtg-scraper2)
« mtg-scraper2 » is a lightweight and tiny web scraper for magic the gathering,
it allows you to easily gather data from different source of mtg
events, based on Node.js & TypeScript.

### Available platforms (data source)
- [x] Magic Online
- [ ] Manatraders
- [ ] Magic Arena
- [ ] Magic.gg

___

## Installation
```bash
npm i mtg-scraper2
```
___

## Quickstart
In itself, « mtg-scraper2 » is a collection of functions and tools to build 
your own data pipeline, using Node.js as an execution environment.

The easiest way to start with it, is to create a tiny script to generate data
of a given time. At the moment, only Magic online is available as a data source.

Given that we are using Node.js, you can easily create a long-running task that
can update periodically your data. Or you can create a one-shot script that can
be periodically called by a CRON job. Also, you can easily use it in serverless
ecosystem such a Cloud functions, Cloud run, and much more.

```typescript
/**
 * Using TypeScript
 */
import { setInterval as every } from 'node:timers/promises';
import { MTGOTournamentScraper, MTGOTournamentParser } from 'mtg-scraper2';

/**
 * You do not need to use IIFE with you're not in a CommonJS ecosystem
 */
(async () => {
  const anHour = 60 * 60 * 1000;
  for await (const _ of every(anHour)) {
    const today = new Date();
    try {
      const recentTournaments = await MTGOTournamentScraper(today);

      for (const tournament of recentTournaments) {
        try {
          // Check if the tournament has already been scraped
          // Or scrape-parse it and save the date somewhere

        } catch (err) {
          console.error(`Issue when parsing ${ tournament }.\n${err}`);
        }
      }
      
    } catch (err) {
      console.error(`Cannot scrap recent tournaments for ${ today.toUTCString() }`);
    }
    
    console.log(`Task ran at ${ today.toUTCString() } without any issue.`);
  }
})();
```

___

# Functions & Tools
- MTGO
  - MTGOTournamentParser
    - getBulkData
    - getOriginalLink
  - MTGOTournamentScraper
- UTILS
  - checkURLLevelOfPlay
  - checkURLFormat
  - checkURLPlatform
  - checkFormat
  - checkPlatform
  - checkLevelOfPlay
  - getDateFromLink
- filterer
- gatherer

## MTGO
### MTGOTournamentParser
```typescript
import { MTGOTournamentParser, type ResultMTGOPayload, type Format, type Platform, type Level } from 'mtg-scraper2';

const obj = await MTGOTournamentParser('link-to-a-mtgo-tournament') as {
  tournamentLink: string;
  daybreakLink: string;
  payload: ResultMTGOPayload;
  format: Format;
  level: Level;
  platform: Platform;
  date: Date;
  eventID: string;
};   

console.log(obj.eventID);

```

___

## Types
- Zod type (with validation schemas (DTO))
  - zodRawTournamentMTGO
  - zodRawLeagueMTGO
  - zodRawTournamentBracketMTGO
  - zodRawTournamentStandingMTGO
  - zodRawTournamentDecklistMTGO
  - zodRawTournamentCardMTGO
  - zodRawLeagueCardMTGO
  - zodRawResultMTGOPayload
- UTILS
  - Platform
  - Level
  - Format
