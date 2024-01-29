/**
 *
 */
import assert from 'node:assert';
import { setTimeout as sleep } from 'node:timers/promises';
import { getOriginalLink, getBulkData, MTGOTournamentParser } from '../../../src/tools/mtgo/tournament-parser-new';

/**
 *
 */
describe('Test tournamentParserNew', function() {
  const links = [
    'https://www.mtgo.com/decklist/modern-preliminary-2024-01-2512608591',
    'https://www.mtgo.com/decklist/pauper-league-2024-01-257795',
    'https://www.mtgo.com/decklist/legacy-showcase-challenge-2024-01-2112607183',
    'https://www.mtgo.com/decklist/modern-preliminary-2020-08-3112201368',
    'https://www.mtgo.com/decklist/mocs-legacy-showcase-qualifier-2020-08-3012201322',
    'https://www.mtgo.com/decklist/legacy-challenge-32-2022-10-2912489843',
    'https://www.mtgo.com/decklist/standard-challenge-32-2023-06-2512560130',
    'https://www.mtgo.com/decklist/standard-challenge-32-2023-06-1812558735',
    'https://www.mtgo.com/decklist/legacy-showcase-challenge-2023-06-1112556856',
    'https://www.mtgo.com/decklist/vintage-challenge-2022-10-3012489850',
    'https://www.mtgo.com/decklist/legacy-challenge-32-2022-10-2912489843',
    'https://www.mtgo.com/decklist/pioneer-showcase-challenge-2022-10-1612485579',
    'https://www.mtgo.com/decklist/legacy-league-2024-01-267779',
    'https://www.mtgo.com/decklist/standard-last-chance-2022-11-3012498954',
    'https://www.mtgo.com/decklist/vintage-league-2022-11-297006',
    'https://www.mtgo.com/decklist/legacy-league-2023-05-307285'
  ];

  const expected = [
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12608591&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7795_2024-01-25&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12607183&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12201368&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12201322&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12489843&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12560130&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12558735&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12556856&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12489850&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12489843&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12485579&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7779_2024-01-26&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12498954&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7006_2022-11-29&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists',
    'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7285_2023-05-30&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists'
  ];

  it('Test getOriginalLink', async function() {
    this.timeout(20_000);

    for (let i = 0; i < links.length; i++) {
      await sleep(250);
      const link = await getOriginalLink(links[i]);

      assert.equal(link, expected[i]);
    }
  });

  it('Test getBulkData', async function() {
    this.timeout(150_000);

    for (let i = 0; i < expected.length; i++) {
      await sleep(250);

      try {
        const result = await getBulkData(expected[i]);
        const eventID = (links[i] + ' ')
          .split('/')
          .at(-1)
          ?.split('-')
          .at(-1)
          ?.slice(2, -1);

        assert.equal(result instanceof Object, true);
        if (result.league_cover_page_list)
          assert.equal(result.league_cover_page_list[0].playeventid, eventID);
        if (result.tournament_cover_page_list)
          assert.equal(result.tournament_cover_page_list[0].event_id, eventID);
      } catch (err) {
        assert.fail(`Cannot parse ${ links[i] }.`);
      }
    }
  });

  it('Test MTGOTournamentParser', async function() {
    this.timeout(15_000);

    const link = links[0];
    const obj = await MTGOTournamentParser(link);
    const raw = obj.payload.tournament_cover_page_list;

    assert.equal(obj.eventID, '12608591');
    if (raw?.length === 1)
      assert.equal(raw[0].event_id,'12608591');
    else
      assert.fail('Not bulk raw data available');
  });
});
