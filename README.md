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
  - [MTGOTournamentParser](#mtgotournamentparser)
  - [MTGOTournamentScraper](#mtgotournamentscraper)
- UTILS
  - [checkURLLevelOfPlay](#checkurllevelofplay)
  - [checkURLFormat](#checkurlformat)
  - [checkURLPlatform](#checkurlplatform)
  - [checkFormat](#checkformat)
  - [checkPlatform](#checkplatform)
  - [checkLevelOfPlay](#checklevelofplay)
  - [getDateFromLink](#getdatefromlink)
- CORE
  - [filterer](#filterer)

## MTGO
### MTGOTournamentParser
```typescript
import { 
  MTGOTournamentParser, 
  type ResultMTGOPayload, 
  type Format, 
  type Platform, 
  type Level 
} from 'mtg-scraper2';

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

await saveMyObjectToADatabaseOrFileOrWhatever(obj);

/**
 * You get back an object that you can directly stringify if you wish, or
 * cut the object in chunks to put into a DB such as MySQL or PostgreSQL
 */
```

### MTGOTournamentScraper
```typescript
import {
  MTGOTournamentScraper
} from 'mtg-scraper2';

const today = new Date();
const arr = await MTGOTournamentScraper(today) as Array<string>;

/**
 * You get back an array of links (string) with links being
 * all tournaments of MTGO of the current month and year.
 */
for (const tournament of arr) {
  /*** Do something with the tournament string (the link) */
}

```

## UTILS
### checkURLLevelOfPlay
```typescript
import {
  checkURLLevelOfPlay
} from 'mtg-scraper2';

const link = 'https://www.mtgo.com/decklist/pauper-challenge-32-2024-01-2712609085';
const result = checkURLLevelOfPlay(link);

console.log(result); // "challenge"

```

If the level is unknown, the function will throw.

### checkURLFormat
```typescript
import {
  checkURLFormat
} from 'mtg-scraper2';

const link = 'https://www.mtgo.com/decklist/pauper-challenge-32-2024-01-2712609085';
const result = checkURLFormat(link);

console.log(result); // "pauper"
```

If the format is unknown, the function will throw.

### checkURLPlatform
```typescript
import {
  checkURLPlatform
} from 'mtg-scraper2';

const link = 'https://www.mtgo.com/decklist/pauper-challenge-32-2024-01-2712609085';
const result = checkURLPlatform(link);

console.log(result); // "mtgo"
```

If the platform is unknown, the function will throw.

### checkFormat
```typescript
import {
  checkFormat
} from 'mtg-scraper2';

console.log(checkFormat('pauper')); // true
console.log(checkFormat('jikjik')); // false
console.log(checkFormat('modern')); // true

```

Available formats;
- standard
- pioneer
- limited
- pauper
- modern
- legacy
- vintage

### checkPlatform
```typescript
import {
  checkPlatform
} from 'mtg-scraper2';

console.log(checkPlatform('mtgo')); // true
console.log(checkPlatform('www.mtgo')); // false
console.log(checkPlatform('lololol')); // false

```

Available platforms;
- mtgo

### checkLevelOfPlay
```typescript
import {
  checkLevelOfPlay
} from 'mtg-scraper2';

console.log(checkLevelOfPlay('challenge')); // true
console.log(checkLevelOfPlay('www.kkiioo')); // false
console.log(checkLevelOfPlay('lololol')); // false
console.log(checkLevelOfPlay('last-chance')); // true

```

Available levels;
- league
- preliminary
- challenge
- premier
- showcase-challenge
- showcase-qualifier
- showcase-open
- eternal-weekend
- super-qualifier
- last-chance

### getDateFromLink
```typescript
import {
  getDateFromLink
} from 'mtg-scraper2';

const link = 'https://www.mtgo.com/decklist/pauper-challenge-32-2024-01-2712609085';
const result = getDateFromLink(link);

console.log(result); // { timeInMS: number; year: string; month: string; day: string; }

```

## Core
### Filterer
To generate names of archetype on the fly, you can use the filterer"helper 
function. There is three shape for the lists, depending on where it comes from,
and a single kind of archetype signature. (You can find their definition in  
[types](#types))

```typescript
import { filterer, type Archetype } from 'mtg-scraper2';

const archetype: Archetype = { name: 'weird name bro', /*** the rest ... */ };
const list: unknown = { /*** ... */ };

const archetypeName = filterer(archetype, list); // It returns null if no archetype was found
console.log(archetypeName); // "weird name bro"
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
