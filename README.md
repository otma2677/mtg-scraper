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
- [MTGO](#mtgo)
  - [MTGOTournamentParser](#mtgotournamentparser)
  - [MTGOTournamentScraper](#mtgotournamentscraper)
- [UTILS](#utils)
  - [checkURLLevelOfPlay](#checkurllevelofplay)
  - [checkURLFormat](#checkurlformat)
  - [checkURLPlatform](#checkurlplatform)
  - [checkFormat](#checkformat)
  - [checkPlatform](#checkplatform)
  - [checkLevelOfPlay](#checklevelofplay)
  - [getDateFromLink](#getdatefromlink)
- [CORE](#core)
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

An example archetype in JSON format;
```json
{
  "name": "Rakdos Midrange",
  "matches": {
    "including_cards": [
      { "name": "Bloodtithe Harvester" },
      { "name": "Fatal Push" },
      { "name": "Thoughtseize" },
      { "name": "Fable of the Mirror-Breaker" },
      { "name": "Blood Crypt" }
    ]
  }
}
```

By default, you need 3 matching card for the filterer function to validate an archetype. 
But the function signature allows a third parameter where you can change the 
value of that.

```typescript
import { filterer, type Archetype } from 'mtg-scraper2';

const archetype: Archetype = { name: 'weird name bro', /*** the rest ... */ };
const list: unknown = { /*** ... */ };

const archetypeName = filterer(archetype, list, 5);

/**
 * Now, the archetype need at least 5 "including_cards" and the 
 * list should have the five to be named the same way.
 */

```

___

# Types
- [Zod type (Schema validation)](#zod-type)
  - [TournamentBracketMTGO](#tournamentbracketmtgo)
  - [TournamentStandingMTGO](#tournamentstandingmtgo)
  - [TournamentDecklistMTGO](#tournamentdecklistmtgo)
  - [TournamentCardMTGO](#tournamentcardmtgo)
  - [TournamentMTGO](#tournamentmtgo)
  - [LeagueCardMTGO](#leaguecardmtgo)
  - [LeagueMTGO](#leaguemtgo)
  - [ResultMTGOPayload](#resultmtgopayload)
- [Utils type](#utils-type)
  - [Platform](#platform)
  - [Level](#level)
  - [Format](#format)

## Zod type
The following types and schemas are shaped based upon the output of MTGO events.


### TournamentBracketMTGO
Using Zod schema, you can validate an unknown object with `zodRawTournamentBracketMTGO` 
to obtain the following interface.

```typescript
import { zodRawTournamentBracketMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawTournamentBracketMTGO.parse(obj); // throw if not valid

```

The shape of a Bracket scraped from MTGO.

```typescript
export interface TournamentBracketMTGO {
  index: number;
  matches: Array<{
    players: Array<{
      loginid: number;
      player: string;
      seeding: number;
      wins: number;
      losses: number;
      winner: boolean;
    }>;
  }>;
}
```

### TournamentStandingMTGO
Using Zod schema, you can validate an unknown object with `zodRawTournamentStandingMTGO`
to obtain the following interface.

```typescript
import { zodRawTournamentStandingMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawTournamentStandingMTGO.parse(obj); // throw if not valid

```

The shape of a Standing scraped from MTGO.

```typescript
export interface TournamentStandingMTGO {
  tournamentid: string;
  loginid: string;
  login_name: string;
  rank: number;
  score: number;
  opponentmatchwinpercentage: number;
  gamewinpercentage: number;
  opponentgamewinpercentage: number;
  eliminated: boolean;
}
```

### TournamentDecklistMTGO
Using Zod schema, you can validate an unknown object with `zodRawTournamentDecklistMTGO`
to obtain the following interface.

```typescript
import { zodRawTournamentDecklistMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawTournamentDecklistMTGO.parse(obj); // throw if not valid

```

The shape of a Decklist scraped from MTGO.

```typescript
export interface TournamentDecklistMTGO {
  loginid: string;
  tournamentid: string;
  decktournamentid: string;
  player: string;
  main_deck: Array<TournamentCardMTGO>;
  sideboard_deck: Array<TournamentCardMTGO>
}
```

### TournamentCardMTGO
Using Zod schema, you can validate an unknown object with `zodRawTournamentCardMTGO`
to obtain the following interface.

```typescript
import { zodRawTournamentCardMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawTournamentCardMTGO.parse(obj); // throw if not valid

```

The shape of a Tournament Card scraped from MTGO.

```typescript
export interface TournamentCardMTGO {
  decktournamentid: string;
  docid: string;
  qty: number;
  sideboard: boolean;
  card_attributes: {
    digitalobjectcatalogid?: string;
    card_name: string;
    cost?: number;
    rarity?: string;
    color?: string;
    cardset?: string;
    card_type?: string;
    colors?: string;
  }
}
```

### TournamentMTGO
Using Zod schema, you can validate an unknown object with `zodRawTournamentMTGO`
to obtain the following interface.

```typescript
import { zodRawTournamentMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawTournamentMTGO.parse(obj); // throw if not valid

```

The shape of a Tournament scraped from MTGO.

```typescript
export interface TournamentMTGO {
  event_id: string;
  description: string;
  starttime: Date;
  format: string;
  type: string;
  site_name: string;
  decklists: Array<TournamentDecklistMTGO>;
  standings: Array<TournamentStandingMTGO>;
  brackets: Array<TournamentBracketMTGO>;
  final_rank?: Array<{
    tournamentid: string;
    loginid: string;
    rank: number;
    roundnumber: number;
  }>;
  winloss: Array<{
    tournamentid: string;
    loginid: string;
    losses: number;
    wins: number;
  }>;
  player_count: {
    tournamentid: string;
    players: number;
    queued_players: number;
  };
}
```

### LeagueCardMTGO
Using Zod schema, you can validate an unknown object with `zodRawLeagueCardMTGO`
to obtain the following interface.

```typescript
import { zodRawLeagueCardMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawLeagueCardMTGO.parse(obj); // throw if not valid

```

The shape of a League card scraped from MTGO.

```typescript
export interface LeagueCardMTGO {
  leaguedeckid: string;
  loginplayeventcourseid: string;
  docid: string;
  qty: number;
  sideboard: boolean;
  card_attributes: {
    digitalobjectcatalogid?: string;
    card_name: string;
    cost?: number;
    rarity?: string;
    color?: string;
    cardset?: string;
    card_type?: string;
    colors?: string;
  }
}
```

### LeagueMTGO
Using Zod schema, you can validate an unknown object with `zodRawLeagueMTGO`
to obtain the following interface.

```typescript
import { zodRawLeagueMTGO } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawLeagueMTGO.parse(obj); // throw if not valid

```

The shape of a League scraped from MTGO.

```typescript
export interface LeagueMTGO {
  playeventid: string;
  name: string;
  publish_date: string;
  instance_id: string;
  site_name: string;
  decklists: Array<{
    loginplayeventcourseid: string;
    loginid: string;
    instance_id: string;
    player: string;
    main_deck: Array<LeagueCardMTGO>;
    sideboard_deck: Array<LeagueCardMTGO>;
    wins: {
      loginplayeventcourseid: string;
      wins: number;
      losses: number;
    }
  }>;
}
```

### ResultMTGOPayload
Using Zod schema, you can validate an unknown object with `zodRawResultMTGOPayload`
to obtain the following interface.

```typescript
import { zodRawResultMTGOPayload } from 'mtg-scraper2';

const obj: unknown = { /*** ... */ };
const objShaped = zodRawResultMTGOPayload.parse(obj); // throw if not valid

```

The shape of a full payload of a scraped MTGO tournament (the output of MTGOTournamentParser)

```typescript
export interface ResultMTGOPayload {
  returned: number; // 0 or 1
  league_cover_page_list?: Array<LeagueMTGO>; // The league result is at index 0
  tournament_cover_page_list?: Array<TournamentMTGO>; // The tournament result is at index 0
}
```

If the tournament is a league, it is always in the `league_cover_page_list`, otherwise
any other kind of mtgo event will be in `tournament_cover_page_list`.

## Utils type
### Platform
```typescript
export type Platform = 'mtgo';
```

### Level
```typescript
export type Level =
  'league' |
  'preliminary' |
  'challenge' |
  'premier' |
  'showcase-challenge' |
  'showcase-qualifier' |
  'showcase-open' |
  'eternal-weekend' |
  'super-qualifier' |
  'last-chance';
```
### Format
```typescript
export type Format =
  'vintage' |
  'legacy' |
  'modern' |
  'pioneer' |
  'standard' |
  'pauper' |
  'limited';
```
