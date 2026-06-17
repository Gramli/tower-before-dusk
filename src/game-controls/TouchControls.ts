import type { Game } from "../game";
import { applyAction, type InputAction } from "./input-action";

const DPAD: Array<{
  action: InputAction;
  label: string;
  ariaLabel: string;
  col: number;
  row: number;
}> = [
  { action: "MoveUp", label: "^", ariaLabel: "Move up", col: 2, row: 1 },
  { action: "MoveLeft", label: "<", ariaLabel: "Move left", col: 1, row: 2 },
  { action: "MoveRight", label: ">", ariaLabel: "Move right", col: 3, row: 2 },
  { action: "MoveDown", label: "v", ariaLabel: "Move down", col: 2, row: 3 },
  { action: "StartOrRestart", label: "R", ariaLabel: "Restart level", col: 1, row: 3 },
];

export class TouchControls {
  private readonly game: Game;
  private readonly onStartGame: () => void;
  private readonly onRedraw: () => void;
  private readonly isHelpDialogVisible: () => boolean;
  private readonly onCloseHelpDialog: () => void;

  constructor(
    game: Game,
    onStartGame: () => void,
    onRedraw: () => void,
    isHelpDialogVisible: () => boolean = () => false,
    onCloseHelpDialog: () => void = () => undefined,
  ) {
    this.game = game;
    this.onStartGame = onStartGame;
    this.onRedraw = onRedraw;
    this.isHelpDialogVisible = isHelpDialogVisible;
    this.onCloseHelpDialog = onCloseHelpDialog;

    const app = document.getElementById("app");
    const canvas = document.getElementById("game");
    if (!app || !canvas) {
      throw new Error("TouchControls requires #app and #game elements.");
    }

    app.appendChild(this.build());
    this.bindCanvasTouch(canvas);
  }

  private bindCanvasTouch(canvas: HTMLElement): void {
    canvas.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;

      e.preventDefault();
      this.dispatch("StartOrNextLevel");
    });
  }

  private build(): HTMLElement {
    const container = document.createElement("div");
    container.id = "touch-controls";

    const grid = document.createElement("div");
    grid.className = "touch-dpad";

    for (const { action, label, ariaLabel, col, row } of DPAD) {
      const btn = this.createButton(label, ariaLabel, action);
      btn.style.gridColumn = String(col);
      btn.style.gridRow = String(row);
      grid.appendChild(btn);
    }

    container.appendChild(grid);

    return container;
  }

  private createButton(
    label: string,
    ariaLabel: string,
    action: InputAction,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "touch-btn";
    btn.textContent = label;
    btn.setAttribute("aria-label", ariaLabel);
    btn.type = "button";

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.dispatch(action);
    });

    return btn;
  }

  private dispatch(action: InputAction): void {
    if (this.isHelpDialogVisible()) {
      this.onCloseHelpDialog();
      return;
    }

    this.game.setActiveActor("player");
    applyAction(action, this.game, this.onStartGame, this.onRedraw);
  }
}
