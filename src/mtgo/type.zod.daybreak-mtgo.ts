/**
 *
 */
import { z } from 'zod';

/**
 * RAW
 */

/**
 * ZOD
 */
export const zodRawTournamentCardMTGO = z.object({
  decktournamentid: z.string(),
  docid: z.string(),
  qty: z.string().transform(v => Number(v)),
  sideboard: z.union([ z.literal('true'), z.literal('false') ]).transform(v => v === 'true'),
  card_attributes: z.object({
    digitalobjectcatalogid: z.string().optional(),
    card_name: z.string(),
    cost: z.string().transform(v => Number(v)).optional(),
    rarity: z.string().optional(),
    color: z.string().optional(),
    cardset: z.string().optional(),
    card_type: z.string().optional(),
    colors: z.string()
      .array()
      .transform(v => v.toString())
      .optional()
  })
});

export type TournamentCardMTGO = z.infer<typeof zodRawTournamentCardMTGO>;

export const zodRawTournamentDecklistMTGO = z.object({
  loginid: z.string(),
  tournamentid: z.string(),
  decktournamentid: z.string(),
  player: z.string(),
  main_deck: z.array(zodRawTournamentCardMTGO),
  sideboard_deck: z.array(zodRawTournamentCardMTGO)
});

export type TournamentDecklistMTGO = z.infer<typeof zodRawTournamentDecklistMTGO>;

export const zodRawTournamentStandingMTGO = z.object({
  tournamentid: z.string(),
  loginid: z.string(),
  login_name: z.string(),
  rank: z.string().transform(v => Number(v)),
  score: z.string().transform(v => Number(v)),
  opponentmatchwinpercentage: z.string().transform(v => Number(v)),
  gamewinpercentage: z.string().transform(v => Number(v)),
  opponentgamewinpercentage: z.string().transform(v => Number(v)),
  eliminated: z.union([ z.literal('true'), z.literal('false') ]).transform(v => v === 'true')
});

export type TournamentStandingMTGO = z.infer<typeof zodRawTournamentStandingMTGO>;

export const zodRawTournamentBracketMTGO = z.object({
  index: z.number(),
  matches: z.array(z.object({
    players: z.array(z.object({
      loginid: z.number(),
      player: z.string(),
      seeding: z.number(),
      wins: z.number(),
      losses: z.number(),
      winner: z.boolean()
    }))
  }))
});

export type TournamentBracketMTGO = z.infer<typeof zodRawTournamentBracketMTGO>;

export const zodRawTournamentMTGO = z.object({
  event_id: z.string(),
  description: z.string(),
  starttime: z.string().transform(v => new Date(v)),
  format: z.string(),
  type: z.string(),
  site_name: z.string(),
  decklists: z.array(zodRawTournamentDecklistMTGO),
  standings: z.array(zodRawTournamentStandingMTGO),
  brackets: z.array(zodRawTournamentBracketMTGO),
  final_rank: z.array(z.object({
    tournamentid: z.string(),
    loginid: z.string(),
    rank: z.string().transform(v => Number(v)),
    roundnumber: z.string().transform(v => Number(v))
  })).optional(),
  winloss: z.array(z.object({
    tournamentid: z.string(),
    loginid: z.string(),
    losses: z.string().transform(v => Number(v)),
    wins: z.string().transform(v => Number(v))
  })),
  player_count: z.object({
    tournamentid: z.string(),
    players: z.string().transform(v => Number(v)),
    queued_players: z.string().transform(v => Number(v))
  })
});

export type TournamentMTGO = z.infer<typeof zodRawTournamentMTGO>;

export const zodRawLeagueCardMTGO = z.object({
  leaguedeckid: z.string(),
  loginplayeventcourseid: z.string(),
  docid: z.string(),
  qty: z.string().transform(v => Number(v)),
  sideboard: z.union([ z.literal('true'), z.literal('false') ])
    .transform(v => v === 'true'),
  card_attributes: z.object({
    digitalobjectcatalogid: z.string().optional(),
    card_name: z.string(),
    cost: z.string().optional(),
    rarity: z.string().optional(),
    color: z.string().optional(),
    cardset: z.string().optional(),
    card_type: z.string().optional(),
    colors: z.array(z.string()).optional()
  })
});

export type LeagueCardMTGO = z.infer<typeof zodRawLeagueCardMTGO>;

export const zodRawLeagueMTGO = z.object({
  playeventid: z.string(),
  name: z.string(),
  publish_date: z.string(),
  instance_id: z.string(),
  site_name: z.string(),
  decklists: z.array(z.object({
    loginplayeventcourseid: z.string(),
    loginid: z.string(),
    instance_id: z.string(),
    player: z.string(),
    main_deck: z.array(zodRawLeagueCardMTGO),
    sideboard_deck: z.array(zodRawLeagueCardMTGO),
    wins: z.object({
      loginplayeventcourseid: z.string(),
      wins: z.string().transform(v => Number(v)),
      losses: z.string().transform(v => Number(v))
    })
  }))
});

export type LeagueMTGO = z.infer<typeof zodRawLeagueMTGO>;

export const zodRawResultMTGOPayload = z.object({
  returned: z.number(),
  league_cover_page_list: z.array(zodRawLeagueMTGO).optional(),
  tournament_cover_page_list: z.array(zodRawTournamentMTGO).optional()
});

export type ResultMTGOPayload = z.infer<typeof zodRawResultMTGOPayload>;


// interface JsonPayloadShape {
//   returned: number;
//   tournament_cover_page_list?: Array<any>;
//   league_cover_page_list?: Array<any>;
// }
//
// interface Card {
//   decktournamentid: string;
//   docid: string;
//   qty: string;
//   sidebaord: 'true' | 'false';
//   card_attributes: {
//     digitalobjectcatalogid: string;
//     card_name: string;
//     cost: string;
//     rarity: string;
//     color: string;
//     cardset: string;
//     card_type: string;
//     colors: Array<string>;
//   }
// }
//
// interface TournamentShape {
//   event_id: string;
//   description: string;
//   starttime: string;
//   format: string;
//   type: string;
//   site_name: string;
//   decklists: Array<{
//     loginid: string;
//     tournamentid: string;
//     decktournamentid: string;
//     player: string;
//     main_deck: Array<Card>;
//     sideboard_deck: Array<Card>;
//   }>;
//   standings: Array<{
//     tournamentid: string;
//     loginid: string;
//     login_name: string;
//     rank: string;
//     score: string;
//     opponentmatchwinpercentage: string;
//     gamewinpercentage: string;
//     opponentgamewinpercentage: string;
//     eliminated: 'true' | 'false';
//   }>;
//   brackets: Array<{
//     matches: Array<{
//       players: Array<{
//         loginid: string;
//         player: string;
//         seeding: number;
//         wins: number;
//         losses: number;
//         winner: boolean;
//       }>
//     }>;
//     index: number;
//   }>;
//   final_rank: Array<{ tournamentid: string; loginid: string; rank: string; roundnumber: string; }>;
//   winloss: Array<{ tournamentid: string; loginid: string; losses: string; wins: string; }>;
//   player_count: { tournamentid: string; players: string; queued_players: string; };
// }
