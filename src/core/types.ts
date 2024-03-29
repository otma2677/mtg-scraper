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
  standing?: {
    rank: number;
    name: string;
    gwp: number;
    ogwp: number;
    omwp: number;
    loginid: number;
    points: number;
  };
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

export interface RawCard {
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
}

export interface RawDeck {
  sb: boolean;
  deck_cards: Array<RawCard>
}

export interface RawDeckList {
  player: string;
  loginid: number;
  deck: Array<RawDeck>
}

export interface RawPlacement {
  loginid: number;
  rank: number;
}

export interface RawStanding {
  rank: number;
  name: string;
  gwp: number;
  ogwp: number;
  omwp: number;
  loginid: number;
  points: number;
}

export interface RawBracket {
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
}

export interface RawResults {
  _id: string;
  event_name: string;
  date: string;
  event_type: string;
  decks: Array<RawDeckList>;
  subheader?: string;
  placement: Array<RawPlacement>;
  standings?: Array<RawStanding>
  brackets?: Array<RawBracket>;
}
