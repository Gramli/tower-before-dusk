export interface GameState {
  objective: string;
  legend: IGameLegend;
  rules: IGameRules;
  timeRemainingMinutes: number;
  wood: number;
  visibleMap: string[];
}

export interface IGameLegend {
  P: string;
  W: string;
  "~": string;
  G: string;
}

export interface IGameRules {
  move: string;
  collect_wood: string;
  build_bridge: string;
}

export const CellType = {
  empty: 0,
  rock: 1,
  water: 2,
  tower: 3,
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export const gameState: GameState = {
  objective: "Reach G before sunset.",
  legend: {
    P: "player",
    W: "wood",
    "~": "water",
    G: "goal",
  },
  rules: {
    move: "costs 10 minutes",
    collect_wood: "costs 10 minutes and adds 1 wood",
    build_bridge: "costs 30 minutes and consumes 1 wood",
  },
  timeRemainingMinutes: 90,
  wood: 0,
  visibleMap: [
    "P W ~ G",
  ],
};
