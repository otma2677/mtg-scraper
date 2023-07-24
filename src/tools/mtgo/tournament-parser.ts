/**
 * IMPORTS
 */
import { superFetch, checkURLFormat, checkURLLevelOfPlay } from '../../core/utils';
import { Card, Deck, FullResult, Tournament, RawDeckList, RawResult, fullResultSchema, deckSchema, rawResultSchema } from '../../core/types_schemas';
import { gatherer } from '../../core/gatherer';

/**
 *
 */
function getCardsSideOrMain (deck: RawDeckList, side = false) {
  const sub = deck.deck;

  if (!sub)
    throw new Error('No decks bro');

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

function extractScript(text: string) {
  const scriptChunk = text.split('<script>')[1]; // Raw chunk of script
  const firstChunk = scriptChunk.split('</script>')[0]; // Cut the endpart
  const scriptContentWithComma = firstChunk.split('window.MTGO.decklists.data = ')[1];
  const realScriptContent = scriptContentWithComma.split(';')[0];
  const object = JSON.parse(realScriptContent.toLowerCase());
  rawResultSchema.parse(object);

  return object as RawResult;
}

/**
 *
 */
export async function MTGOTournamentParser (url: string): Promise<FullResult> {
  const data = await superFetch(url);

  const rawResults = extractScript(data);

  const name = url.split('/').at(-1) as string;
  const format = checkURLFormat(url);
  const levelOfPlay = checkURLLevelOfPlay(url);
  const platform = url.split('.')[1];
  const totalPlayers = rawResults.decks.length;

  const tournament: Tournament = {
    name,
    link: url,
    format,
    level_of_play: levelOfPlay,
    platform,
    total_players: totalPlayers,
    original_id: rawResults._id
  };

  const obj = {
    tournament,
    deckLists: getTypedDeckList(rawResults, tournament),
    standings: rawResults.standings as Pick<RawResult, 'standings'> ?? undefined,
    brackets: rawResults.brackets as Pick<RawResult, 'brackets'> ?? undefined,
    rawData: JSON.stringify(rawResults)
  };

  fullResultSchema.parse(obj);

  return obj as FullResult;
}
