/**
 *
 */
import { checkURLFormat, checkURLLevelOfPlay, checkURLPlatform, getDateFromLink, getIDFromLink } from '../../core/utils';
import { zodRawLeagueMTGO, zodRawResultMTGOPayload, zodRawTournamentMTGO } from '../../types/type.zod.daybreak-mtgo';

/**
 *
 */
export async function MTGOTournamentParser(url: string) {
  const link = await getOriginalLink(url);

}

export async function getBulkData(url: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`${ response.status } - ${ response.statusText } \n**${ url }**`);

  const obj = await response.json() as Record<string, any>;
  const isWellFormatted = obj.returned === 1;
  if (!isWellFormatted)
    throw new Error(`Data has not returned correctly for tournament ${ url }\n${ JSON.stringify(obj) }`);

  return zodRawResultMTGOPayload.parse(obj);
}

export async function getOriginalLink(url: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`${ response.status } - ${ response.statusText } \n**${ url }**`);

  const text = await response.text();
  // console.log(globs.urls.censusUrl + '/' + window.MTGO.decklists.query);
  const baseURL = text
    .split('globs.urls.censusUrl = "')
    .at(1)
    ?.split('";')
    .at(0);

  const complementaryURL = text
    .split('window.MTGO.decklists.query = \'')
    .at(1)
    ?.split('\';')
    .at(0);

  return `${ baseURL }/${ complementaryURL }`;
}

// function generateRealLink(url: string) {
//   const id = getIDFromLink(url);
//   const type = checkURLLevelOfPlay(url);
//   const date = getDateFromLink(url);
//   const dateForLeague = `${ date.year }-${ date.month }-${ date.day }`;
//
//   const headLeague = 'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=';
//   const tailLeague = '&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists';
//
//   const headNonLeague = 'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=';
//   const tailNonLeague = '&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists';
//
//   return type === 'league'
//     ? `${ headLeague }${ id }_${ dateForLeague }${ tailLeague }`
//     : `${ headLeague }${ id }${ tailLeague }`;
// }
