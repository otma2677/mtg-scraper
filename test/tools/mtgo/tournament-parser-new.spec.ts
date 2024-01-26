/**
 *
 */
import assert from 'node:assert';
import { MTGOTournamentParser, getOriginalLink } from '../../../src/tools/mtgo/tournament-parser-new';

/**
 *
 */
describe('Test tournamentParserNew', function() {
  this.timeout(7500);

  it('Test getOriginalLink', async function() {
    const links = [
      'https://www.mtgo.com/decklist/modern-preliminary-2024-01-2512608591',
      'https://www.mtgo.com/decklist/pauper-league-2024-01-257795',
      'https://www.mtgo.com/decklist/legacy-showcase-challenge-2024-01-2112607183',
      'https://www.mtgo.com/decklist/modern-preliminary-2020-08-3112201368',
      'https://www.mtgo.com/decklist/mocs-legacy-showcase-qualifier-2020-08-3012201322',
      'https://www.mtgo.com/decklist/2018-mocs-open-2018-06-3011460902',
      'https://www.mtgo.com/decklist/legacy-challenge-32-2022-10-2912489843'
    ];

    const expected = [
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12608591&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7795_2024-01-25&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12607183&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12201368&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12201322&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=11460902&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists',
      'https://census.daybreakgames.com/s:dgc/get/mtgo/tournament_cover_page?event_id=12489843&c:join=type:tournament_final_ranking^on:event_id^to:tournamentid^list:1^inject_at:final_rank,type:tournament_win_loss^on:event_id^to:tournamentid^list:1^inject_at:winloss,type:tournament_player_count^on:event_id^to:tournamentid^inject_at:player_count,type:tournament_brackets_by_id^to:tournamentid^on:event_id^rawList:1^inject_at:brackets,type:qualifying_round_standings^on:event_id^to:tournamentid^list:1^inject_at:standings,type:tournament_decklist_by_id^on:event_id^to:tournamentid^rawList:1^inject_at:decklists'
    ];

    for (let i = 0; i < links.length; i++) {
      const link = await getOriginalLink(links[i]);

      assert.equal(link, expected[i]);
    }
  });
});
