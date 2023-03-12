import { z } from 'zod';

export const cardSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  quantity: z.number(),
  color: z.string().optional(),
  cost: z.number().optional(),
  type: z.string().optional()
});

export const filterSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  format: z.string(),
  includes: z.array(cardSchema),
  excludes: z.array(cardSchema)
});

export const deckSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  sub_id: z.string(),
  unique_id: z.string().optional(),
  tournament_id: z.string(),
  tournament_link: z.string().optional(),
  tournament_in_time: z.number().optional(),
  player_name: z.string(),
  format: z.string(),
  level_of_play: z.string(),
  main_cards: z.array(cardSchema),
  side_cards: z.array(cardSchema),
  deck_name: z.string()
});

export const tournamentSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  sub_id: z.string(),
  name: z.string(),
  unique_id: z.string().optional(),
  link: z.string(),
  in_time: z.number(),
  month: z.number(),
  year: z.number(),
  format: z.string(),
  platform: z.string(),
  level_of_play: z.string(),
  total_players: z.number()
});

export const rawDeckListSchema = z.object({
  player: z.string(),
  loginid: z.number(),
  deck: z.array(
    z.object({
      sb: z.boolean(),
      deck_cards: z.array(
        z.object({
          card_attributes: z.object({
            type: z.string(),
            set: z.string(),
            color: z.string(),
            card_code: z.number(),
            rarity: z.string(),
            name: z.string(),
            cost: z.number()
          }),
          quantity: z.number()
        })
      )
    })
  )
});

export const rawResultsSchema = z.object({
  _id: z.string(),
  event_name: z.string(),
  date: z.string(),
  event_type: z.string(),
  decks: z.array(rawDeckListSchema),
  subheader: z.string().optional(),
  placement: z.array(
    z.object({
      loginid: z.number(),
      rank: z.number()
    })
  ),
  standings: z
    .array(
      z.object({
        rank: z.number(),
        name: z.string(),
        GWP: z.number(),
        OGWP: z.number(),
        OMWP: z.number(),
        loginid: z.number(),
        points: z.number()
      })
    )
    .optional(),
  brackets: z
    .array(
      z.object({
        index: z.number(),
        matches: z.array(
          z.object({
            players: z.array(
              z.object({
                loginid: z.number(),
                player: z.string(),
                seeding: z.number(),
                wins: z.number(),
                losses: z.number(),
                winner: z.boolean()
              })
            )
          })
        )
      })
    )
    .optional()
});

export const fullResultsSchema = z.object({
  tournament: tournamentSchema,
  deckLists: z.array(deckSchema),
  standings: rawResultsSchema.pick({ standings: true }),
  brackets: rawResultsSchema.pick({ brackets: true }),
  rawData: z.string()
});
