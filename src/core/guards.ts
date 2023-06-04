import {
  ICard,
  IDeck,
  IFilter,
  IFullResult,
  ITournament, RawBracket,
  RawCard,
  RawDeck,
  RawDeckList,
  RawPlacement,
  RawResults, RawStanding
} from './types';

export function guardCard (obj: any): obj is ICard {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.quantity === 'number' ||
    (typeof obj.color === 'string' || typeof obj.color === undefined || typeof obj.color === null) ||
    (typeof obj.cost === 'number' || typeof obj.color === undefined || typeof obj.color === null) ||
    (typeof obj.type === 'string' || typeof obj.type === undefined || typeof obj.type === null)
  );
}

export function guardFilter (obj: any): obj is IFilter {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.format === 'string' &&
    (Array.isArray(obj.includes) && (obj.includes?.every((c: any) => guardCard(c)) || obj.includes.length === 0)) &&
    (Array.isArray(obj.excludes) && (obj.excludes?.every((c: any) => guardCard(c)) || obj.excludes.length === 0))
  );
}

export function guardDeck (obj: any): obj is IDeck {
  return (
    typeof obj === 'object' &&
    typeof obj.login_id === 'string' &&
    typeof obj.tournament_name === 'string' &&
    typeof obj.player_name === 'string' &&
    typeof obj.format === 'string' &&
    typeof obj.level_of_play === 'string' &&
    (Array.isArray(obj.main_cards) && (obj.main_cards?.every((c: any) => guardCard(c)) || obj.main_cards.length === 0)) &&
    (Array.isArray(obj.side_cards) && (obj.side_cards?.every((c: any) => guardCard(c)) || obj.side_cards.length === 0)) &&
    typeof obj.deck_name === 'string'
  );
}

export function guardTournament (obj: any): obj is ITournament {
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
}

export function guardFullResult (obj: any): obj is IFullResult {
  return (
    typeof obj === 'object' &&
    guardTournament(obj.tournament) &&
    (Array.isArray(obj.deckLists) && obj.deckLists.every((d: any) => guardDeck(d))) &&
    (typeof obj.standings?.standings === 'object' || obj.standings?.standings === undefined || obj.standings?.standings === null) &&
    (typeof obj.brackets?.brackets === 'object' || obj.brackets?.brackets === undefined || obj.brackets?.brackets === null) &&
    typeof obj.rawData === 'string'
  );
}

export function guardRawCard (obj: any): obj is RawCard {
  return (
    typeof obj === 'object' &&
    typeof obj.quantity === 'number' &&
    typeof obj.card_attributes === 'object' &&
    typeof obj.card_attributes.name === 'string' &&
    typeof obj.card_attributes.cost === 'number' &&
    typeof obj.card_attributes.card_code === 'number' &&
    typeof obj.card_attributes.color === 'string' &&
    typeof obj.card_attributes.type === 'string' &&
    typeof obj.card_attributes.rarity === 'string' &&
    typeof obj.card_attributes.set === 'string'
  );
}

export function guardRawDeck (obj: any): obj is RawDeck {
  return (
    typeof obj === 'object' &&
    typeof obj.sb === 'boolean' &&
    (Array.isArray(obj.deck_cards) && (obj.deck_cards.every((c: unknown) => guardRawCard(c)) || obj.deck_cards.length === 0))
  );
}

export function guardRawDeckList (obj: any): obj is RawDeckList {
  return (
    typeof obj === 'object' &&
    typeof obj.player === 'string' &&
    typeof obj.login.id === 'number' &&
    (Array.isArray(obj.deck) && (obj.deck.every((d: unknown) => guardRawDeck(d)) || obj.deck.length === 0))
  );
}

export function guardRawPlacement (obj: any): obj is RawPlacement {
  return (
    typeof obj === 'object' &&
    typeof obj.loginid === 'number' &&
    typeof obj.rank === 'number'
  );
}

export function guardRawStanding (obj: any): obj is RawStanding {
  return (
    typeof obj === 'object' &&
    typeof obj.rank === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.gwp === 'number' &&
    typeof obj.ogwp === 'number' &&
    typeof obj.omwp === 'number' &&
    typeof obj.loginid === 'number' &&
    typeof obj.points === 'number'
  );
}

export function guardRawBracket (obj: any): obj is RawBracket {
  return (
    typeof obj === 'object' &&
    typeof obj.index === 'number' &&
    (Array.isArray(obj.matches) && ((obj.matches.every((i: any) => {
      return (
        Array.isArray(i.players) && (i.players.every((p: any) => {
          return (
            typeof p === 'object' &&
            typeof p.loginid === 'number' &&
            typeof p.player === 'string' &&
            typeof p.seeding === 'number' &&
            typeof p.wins === 'number' &&
            typeof p.losses === 'number' &&
            typeof p.winner === 'boolean'
          );
        }) || i.players.length === 0)
      );
    })) || obj.matches.length === 0))
  );
}

export function guardRawResult (obj: any): obj is RawResults {
  return (
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    typeof obj.event_name === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.event_type === 'string' &&
    (Array.isArray(obj.decks) && (obj?.decks?.every((d: unknown) => guardRawDeckList(d)) || obj.decks.length === 0)) &&
    (typeof obj.subheader === 'string' || obj.subheader === undefined) &&
    (Array.isArray(obj.placement) && (obj?.placement?.every((p: unknown) => guardRawPlacement(p)) || obj.placement.length === 0)) &&
    (obj.standings === undefined || (Array.isArray(obj.standings) && obj.standings.every((s: unknown) => guardRawStanding(s)))) &&
    (obj.brackets === undefined || (Array.isArray(obj.brackets) && obj.brackets.every((b: unknown) => guardRawBracket(b))))
  );
}
