import type { GamePhase } from "./game-models";

export interface GameState {
  phase: GamePhase;
  level: number;
  remainingMoves: number;
  wood: number;
  visibleMap: string[];
}
