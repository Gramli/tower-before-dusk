import { GameConstants } from "./game-constants";
import { Bridge } from "./game-objects/bridge";
import type { Player } from "./game-objects/player";
import { Tree } from "./game-objects/tree";
import type { Game } from "./game";
import type { GameState } from "./models/game-state";
import { CellType } from "./models/game-models";
import type { GameAction, GamePlan, PlanCheckResult } from "./models/ai-plan";

export type AIGameOptions = {
  maxPlanChecksPerLevel?: number;
};

type PlanSimulationState = {
  x: number;
  y: number;
  usedMoves: number;
  wood: number;
  treePositions: Set<string>;
  bridgePositions: Set<string>;
};

export class AIGame {
  private readonly game: Game;
  private readonly maxPlanChecksPerLevel: number;
  private checkedPlayer: Player | null = null;
  private planCheckCount = 0;

  constructor(game: Game, options: AIGameOptions = {}) {
    this.game = game;
    this.maxPlanChecksPerLevel = options.maxPlanChecksPerLevel ?? 1;

    if (
      !Number.isInteger(this.maxPlanChecksPerLevel) ||
      this.maxPlanChecksPerLevel < 0
    ) {
      throw new RangeError("maxPlanChecksPerLevel must be a non-negative integer.");
    }
  }

  getGameState(): GameState {
    this.ensureLevelStarted();

    return {
      remainingMoves: this.game.remainingMoves,
      wood: this.game.player.collectedWood,
      visibleMap: this.getVisibleMap(),
    };
  }

  checkPlan(plan: GamePlan): PlanCheckResult {
    const player = this.ensureLevelStarted();
    this.resetPlanCheckForNewAttempt(player);
    if (this.planCheckCount >= this.maxPlanChecksPerLevel) {
      return this.createLimitReachedResult(
        player,
        "No checkPlan calls remain for this attempt. Submit your final plan now; do not call checkPlan again.",
      );
    }
    this.planCheckCount++;

    return this.simulatePlan(plan, player);
  }

  private simulatePlan(plan: GamePlan, player: Player): PlanCheckResult {
    const state = this.createSimulationState(player);

    for (const action of plan.actions) {
      const result = this.simulateAction(state, action);
      if (result) {
        return result;
      }
    }

    return this.createCheckResult(state, false, false, "Plan ended before reaching G.");
  }

  private createSimulationState(player: Player): PlanSimulationState {
    return {
      x: player.x,
      y: player.y,
      usedMoves: player.moves,
      wood: player.collectedWood,
      treePositions: new Set(
        this.game.level.objects
          .filter(object => object instanceof Tree)
          .map(object => this.positionKey(object.x, object.y)),
      ),
      bridgePositions: new Set(
        this.game.level.objects
          .filter(object => object instanceof Bridge)
          .map(object => this.positionKey(object.x, object.y)),
      ),
    };
  }

  private simulateAction(
    state: PlanSimulationState,
    action: GameAction,
  ): PlanCheckResult | null {
    const move = this.getActionDelta(action);
    if (!move) {
      return this.createCheckResult(state, false, false, `Unknown action: ${String(action)}.`);
    }

    const nx = state.x + move.dx;
    const ny = state.y + move.dy;
    const canBuildBridge = this.game.level.canBuildBridge(state.wood);
    const destinationKey = this.positionKey(nx, ny);

    if (!this.canMoveTo(nx, ny, canBuildBridge, state.bridgePositions)) {
      return this.createCheckResult(
        state,
        false,
        false,
        `${action} is blocked at (${nx}, ${ny}).`,
      );
    }

    let moveCost = 1;
    if (
      this.game.level.grid[nx][ny] === CellType.water &&
      canBuildBridge &&
      !state.bridgePositions.has(destinationKey)
    ) {
      state.bridgePositions.add(destinationKey);
      state.wood -= 2;
      moveCost++;
    }

    state.x = nx;
    state.y = ny;

    if (state.treePositions.delete(destinationKey)) {
      state.wood++;
      moveCost++;
    }

    state.usedMoves += moveCost;
    return this.evaluateSimulationState(state);
  }

