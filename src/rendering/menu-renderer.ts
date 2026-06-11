import type { Game } from "../game";

export class MenuRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private game: Game;

  private hudLevel: HTMLElement;
  private hudEggs: HTMLElement;
  private hudJumps: HTMLElement;
  private hudMoves: HTMLElement;
  private hudTime: HTMLElement;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    if (!canvas) {
      throw new Error("MenuRenderer requires a valid canvas element.");
    }

    this.canvas = canvas;
    this.game = game;
    this.ctx = canvas.getContext("2d")!;

    this.hudLevel = document.getElementById("hud-level")!;
    this.hudEggs = document.getElementById("hud-eggs")!;
    this.hudJumps = document.getElementById("hud-jumps")!;
    this.hudMoves = document.getElementById("hud-moves")!;
    this.hudTime = document.getElementById("hud-time")!;

    this.drawBase();
  }

  private drawBase(): void {
    this.ctx.fillStyle = "#1a3a0e";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f1c40f";
    this.ctx.font = "bold 24px system-ui, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "Loading…",
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
  }

  updateHUD(): void {
    if (
      this.game.phase !== "playing" &&
      this.game.phase !== "won" &&
      this.game.phase !== "lost"
    ) {
      this.hudLevel.textContent =
        this.hudEggs.textContent =
        this.hudJumps.textContent =
        this.hudMoves.textContent =
        this.hudTime.textContent =
          "";
      return;
    }
    const mm = Math.floor(this.game.elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (this.game.elapsedSeconds % 60).toString().padStart(2, "0");

    this.hudLevel.textContent = this.game.level.name;
    //this.hudEggs.textContent = `🥚 ${this.game.eggsLeft} left`;
    //this.hudJumps.textContent = `🥕 ×${this.game.player.jumpsLeft}`;
    this.hudMoves.textContent = `Moves: ${this.game.player.moves}`;
    this.hudTime.textContent = `⏱ ${mm}:${ss}`;
  }
}
