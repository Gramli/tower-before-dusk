export type GameAction =
  | "MOVE_UP"
  | "MOVE_DOWN"
  | "MOVE_LEFT"
  | "MOVE_RIGHT";

export type GamePlan = {
  actions: GameAction[];
};

export type PlanCheckResult = {
  valid: boolean;
  reachedGoal: boolean;
  limitReached: boolean;
  checksRemaining: number;
  finalPosition: { x: number; y: number };
  remainingMoves: number;
  reason: string;
};