  private evaluateSimulationState(state: PlanSimulationState): PlanCheckResult | null {
    if (this.game.level.isTower(state.x, state.y) && state.usedMoves <= this.game.maxMoves) {
      return this.createCheckResult(state, true, true, "Plan reaches G.");
    }

    if (state.usedMoves >= this.game.maxMoves) {
      return this.createCheckResult(
        state,
        false,
        false,
        "Move budget exhausted before reaching G.",
      );
    }

    if (!this.hasLegalMove(state.x, state.y, state.wood, state.bridgePositions)) {
      return this.createCheckResult(
        state,
        false,
        false,
        "No legal move remains before reaching G.",
      );
    }

    return null;
  }

  private createCheckResult(
    state: PlanSimulationState,
    valid: boolean,
    reachedGoal: boolean,
    reason: string,
  ): PlanCheckResult {
    return {
      valid,
      reachedGoal,
      limitReached: this.checksRemaining === 0,
      checksRemaining: this.checksRemaining,
      finalPosition: { x: state.x, y: state.y },
      remainingMoves: Math.max(0, this.game.maxMoves - state.usedMoves),
      reason,
    };
  }

  private createLimitReachedResult(player: Player, reason: string): PlanCheckResult {
    return {
      valid: false,
      reachedGoal: false,
      limitReached: true,
      checksRemaining: 0,
      finalPosition: { x: player.x, y: player.y },
      remainingMoves: this.game.remainingMoves,
      reason,
    };
  }

  private ensureLevelStarted(): Player {
    if (!this.game.level || !this.game.player) {
      this.game.startLevel(this.game.levelIndex);
    } else if (this.game.phase === "lost") {
      this.game.restartLevel();
    }
    return this.game.player;
  }

  private resetPlanCheckForNewAttempt(player: Player): void {
    if (this.checkedPlayer !== player) {
      this.checkedPlayer = player;
      this.planCheckCount = 0;
    }
  }

  private get checksRemaining(): number {
    return Math.max(0, this.maxPlanChecksPerLevel - this.planCheckCount);
  }

  private getVisibleMap(): string[] {
    return Array.from({ length: GameConstants.MAP_ROWS }, (_, y) =>
      Array.from({ length: GameConstants.MAP_COLS }, (_, x) =>
        this.getMapSymbol(x, y),
      ).join(" "),
    );
  }

  private getMapSymbol(x: number, y: number): string {
    if (this.game.player.x === x && this.game.player.y === y) {
      return "P";
    }

    const object = this.game.level.objects.find(object => object.x === x && object.y === y);
    if (object instanceof Tree) {
      return "W";
    }
    if (object instanceof Bridge) {
      return "B";
    }

    switch (this.game.level.grid[x][y]) {
      case CellType.water:
        return "~";
      case CellType.tower:
        return "G";
      case CellType.rock:
        return "R";
      case CellType.empty:
      default:
        return ".";
    }
  }

  private getActionDelta(action: GameAction): { dx: number; dy: number } | null {
    switch (action) {
      case "MOVE_UP":
        return { dx: 0, dy: -1 };
      case "MOVE_DOWN":
        return { dx: 0, dy: 1 };
      case "MOVE_LEFT":
        return { dx: -1, dy: 0 };
      case "MOVE_RIGHT":
        return { dx: 1, dy: 0 };
      default:
        return null;
    }
  }

  private canMoveTo(
    x: number,
    y: number,
    canBuildBridge: boolean,
    bridgePositions: ReadonlySet<string>,
  ): boolean {
    if (x < 0 || x >= GameConstants.MAP_COLS || y < 0 || y >= GameConstants.MAP_ROWS) {
      return false;
    }

    const cell = this.game.level.grid[x][y];
    return (
      cell !== CellType.rock &&
      (cell !== CellType.water || canBuildBridge || bridgePositions.has(this.positionKey(x, y)))
    );
  }

  private hasLegalMove(
    x: number,
    y: number,
    wood: number,
    bridgePositions: ReadonlySet<string>,
  ): boolean {
    const canBuildBridge = this.game.level.canBuildBridge(wood);
    return [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ].some(move =>
      this.canMoveTo(x + move.dx, y + move.dy, canBuildBridge, bridgePositions),
    );
  }

  private positionKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}
