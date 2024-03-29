> [!Important]\
> Zod support is now available in ^3.3.0

> [!Note]\
> The scraper is getting faster;
>
> 1/ Undici is used instead of node:http for network request\
> 2/ Some boilerplate code has been deleted which makes some components 50-80x times faster 
> (from around ~80ms to under ~5ms)

# mtg-scraper
« mtg-scraper2 » is a lightweight Node.js module written in Typescript to scrap and gather data from
magic the gathering events.

The end goal is to provide an easy way to deal with mtg metadata in the Node.js realm.

## Platform Supports
At the very moment (3.3.* and below), only **MTG:online** is supported for data gathering, so at the
end, we want to support as much platform as possible.

**Supported platforms:**
- [x] Magic the gathering: online
- [ ] Magic the gathering: arena

## Installation
```pwsh
npm i mtg-scraper2
```
## Quickstart
Given that mtg-scraper is just a series of useful functions, the easiest way to use it, 
is to directly write a script to check available tournaments to then scrap all metadata related
to them. From there you store how you need it to be (JSON, SQL, etc), results being in JSON format likes.

Here is a real tiny example;

```typescript
import { setTimeout as sleep } from 'node:timers/promises';
import { MTGOTournamentScraper, MTGOTournamentParser } from 'mtg-scraper2';

async function main(today: Date) {
  // Array of string, each string being a tournament link
  const tournmanentsOfTodayMonthYear = await MTGOTournamentScraper(today.getMonth(), today.getFullYear());
  
  for (const tournament of tournamentsOfTodayMonthYear) {
    try {
      const dataOfTournament = await MTGOTournamentParser(tournament); // See below the shape of the obtained object
      
      // process the obtained data here
    } catch (err) {
      console.error(`Cannot access tournament ${tournament}.\n${err}`);
    }
  }
}

while(true) {  
  try {
    await main(new Date());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  
  const aDayInMilisecond = (60*60*24) *1000;
  await sleep(aDayInMilisecond);
}
```

