import type { Game } from "../game";
import type { GameAction, GamePlan } from "../webmcp";
import { applyAction, type InputAction } from "./input-action";

export class AiPlanReplayer {
  private replayToken = 0;
  private readonly game: Game;
  private readonly startGame: () => void;
  private readonly redraw: () => void;
  private readonly actionDelayMs: number;

  constructor(
    game: Game,
    startGame: () => void,
    redraw: () => void,
    actionDelayMs: number = 350,
  ) {
    this.game = game;
    this.startGame = startGame;
    this.redraw = redraw;
    this.actionDelayMs = actionDelayMs;
  }

  async replay(plan: GamePlan): Promise<void> {
    const token = ++this.replayToken;

    if (this.game.phase === "menu") {
      this.startGame();
    }
    this.game.setActiveActor("ai");

    for (const action of plan.actions) {
      if (token !== this.replayToken || this.game.phase !== "playing") {
        return;
      }

      applyAction(this.toInputAction(action), this.game, this.startGame, this.redraw);
      await this.wait(this.actionDelayMs);
    }

    if (token === this.replayToken && this.game.phase === "playing") {
      this.game.failCurrentAttempt();
      this.redraw();
    }
  }

  private toInputAction(action: GameAction): InputAction {
    switch (action) {
      case "MOVE_UP":
        return "MoveUp";
      case "MOVE_DOWN":
        return "MoveDown";
      case "MOVE_LEFT":
        return "MoveLeft";
      case "MOVE_RIGHT":
        return "MoveRight";
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }
}
