/**
 * IMPORTS
 */
import { DOMWindow, JSDOM } from 'jsdom';
import { superFetch, generateUniqueID, checkURLFormat, checkURLLevelOfPlay } from '../../core/utils';
import { ICard, IDeck, IFullResult, ITournament, RawDeckList, RawResults } from '../../core/types';

/**
 *
 */
const getRawDeckListsScript = (data: DOMWindow): RawResults => {
  const rawScripts = data.document.scripts;
  const rawDeckLists = rawScripts[1]?.textContent?.split('window.MTGO.decklists.data =')[1].split(';')[0] as string;
  return JSON.parse(rawDeckLists.toLowerCase()) as RawResults;
};

const getMainDeckList = (deck: RawDeckList) => {
  const subDeck = deck.deck;
  const rawMainCards = subDeck.find(l => !l.sb);
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

const getSideDeckList = (deck: RawDeckList) => {
  const subDeck = deck.deck;
  const rawMainCards = subDeck.find(l => l.sb);
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

    const list: IDeck = {
      login_id: String(deckList.loginid),
      tournament_name: tournament.name,
      player_name: deckList.player,
      format: tournament.format,
      level_of_play: tournament.level_of_play,
      main_cards: main,
      side_cards: side,
      deck_name: 'unknown',
    };

    typedDeckLists.push(list);
  }

  return typedDeckLists;
};

/**
 *
 */
export const MTGOTournamentParser = async (url: string): Promise<IFullResult> => {
  const data = await superFetch(url);
  const fullData = new JSDOM(data);
  // const document = fullData.window.document;
  const rawDataScripts = getRawDeckListsScript(fullData.window);
  const name = url.split('/').at(-1) as string;
  const format = checkURLFormat(url);
  const levelOfPlay = checkURLLevelOfPlay(url);
  const platform = url.split('.')[1];
  const totalPlayers = rawDataScripts?.decks?.length;
  const sub_id = generateUniqueID(url);

  const tournament: ITournament = {
    name,
    link: url,
    format,
    level_of_play: levelOfPlay,
    platform,
    total_players: totalPlayers,
    original_id: sub_id
  };

  return {
    tournament,
    deckLists: getTypedDeckList(rawDataScripts, tournament),
    standings: rawDataScripts.standings as Pick<RawResults, 'standings'> ?? undefined,
    brackets: rawDataScripts.brackets as Pick<RawResults, 'brackets'> ?? undefined,
    rawData: JSON.stringify(rawDataScripts)
  };
};
