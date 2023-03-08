# mtg-scraper
Mtg scraper is a tiny web scraper to gather magic the gathering tournaments results and aggregate the data
to make it easily disposable.

At the very moment, only magic the gathering online is targeted by the library.

We will also add a support for Zod pretty soon, to get a better experiences with types.

# Examples
You can look at examples of how to use the project directly at [examples](./examples/README.md)

# How to install
You just need to use npm.
```pwsh
npm i mtg-scraper2
```

# API
- [Links to tourneys](#links-to-tourneys)
- [Result of a tournament](#result-of-tournament)
- [Utilities](#utilities)
- [Types](#types)

### Links to tourneys
You can get all tournament links of a given moment, a moment being a couple of
month and year input.

If you want to get all tournament of september 2022 you have to do it as follows;

```typescript
import { tournamentScraper } from './mtg-scraper2';

const linksOfTournaments = await tournamentScraper(9, 2022);

console.log(linksOfTournaments); // [ 'first link', 'second link', ...]
```

### Result of tournament
If you have a link of a magic the gathering online tournament to scrap, you can use
the tournamentParser with the given link as follows;

```typescript
import { tournamentParser } from './mtg-scraper2';

const tournamentData = await tournamentParser('url-of-the-tournament');

console.log(tournamentData);
```

The result of the function is described in the types section and is named 'IFullResult',
all interfaces are available through the library in your project.

### Utilities

You can quickly generate a unique ID like tourneys/decklist do have by using the generateUniqueID function;

```typescript
import { generateUniqueID } from './mtg-scraper2';

const data = generateUniqueID('Some string to hash'); // return a 32 characters long string
```

You can check if a given string is equal to a format name or "level of play" name.
All available formats are pauper, standard, pioneer, modern, legacy, vintage.
All type of play are league, preliminary, challenge, premier, showcase-challenge,
showcase-qualifier, eternal-weekend, super-qualifier

```typescript
import { guardFormat, guardLevelOfPlay } from './mtg-scraper2';

guardFormat('lalalal'); // return 'unknown'
guardFormat('pioneer'); // return 'pioneer'

guardLevelOfPlay('hhhaaa'); // return 'unknown'
guardLevelOfPlay('preliminary'); // return 'preliminary'

```

### Types

```typescript
interface ICard {
  id?: string | number;
  name: string;
  quantity: number;
  color?: string;
  cost?: number;
  type?: string;
}

interface IFilter {
  id?: string | number;
  name: string;
  format: string;
  includes: Array<ICard>;
  excludes: Array<ICard>;
}

interface IDeck {
  id?: string | number;
  sub_id: string;
  unique_id?: string;
  tournament_id: string;

  tournament_link?: string;

  tournament_in_time?: number;
  player_name: string;
  format: string;
  level_of_play: string;
  main_cards: Array<ICard>;
  side_cards: Array<ICard>;
  deck_name: string;
}

interface ITournament {
  id?: string | number;
  sub_id: string;
  name: string;
  unique_id?: string;
  link: string;
  in_time: number;
  month: number;
  year: number;
  format: string;
  platform: string;
  level_of_play: string;
  total_players: number;
}

interface IFullResults {
  tournament: ITournament;
  deckLists: Array<IDeck>;
  standings?: Pick<RawResults, 'standings'>;
  brackets?: Pick<RawResults, 'brackets'>;
  rawData: string;
}

interface RawDeckList {
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

interface RawResults {
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

# License
The license is as follows. The project is totally free and open source.

https://spdx.org/licenses/ISC.html
