export interface ICard {
  id?: string | number;
  name: string;
  quantity: number;
  color?: string;
  cost?: number;
  type?: string;
}

export interface IFilter {
  id?: string | number;
  name: string;
  format: string;
  includes: Array<ICard>;
  excludes: Array<ICard>;
}

export interface IDeck {
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

export interface ITournament {
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

export interface IFullResults {
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
