/**
 * IMPORTS
 */
import { DOMWindow, JSDOM } from 'jsdom';
import { superFetch, checkURLFormat, checkURLLevelOfPlay } from '../../core/utils';
import { Card, Deck, FullResult, Tournament, RawDeckList, RawResult, fullResultSchema, deckSchema } from '../../core/types_schemas';
import { gatherer } from '../../core/gatherer';

/**
 *
 */
function getRawDeckListsScript (data: DOMWindow): RawResult {
  const rawScripts = data.document.scripts;
  const rawDeckLists = rawScripts[1]?.textContent?.split('window.MTGO.decklists.data =')[1].split(';')[0] as string;

  if (rawDeckLists === undefined)
    throw new TypeError('Cannot obtain raw deck list from dom window element.');

  return JSON.parse(rawDeckLists.toLowerCase()) as RawResult;
}

function getCardsSideOrMain (deck: RawDeckList, side = false) {
  const sub = deck.deck;
  const mainCards = sub.find(l => l.sb === side);
  const cards: Array<Card> = [];

  if (mainCards === undefined)
    throw new TypeError('No deck list content. Cannot scrap further data.');

  for (const card of mainCards.deck_cards) {
    cards.push({
      name: card.card_attributes.name,
      quantity: card.quantity,
      cost: card.card_attributes.cost,
      color: card.card_attributes.color,
      type: card.card_attributes.type
    });
  }

  return cards;
}

function getTypedDeckList (data: RawResult, tournament: Tournament): Array<Deck> {
  const typedDeckLists: Array<Deck> = [];

  for (const deckList of data.decks) {
    const main: Array<Card> = getCardsSideOrMain(deckList);
    const side: Array<Card> = getCardsSideOrMain(deckList, true);
    const standIndex = data.standings?.findIndex(stand => stand.loginid === deckList.loginid);
    const standing = data.standings === undefined ? undefined : data.standings[standIndex as number];

    const list: Deck = {
      login_id: String(deckList.loginid),
      tournament_name: tournament.name,
      player_name: deckList.player,
      format: tournament.format,
      level_of_play: tournament.level_of_play,
      main_cards: main,
      side_cards: side,
      deck_name: 'unknown',
      standing
    };

    typedDeckLists.push(list);
  }

  const isValid = typedDeckLists.map(list => deckSchema.safeParse(list));
  for (const valid of isValid)
    if (!valid.success)
      throw new Error('Cannot extract list from the given tournament.');

  for (const list of typedDeckLists)
    gatherer(list);

  return typedDeckLists;
}

/**
 *
 */
export async function MTGOTournamentParser (url: string): Promise<FullResult> {
  const data = await superFetch(url);
  const fullData = new JSDOM(data);

  /**
   * Processing data from the DOM elements
   */
  const rawDataScripts = getRawDeckListsScript(fullData.window);
  const name = url.split('/').at(-1) as string;
  const format = checkURLFormat(url);
  const levelOfPlay = checkURLLevelOfPlay(url);
  const platform = url.split('.')[1];
  const totalPlayers = rawDataScripts?.decks?.length;

  const tournament: Tournament = {
    name,
    link: url,
    format,
    level_of_play: levelOfPlay,
    platform,
    total_players: totalPlayers,
    original_id: rawDataScripts._id
  };

  const obj = {
    tournament,
    deckLists: getTypedDeckList(rawDataScripts, tournament),
    standings: rawDataScripts.standings as Pick<RawResult, 'standings'> ?? undefined,
    brackets: rawDataScripts.brackets as Pick<RawResult, 'brackets'> ?? undefined,
    rawData: JSON.stringify(rawDataScripts)
  };

  const isValidObject = fullResultSchema.parse(obj);

  return obj as FullResult;
}
