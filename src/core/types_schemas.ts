import Z from 'zod';
export const cardSchema = Z.object({
  name: Z.string(),
  quantity: Z.number(),
  color: Z.string().optional(),
  cost: Z.number().optional(),
  type: Z.string().optional()
});

export type Card = Z.infer<typeof cardSchema>;

export const filterSchema = Z.object({
  name: Z.string(),
  format: Z.string(),
  includes: Z.array(cardSchema),
  excludes: Z.array(cardSchema)
});

export type Filter = Z.infer<typeof filterSchema>;

export const deckSchema = Z.object({
  login_id: Z.string(),
  tournament_name: Z.string(),
  player_name: Z.string(),
  format: Z.string(),
  level_of_play: Z.string(),
  main_cards: Z.array(cardSchema),
  side_cards: Z.array(cardSchema),
  deck_name: Z.string(),
  standing: Z.object({
    rank: Z.number(),
    name: Z.string(),
    gwp: Z.number(),
    ogwp: Z.number(),
    omwp: Z.number(),
    loginid: Z.number(),
    points: Z.number()
  }).optional()
});

export type Deck = Z.infer<typeof deckSchema>;

export const tournamentSchema = Z.object({
  original_id: Z.string(),
  name: Z.string(),
  link: Z.string(),
  format: Z.string(),
  platform: Z.string(),
  level_of_play: Z.string(),
  total_players: Z.number()
});

export type Tournament = Z.infer<typeof tournamentSchema>;

export const rawCardSchema = Z.object({
  quantity: Z.number(),
  card_attributes: Z.object({
    type: Z.string(),
    set: Z.string(),
    color: Z.string(),
    card_code: Z.number(),
    rarity: Z.number(),
    name: Z.string(),
    cost: Z.number()
  })
});

export type RawCard = Z.infer<typeof rawCardSchema>;

export const rawDeckSchema = Z.object({
  sb: Z.boolean(),
  deck_cards: Z.array(rawCardSchema)
});

export type RawDeck = Z.infer<typeof rawDeckSchema>;

export const rawDeckListSchema = Z.object({
  player: Z.string(),
  loginid: Z.number(),
  deck: Z.array(rawDeckSchema)
});

export type RawDeckList = Z.infer<typeof rawDeckListSchema>;

export const rawPlacementSchema = Z.object({
  loginid: Z.number(),
  rank: Z.number()
});

export type RawPlacement = Z.infer<typeof rawPlacementSchema>;

export const rawStandingSchema = Z.object({
  rank: Z.number(),
  name: Z.string(),
  gwp: Z.number(),
  ogwp: Z.number(),
  omwp: Z.number(),
  loginid: Z.number(),
  points: Z.number()
});

export type RawStanding = Z.infer<typeof rawStandingSchema>;

export const rawBracketSchema = Z.object({
  index: Z.number(),
  matches: Z.array(Z.object({
    players: Z.array(Z.object({
      loginid: Z.number(),
      player: Z.string(),
      seeding: Z.number(),
      wins: Z.number(),
      losses: Z.number(),
      winner: Z.boolean()
    }))
  }))
});

export type RawBracket = Z.infer<typeof rawBracketSchema>;

export const rawResultSchema = Z.object({
  _id: Z.string(),
  event_name: Z.string(),
  date: Z.string(),
  event_type: Z.string(),
  decks: Z.array(rawDeckListSchema),
  subheader: Z.string().optional(),
  placement: Z.array(rawPlacementSchema),
  standings: Z.array(rawStandingSchema).optional(),
  brackets: Z.array(rawBracketSchema).optional()
});

export type RawResult = Z.infer<typeof rawResultSchema>;

export const fullResultSchema = Z.object({
  tournament: tournamentSchema,
  deckLists: Z.array(deckSchema),
  standings: Z.array(rawStandingSchema).optional(),
  brackets: Z.array(rawBracketSchema).optional(),
  rawData: Z.string()
});

export type FullResult = Z.infer<typeof fullResultSchema>;
