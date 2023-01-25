/**
 * IMPORTS
 */
import { DOMWindow, JSDOM } from 'jsdom';
import { superFetch, generateUniqueID } from '../../core/utils';
import { guardFormat } from '../../core/guard-format';
import { guardLevelOfPlay } from '../../core/guard-level';
import { ICard, IDeck, IFullResults, ITournament, RawDeckList, RawResults } from '../../core/types';

/**
 *
 */
const getMonthFromURL = (url: string) => {
  const getLevel = guardLevelOfPlay(url);

  if (getLevel.split('-').length === 1) {
    return url.split('/').at(-1)?.split('-')[3];
  } else {
    return url.split('/').at(-1)?.split('-')[4];
  }
};

const getYearFromURL = (url: string) => {
  const getLevel = guardLevelOfPlay(url);

  if (getLevel.split('-').length === 1) {
    return url.split('/').at(-1)?.split('-')[2];
  } else {
    return url.split('/').at(-1)?.split('-')[3];
  }
};

const getRawDeckListsScript = (data: DOMWindow): RawResults => {
  const rawScripts = data.document.scripts;
  const rawDeckLists = rawScripts[1]?.textContent?.split('window.MTGO.decklists.data =')[1].split(';')[0] as string;
  return JSON.parse(rawDeckLists.toLowerCase()) as RawResults;
};

const getMainDeckList = (deck: RawDeckList) => {
  const subDeck = deck.deck;
  const rawMainCards = subDeck.find(l => l.sb === false);
  const cards: Array<ICard> = [];

  if (rawMainCards === undefined) throw new TypeError('Deck list content is undefined, data cannot be scraped.');

  for (const card of rawMainCards.deck_cards) {
    const aCard: ICard = {
      name: card.card_attributes.name,
      quantity: card.quantity,
      cost: card.card_attributes.cost,
      color: card.card_attributes.color,
      type: card.card_attributes.type
    };

    cards.push(aCard);
  }

  return cards;
};

const getDate = (tournamentLink: string): { month: string, year: string, day: string } => {
  const arrOfSegment = tournamentLink.split('/').at(-1);
  const lastSegmentSplit = arrOfSegment?.split('-');
  const isLeague = lastSegmentSplit?.at(1);

  if (isLeague === 'league') {
    return {
      month: lastSegmentSplit?.at(3) as string,
      year: lastSegmentSplit?.at(2) as string,
      day: lastSegmentSplit?.at(4) as string,
    };
  } else {
    const rawDay = lastSegmentSplit?.at(-1);
    return {
      month: lastSegmentSplit?.at(-2) as string,
      year: lastSegmentSplit?.at(-3) as string,
      day: rawDay?.slice(0, 1) as string
    };
  }
};

const getSideDeckList = (deck: RawDeckList) => {
  const subDeck = deck.deck;
  const rawMainCards = subDeck.find(l => l.sb === true);
  const cards: Array<ICard> = [];

  if (rawMainCards === undefined) throw new TypeError('Deck list content is undefined, data cannot be scraped.');

  for (const card of rawMainCards.deck_cards) {
    const aCard: ICard = {
      name: card.card_attributes.name,
      quantity: card.quantity,
      cost: card.card_attributes.cost,
      color: card.card_attributes.color,
      type: card.card_attributes.type
    };

    cards.push(aCard);
  }

  return cards;
};

const getTypedDeckList = (data: RawResults, tournament: ITournament): Array<IDeck> => {
  const typedDeckLists: Array<IDeck> = [];

  for (const deckList of data.decks) {
    const main: Array<ICard> = getMainDeckList(deckList);
    const side: Array<ICard> = getSideDeckList(deckList);
    const dates = getDate(tournament.link);

    const list: IDeck = {
      sub_id: String(deckList.loginid),
      unique_id: generateUniqueID(String(deckList.loginid + deckList.player)),
      tournament_id: tournament.sub_id,
      format: tournament.format,
      player_name: deckList.player,
      level_of_play: tournament.level_of_play,
      deck_name: 'unknown',
      main_cards: main,
      side_cards: side,
      tournament_link: tournament.link + '#deck_' + deckList.player,
      tournament_in_time: new Date(dates.year+dates.month+dates.day).getTime()
    };

    typedDeckLists.push(list);
  }

  return typedDeckLists;
};

/**
 *
 */
export const tournamentParser = async (url: string): Promise<IFullResults> => {
  const data = await superFetch(url);
  const fullData = new JSDOM(data);
  // const document = fullData.window.document;
  const rawDataScripts = getRawDeckListsScript(fullData.window);
  const dates = getDate(url);

  const name = url.split('/').at(-1) as string;
  const format = guardFormat(url);
  const levelOfPlay = guardLevelOfPlay(url);
  const year = Number(dates.year);
  const month = Number(dates.month);
  const times = new Date(dates.year+dates.month+dates.day).getTime();
  const platform = url.split('.')[1];
  const totalPlayers = rawDataScripts?.decks?.length;
  const sub_id = generateUniqueID(url);

  const tournament: ITournament = {
    name,
    in_time: times,
    link: url,
    format,
    level_of_play: levelOfPlay,
    year,
    month,
    platform,
    total_players: totalPlayers,
    sub_id
  };

  return {
    tournament,
    deckLists: getTypedDeckList(rawDataScripts, tournament),
    standings: rawDataScripts.standings as Pick<RawResults, 'standings'> ?? undefined,
    brackets: rawDataScripts.brackets as Pick<RawResults, 'brackets'> ?? undefined,
    rawData: JSON.stringify(rawDataScripts)
  };
};
