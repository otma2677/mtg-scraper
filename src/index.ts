/**
 * IMPORTS
 */
export {
  IDeck as IDeckLegacyDeprecated,
  IFullResult as IFullResultLegacyDeprecated,
  ITournament as ITournamentLegacyDeprecated,
  ICard as ICardLegacyDeprecated,
  IFilter as IFilterLegacyDeprecated,
  RawDeckList as RawDeckListLegacyDeprecated,
  RawStanding as RawStandingLegacyDeprecated,
  RawBracket as RawBracketLegacyDeprecated,
  RawDeck as RawDeckLegacyDeprecated,
  RawCard as RawCardLegacyDeprecated,
  RawPlacement as RawPlacementLegacyDeprecated,
  RawResults as RawResultsDeprecated
} from './core/types';

export {
  filterSchema as FilterSchemaDeprecated,
  cardSchema as CardSchemaDeprecated,
  deckSchema as DeckSchemaDeprecated,
  tournamentSchema as TournamentSchemaDeprecated,
  fullResultSchema as FullResultSchemaDeprecated,
  rawCardSchema as RawCardSchemaDeprecated,
  rawDeckSchema as RawDeckSchemaDeprecated,
  rawDeckListSchema as RawDeckListSchemaDeprecated,
  rawStandingSchema as RawStandingSchemaDeprecated,
  rawBracketSchema as RawBracketSchemaDeprecated,
  rawPlacementSchema as RawPlacementSchemaDeprecated,
  rawResultSchema as RawResultSchemaDeprecated,
  Filter as FilterDeprecated,
  Card as CardDeprecated,
  Deck as DeckDeprecated,
  Tournament as TournamentDeprecated,
  FullResult as FullResultDeprecated,
  RawCard as RawCardDeprecated,
  RawDeck as RawDeckDeprecated,
  RawDeckList as RawDeckListDeprecated,
  RawStanding as RawStandingDeprecated,
  RawBracket as RawBracketDeprecated,
  RawPlacement as RawPlacementDeprecated,
  RawResult as RawResultDeprecated
} from './core/types_schemas';

export {
  guardCard as guardCardDeprecated,
  guardFullResult as guardFullResultDeprecated,
  guardTournament as guardTournamentDeprecated,
  guardDeck as guardDeckDeprecated,
  guardFilter as guardFilterDeprecated,
  guardRawBracket as guardRawBracketDeprecated,
  guardRawStanding as guardRawStandingDeprecated,
  guardRawPlacement as guardRawPlacementDeprecated,
  guardRawDeckList as guardRawDeckListDeprecated,
  guardRawDeck as guardRawDeckDeprecated,
  guardRawCard as guardRawCardDeprecated,
  guardRawResult as guardRawResultDeprecated
} from './core/guards';

export {
  superFetch,
  checkURLLevelOfPlay,
  checkURLFormat,
  checkURLPlatform,
  checkFormat,
  checkPlatform,
  checkLevelOfPlay,
  getDateFromLink,
  type formatType as Format,
  type levelOfPlayType as Level,
  type platformType as Platform
} from './core/utils';

export {
  zodRawTournamentMTGO,
  type TournamentMTGO,
  zodRawLeagueMTGO,
  type LeagueMTGO,
  zodRawTournamentBracketMTGO,
  type TournamentBracketMTGO,
  zodRawTournamentStandingMTGO,
  type TournamentStandingMTGO,
  zodRawTournamentDecklistMTGO,
  type TournamentDecklistMTGO,
  zodRawTournamentCardMTGO,
  type TournamentCardMTGO,
  zodRawLeagueCardMTGO,
  type LeagueCardMTGO,
  zodRawResultMTGOPayload,
  type ResultMTGOPayload
} from './types/type.zod.daybreak-mtgo';

export { MTGOTournamentParser as deprecatedMTGOTournamentParser } from './tools/mtgo/tournament-parser';
export { MTGOTournamentScraper as deprecatedMTGOTournamentScraper } from './tools/mtgo/tournament-scraper';
export { MTGOTournamentScraper } from './tools/mtgo/tournament-scraper-new';
export { MTGOTournamentParser, getBulkData, getOriginalLink } from './tools/mtgo/tournament-parser-new';
export { filterer } from './core/filterer';
export { gatherer } from './core/gatherer';