> [!Note]\
> You can use [pm2](https://www.npmjs.com/package/pm2) to manage your node processes easily, often 
> seen on servers, as an example, but could be used on your computer.

### Examples
[Save data locally in json](example_1.md)
  > In a cron-like manner, with setIntervals, checks for available tournaments and generate
  > JSON files

<hr>

# Summary
- [Tournaments](#get-tournaments-name)
- [Tournament results](#get-metadata-of-a-tournament)
- [Schemas & Type definitions](#schema--types)
- [Filters](#filters)
- [Type guards (deprecated)](#guards)
- [Types (deprecated)](#types)
- [License](https://spdx.org/licenses/ISC.html)

## Get tournaments name
Say, you want to get all tournament links of September 2022, you would want to do as follows;
<hr>

```typescript
import { MTGOTournamentScraper } from 'mtg-scraper2';

const linksOfTournaments: Array<string> = await MTGOTournamentScraper(8, 2022);

console.log(linksOfTournaments); // [ 'first link', 'second link', ...]
```
> [!Warning]\
> Like in Arrays, and alike structure in EcmaScript, Months start at 0 for January. September is then the 8th month.


## Get metadata of a tournament
Say, you want to have all deck lists of a given tournament, you would want to do as follows;
<hr>

```typescript
import { MTGOTournamentParser } from 'mtg-scraper2';

const tournamentData = await MTGOTournamentParser('url-of-the-tournament');

console.log(tournamentData);
```


## Schema & Types
All types of the module are built on top of zod, to make everything easier to use with their
powerful schema features.

Here are descriptions;
<hr>

```typescript
import Z from 'zod';

export const cardSchema = Z.object({
  name: Z.string(),
  quantity: Z.number(),
  color: Z.string().optional(),
  cost: Z.number().optional(),
  type: Z.string().optional()
});

export type Card = Z.infer<typeof cardSchema>;

export const filterSchema = Z.object({
  name: Z.string(),
  format: Z.string(),
  includes: Z.array(cardSchema),
  excludes: Z.array(cardSchema)
});

export type Filter = Z.infer<typeof filterSchema>;

export const deckSchema = Z.object({
  login_id: Z.string(),
  tournament_name: Z.string(),
  player_name: Z.string(),
  format: Z.string(),
  level_of_play: Z.string(),
  main_cards: Z.array(cardSchema),
  side_cards: Z.array(cardSchema),
  deck_name: Z.string(),
  standing: Z.object({
    rank: Z.number(),
    name: Z.string(),
    gwp: Z.number(),
    ogwp: Z.number(),
    omwp: Z.number(),
    loginid: Z.number(),
    points: Z.number()
  }).optional()
});

export type Deck = Z.infer<typeof deckSchema>;

export const tournamentSchema = Z.object({
  original_id: Z.string(),
  name: Z.string(),
  link: Z.string(),
  format: Z.string(),
  platform: Z.string(),
  level_of_play: Z.string(),
  total_players: Z.number()
});

export type Tournament = Z.infer<typeof tournamentSchema>;

export const rawCardSchema = Z.object({
  quantity: Z.number(),
  card_attributes: Z.object({
    type: Z.string().optional(),
    set: Z.string(),
    color: Z.string().optional(),
    card_code: Z.number(),
    rarity: Z.string(),
    name: Z.string(),
    cost: Z.number().optional()
  })
});

export type RawCard = Z.infer<typeof rawCardSchema>;

export const rawDeckSchema = Z.object({
  sb: Z.boolean(),
  deck_cards: Z.array(rawCardSchema)
});

export type RawDeck = Z.infer<typeof rawDeckSchema>;

export const rawDeckListSchema = Z.object({
  player: Z.string(),
  loginid: Z.number(),
  deck: Z.array(rawDeckSchema)
});

export type RawDeckList = Z.infer<typeof rawDeckListSchema>;

export const rawPlacementSchema = Z.object({
  loginid: Z.number().optional(),
  rank: Z.number().optional()
});

export type RawPlacement = Z.infer<typeof rawPlacementSchema>;

export const rawStandingSchema = Z.object({
  rank: Z.number(),
  name: Z.string(),
  gwp: Z.number(),
  ogwp: Z.number(),
  omwp: Z.number(),
  loginid: Z.number(),
  points: Z.number()
});

export type RawStanding = Z.infer<typeof rawStandingSchema>;

export const rawBracketSchema = Z.object({
  index: Z.number(),
  matches: Z.array(Z.object({
    players: Z.array(Z.object({
      loginid: Z.number(),
      player: Z.string(),
      seeding: Z.number(),
      wins: Z.number(),
      losses: Z.number(),
      winner: Z.boolean()
    }))
  }))
});

export type RawBracket = Z.infer<typeof rawBracketSchema>;

export const rawResultSchema = Z.object({
  _id: Z.string(),
  event_name: Z.string(),
  date: Z.string(),
  event_type: Z.string(),
  decks: Z.array(rawDeckListSchema),
  subheader: Z.string().optional(),
  placement: Z.array(rawPlacementSchema),
  standings: Z.array(rawStandingSchema).optional(),
  brackets: Z.array(rawBracketSchema).optional()
});

export type RawResult = Z.infer<typeof rawResultSchema>;

export const fullResultSchema = Z.object({
  tournament: tournamentSchema,
  deckLists: Z.array(deckSchema),
  standings: Z.array(rawStandingSchema).optional(),
  brackets: Z.array(rawBracketSchema).optional(),
  rawData: Z.string()
});

export type FullResult = Z.infer<typeof fullResultSchema>;
```


## Filters
You can give names to deck lists using filters schema.

```typescript
interface IFilter {
  id?: string | number;
  name: string;
  format: string;
  includes: Array<ICard>;
  excludes: Array<ICard>;
}
```

Based on that interface, you can create objects like that;
```typescript
const myFilterForAGivenArchetype = {
  name: 'NameOfTheArchetype',
  format: 'modern',
  includes: [
    { name: 'forest', quantity: 0 },
    { name: 'mountain', quantity: 4 },
    { name: 'lightning bolt', quantity: 0 }
  ],
  excludes: [
    { name: 'swamp', quantity: 0 }
  ]
};
```

> [!Important]
> If you use quantity 0, then any amount of the given card will have an effect. In the above
> example, any amount of swamp dismiss the archetype validation, and any amount of forest valid 
> the archetype, and you need 4 mountains, at least, to valid the archetype.

If excludes matches at any point, the archetype is dismissed. You need at least three valid includes
to valid the archetype.

You can use filters with the `filterer` function, like as follows;
<hr>

```typescript
import { filterer, Deck, Filter } from 'mtg-scraper2';

const lists: Array<Deck> = [ /** Decklists .. */ ];
const filters: Array<Filter> = [ /** Filters .. */ ];

for (const list of lists)
  for (const filter of filters)
    list.name = filterer(list, filter);
```

> [!Note]\
> You need at least 4 identical components to make the filterer validating your deck list against a
> schema.\
> If any card in excludes appears in the deck list, the schema will not be validated.\
> You can make a card at 0 in a schema to make any number valid in the deck list to be corresponding.


## Helpers
### 'gatherer'
By default, lists have only one instance of a card in the main deck. But when scraped, often,
you get multiple instances. (1 island, 2 island, 1 island instead of 4 island as an example)

The gatherer group instance of a same card in a given list.

```typescript
import { gatherer } from 'mtg-scraper2';

/**
 * CODE
 */

gatherer(list); // It does not return anything, but directly update list main_cards and side_cards objects
```

### 'getDateFromLink'
Extract an object from a given link.

```typescript
import { getDateFromLink } from 'mtg-scraper2';

interface GetDateFromLinkRepresentation {
  timeInMS: number; 
  month: string;
  year: string;
  day: string;
}

const obj = getDateFromLink(aLink);
```

### checkURLLevelOfPlay, checkLevelOfPlay
"levelOfPlay" represent the level of the event, like a league type of event,
a challenge or preliminary, etc...

The former function checks the level of the given tournament link, and the later checks
if a given input is a valid level of play.

```typescript
import { checkURLLevelOfPlay, checkLevelOfPlay } from 'mtg-scraper2';

const level = checkURLLevelOfPlay('https://www.mtgo.com/en/mtgo/decklist/modern-challenge-2023-08-2612575807'); // result: challenge
const falseLevel = checkLevelOfPlay('hahaha'); // result: false
const trueLevel = checkLevelOfPlay('league'); // result: true
```

### checkURLFormat, checkFormat
The former function checks the format of the given link, and the later checks 
if a given input is a valid format.

```typescript
import { checkURLFormat, checkFormat } from 'mtg-scraper2';

const level = checkURLFormat('https://www.mtgo.com/en/mtgo/decklist/modern-challenge-2023-08-2612575807'); // result: modern
const falseLevel = checkFormat('hahaha'); // result: false
const trueLevel = checkFormat('modern'); // result: true
```

### checkURLPlatform, checkPlatform
The former function checks the platform of the given link, and the later checks
if a given input is a valid platform.

```typescript
import { checkURLPlatform, checkPlatform } from 'mtg-scraper2';

const level = checkURLPlatform('https://www.mtgo.com/en/mtgo/decklist/modern-challenge-2023-08-2612575807'); // result: mtgo
const falseLevel = checkPlatform('hahaha'); // result: false
const trueLevel = checkPlatform('mtgo'); // result: true
```

## Guards
> [!Warning]\
> These functions will disappear in the next big release (4.x.x)

You can check any non-raw type with functions dedicated to that which will take an obj as 
an input and then return a boolean;

```typescript
import { guardCard } from 'mtg-scraper2';

const card1 = { name: 'Murktide regent', quantity: 1 };
const card2 = { unknownProp: null, quantity: '1' };

console.log(guardCard(card1)) // true
console.log(guardCard(card2)) // false
```

The same behavior works for Filters, Decks, Tournaments and FullResults.

## Types
> [!Warning]\
> These  will disappear in the next big release (4.x.x)

```typescript
export interface ICard {
  name: string;
  quantity: number;
  color?: string;
  cost?: number;
  type?: string;
}

export interface IFilter {
  name: string;
  format: string;
  includes: Array<ICard>;
  excludes: Array<ICard>;
}

export interface IDeck {
  login_id: string;
  tournament_name: string;
  player_name: string;
  format: string;
  level_of_play: string;
  main_cards: Array<ICard>;
  side_cards: Array<ICard>;
  deck_name: string;
}

export interface ITournament {
  original_id: string;
  name: string;
  link: string;
  format: string;
  platform: string;
  level_of_play: string;
  total_players: number;
}

export interface IFullResult {
  tournament: ITournament;
  deckLists: Array<IDeck>;
  standings?: Pick<RawResults, 'standings'>;
  brackets?: Pick<RawResults, 'brackets'>;
  rawData: string;
}

export interface RawDeckList {
  player: string;
  loginid: number;
  deck: Array<{
    sb: boolean;
    deck_cards: Array<{
      card_attributes: {
        type: string;
        set: string;
        color: string;
        card_code: number;
        rarity: string;
        name: string;
        cost: number;
      };
      quantity: number;
    }>
  }>
}

export interface RawResults {
  _id: string;
  event_name: string;
  date: string;
  event_type: string;
  decks: Array<RawDeckList>;
  subheader?: string;
  placement: Array<{
    loginid: number;
    rank: number;
  }>;
  standings?: Array<{
    rank: number;
    name: string;
    GWP: number;
    OGWP: number;
    OMWP: number;
    loginid: number;
    points: number;
  }>
  brackets?: Array<{
    index: number;
    matches: Array<{
      players: Array<{
        loginid: number;
        player: string;
        seeding: number;
        wins: number;
        losses: number;
        winner: boolean;
      }>
    }>
  }>;
}
```
