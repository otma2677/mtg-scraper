# mtg-scraper

> [!Important]\
> Zod support is now available in ^3.3.0

> [!Note]\
> Now the scraper is faster, a switch into Undici for http requests along with less boilerplate in for
> getting metadata.

« mtg-scraper2 » is a lightweight Node.js module written in Typescript to scrap and gather data from
magic the gathering online events.

## Installation
You just need to use npm.
```pwsh
npm i mtg-scraper2
```

## Quickstart
The easiest way to use it, is to directly write a script to check available tournaments to then
scrap all metadata of them. You can easily automate it to check tournaments every day/hours or so
and scrap data when there is something available.

The following are some example(s) that could be directly used. Though they should be enhanced
for each use cases. Using a real database, transforming data in other formats, etc.

[Here you check every day if tournaments are available and scrap them, to then save them](#examples)

# API
- [Links to tourneys](#links-to-tourneys)
- [Result of a tournament](#result-of-tournament)
- [Utilities](#utilities)
- [Filters (Archetypes)](#filters)
- [Type guards (deprecated)](#guards)
- [Types (deprecated)](#types)
- [License](#license)

## Links to tourneys
You can get all tournament links of a given moment, a moment being a couple of
month and year input.

If you want to get all tournament of september 2022 you have to do it as follows;

```typescript
import { MTGOTournamentScraper } from './mtg-scraper2';

const linksOfTournaments = await MTGOTournamentScraper(9, 2022);

console.log(linksOfTournaments); // [ 'first link', 'second link', ...]
```

## Result of tournament
If you have a link of a magic the gathering online tournament to scrap, you can use
the tournamentParser with the given link as follows;

```typescript
import { MTGOTournamentParser } from './mtg-scraper2';

const tournamentData = await MTGOTournamentParser('url-of-the-tournament');

console.log(tournamentData);
```

The result of the function is described in the types section and is named 'IFullResult',
all interfaces are available through the library in your project.

## Utilities

You can quickly generate a unique ID like tourneys/decklist do have by using the generateUniqueID function;

```typescript
import { generateUniqueID } from './mtg-scraper2';

const data = generateUniqueID('Some string to hash'); // return a 32 characters long string
```

You can also check some information based on an URL, the format, the platform and
the level of play;

```typescript
import { checkURLFormat, checkURLPlatform, checkURLLevelOfPlay } from './utils';

const link1 = 'https://www.mtgo.com/en/mtgo/decklist/legacy-challenge-32-2023-04-0112538310';
const link2 = 'linkwedontknowwellyet'

console.log(checkURLFormat(link1)); // 'legacy'
console.log(checkURLFormat(link2)); // 'unknown'

console.log(checkURLPlatform(link1)); // 'www.mtgo'
console.log(checkURLPlatform(link2)); // 'unknown'

console.log(checkURLLevelOfPlay(link1)); // 'challenge'
console.log(checkURLLevelOfPlay(link2)); // 'unknown'
```

## Filters
Once you've had save all you deck lists, you can filter them to get their archetype.
You need filters using the following format;
```typescript
interface IFilter {
  id?: string | number;
  name: string;
  format: string;
  includes: Array<ICard>;
  excludes: Array<ICard>;
}
```

The ID is not used in the process but could exist for your databases schemas.

From there you can then use your filters with the "filterer" function, like as follow;

```typescript
import { filterer } from './filterer';
import { IDeck, IFilter } from './types';

const lists: Array<IDeck> = [ /** Decklists .. */ ];
const filters: Array<IFilter> = [ /** Filters .. */ ];

for (const list of lists)
  for (const filter of filters)
    list.name = filterer(list, filter);

/**
 * The rest of your code.
 */
```

## Guards

> [!Warning]\
> These types will disappear in the next big release (4.x.x)

You can check any non-raw type with functions dedicated to that which will take an obj as 
an input and then return a boolean;

```typescript
import { guardCard } from './guards';

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

```typescript
import { setTimeout as sleep, setInterval as every } from 'node:timers/promises';
import { join } from 'node:path';
import { access, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { MTGOTournamentParser, MTGOTournamentScraper, checkURLFormat } from 'mtg-scraper2';

(async () => {
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
            console.error(`An error while scraping ${tournament} has occurred. Details at ${ pathToErrorFile }.`);
          }
        }

        // Wait 30 seconds between tournaments scrap
        await sleep(30 * 1000);
      }
    } catch (err) {
      console.error('Error occurred while reaching for tournaments.\n' + err);
    }
  }
})();

/**
 * Save data locally
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
