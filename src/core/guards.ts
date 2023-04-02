import { ICard, IDeck, IFilter, IFullResult, ITournament } from './types';

export const guardCard = (obj: any): obj is ICard => {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.quantity === 'number' ||
    (typeof obj.color === 'string' || typeof obj.color === undefined || typeof obj.color === null) ||
    (typeof obj.cost === 'number' || typeof obj.color === undefined || typeof obj.color === null) ||
    (typeof obj.type === 'string' || typeof obj.type === undefined || typeof obj.type === null)
  );
};

export const guardFilter = (obj: any): obj is IFilter => {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.format === 'string' &&
    (Array.isArray(obj.includes) && (obj.includes?.every((c: any) => guardCard(c)) || obj.includes.length === 0)) &&
    (Array.isArray(obj.excludes) && (obj.excludes?.every((c: any) => guardCard(c)) || obj.excludes.length === 0))
  );
};

export const guardDeck = (obj: any): obj is IDeck => {
  return (
    typeof obj === 'object' &&
    typeof obj.login_id === 'string' &&
    typeof obj.tournament_name === 'string' &&
    typeof obj.player_name === 'string' &&
    typeof obj.format === 'string' &&
    typeof obj.level_of_play === 'string' &&
    (Array.isArray(obj.main_cards) && (obj.main_cards?.every((c: any) => guardCard(c)) || obj.main_cards.length === 0 )) &&
    (Array.isArray(obj.side_cards) && (obj.side_cards?.every((c: any) => guardCard(c)) || obj.side_cards.length === 0 )) &&
    typeof obj.deck_name === 'string'
  );
};

export const guardTournament = (obj: any): obj is ITournament => {
  return (
    typeof obj === 'object' &&
    typeof obj.original_id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.link === 'string' &&
    typeof obj.format === 'string' &&
    typeof obj.platform === 'string' &&
    typeof obj.level_of_play === 'string' &&
    typeof obj.total_players === 'number'
  );
};

export const guardFullResult = (obj: any): obj is IFullResult => {
  return (
    typeof obj === 'object' &&
    guardTournament(obj.tournament) &&
    (Array.isArray(obj.deckLists) && obj.deckLists.every((d: any) => guardDeck(d))) &&
    (typeof obj.standings?.standings === 'object' || obj.standings?.standings === undefined || obj.standings?.standings === null) &&
    (typeof obj.brackets?.brackets === 'object' || obj.brackets?.brackets === undefined || obj.brackets?.brackets === null) &&
    typeof obj.rawData === 'string'
  );
};
