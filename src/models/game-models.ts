export const CellType = {
  empty: 0,
  rock: 1,
  water: 2,
  tower: 3,
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export type GamePhase = 'menu' | 'playing' | 'won' | 'lost';
export type GameActor = 'player' | 'ai';