export interface ICard {
  id?: string | number;
  name: string;
  quantity: number;
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
  player_name: string;
  format: string;
  level_of_play: string;
  main_cards: Array<ICard>;
  side_cards: Array<ICard>;
  deck_name: string;
}
