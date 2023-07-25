> [!Important]\
> Zod support is now available in ^3.3.0

> [!Note]\
> The scraper is getting faster;
>
> 1/ Undici is used instead of node:http for network request\
> 2/ Some boilerplate code has been deleted which makes some components 50-80x times faster (from 80ms to ~1ms)

# mtg-scraper
« mtg-scraper2 » is a lightweight Node.js module written in Typescript to scrap and gather data from
magic the gathering online events.

## Installation
```pwsh
npm i mtg-scraper2
```
_
## Quickstart
The easiest way to use it, is to directly write a script to check available tournaments to then
scrap all metadata related to them. 

Node makes it easy to build a cron-like experience to reach every day (as an example) data you need
without you launching scripts manually.

Following, are some example that you could use directly.

- [Save in json locally, using setInterval to cron tasks](#local-json-script)

<hr>

# Summary
- [Tournaments](#get-tournaments-name)
- [Tournament results](#get-metadata-of-a-tournament)
- [Schemas & Type definitions](#schema--types)
- [Filters](#filters)
- [Type guards (deprecated)](#guards)
- [Types (deprecated)](#types)
- [Examples](#examples)
- [License](#license)

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

_
## Get metadata of a tournament
Say, you want to have all deck lists of a given tournament, you would want to do as follows;
<hr>

```typescript
import { MTGOTournamentParser } from 'mtg-scraper2';

const tournamentData = await MTGOTournamentParser('url-of-the-tournament');

console.log(tournamentData);
```

_
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
_

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

_
## Guards

> [!Warning]\
> These types will disappear in the next big release (4.x.x)

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
> These types will disappear in the next big release (4.x.x)

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

## Examples

### Local json script
```typescript
import { setTimeout as sleep, setInterval as every } from 'node:timers/promises';
import { join } from 'node:path';
import { access, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { MTGOTournamentParser, MTGOTournamentScraper, checkURLFormat } from 'mtg-scraper2';

(async () => {
  // Create necessary folders if they don't already exists
  try {
    await initFolders();
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
  
  const day = (60*60*24) *1000;
  
  for await (const _ of every(day)) {
    try {
      const today = new Date();
      const availableTournaments = await MTGOTournamentScraper(today.getMonth(), today.getFullYear());

      for (const tournament of availableTournaments) {
        const name = tournament.split('/').at(-1);
        const format = checkURLFormat(tournament);
        if (!name || format === 'unknown')
          continue;

        const fileName = `${name}.json`;
        const filePath = join(homedir(), 'mtg_scraper_data', format, fileName);

        if (await checkPathValidity(filePath))
          continue;

        try {
          const data = await MTGOTournamentParser(tournament);
          await writeFile(filePath, JSON.stringify(data));
          
        } catch(err) {
          if (err instanceof Error) {
            const pathToErrorFile = await saveErr(name, err);
            console.error(`An error while scraping ${ name } has occurred. Details at ${ pathToErrorFile }.`);
          }
        }

        // Wait 30 seconds between tournament scraps
        await sleep(30 * 1000);
      }
    } catch (err) {
      console.error('Error occurred while reaching for tournaments.\n' + err);
    }
  }
})();

/**
 * Save errors into .txt files
 */
async function saveErr(name: string, err: Error) {
  const date = Date.now();
  const fileName = `error_${date}_${name}.txt`;
  const filePath = join(homedir(), 'mtg_scraper_data', fileName);
  
  const formattedError = `
    ERROR - ${new Date(date).toLocaleDateString()}
    Tournament concerned: ${ name }
    
    Message (${err.name}): ${err.message}
    
    Stack: ${err.stack}
  `;
  
  await writeFile(filePath, formattedError);
  
  return filePath;
}

/**
 * Create a path in the user windows/linux folder to later save all the tournament data in there
 */
async function initFolders() {
  const pathToDataStorageFolder = join(homedir(), 'mtg_scraper_data');
  if (!await checkPathValidity(pathToDataStorageFolder))
    await mkdir(pathToDataStorageFolder);

  const formats = [ 'standard', 'pioneer', 'modern', 'pauper', 'legacy', 'vintage' ];
  for (const format of formats)
    if (!await checkPathValidity(join(pathToDataStorageFolder, format)))
      await mkdir(join(pathToDataStorageFolder, format))
}

/**
 * Check if path does exist
 */
async function checkPathValidity(path: string) {
  try {
    await access(path);
    return true;
  } catch(err) {
    return false;
  }
}

```

## License
The license is as follows. The project is totally free and open source.

https://spdx.org/licenses/ISC.html
