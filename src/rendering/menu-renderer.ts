import type { Game } from "../game";

export class MenuRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private game: Game;

  private hudLevel: HTMLElement;
  private hudWood: HTMLElement;
  private hudWoodCount: HTMLElement;
  private hudMoves: HTMLElement;
  private hudDayLabel: HTMLElement;
  private hudDayRemaining: HTMLElement;
  private hudDayProgress: HTMLElement;
  private gameStage: HTMLElement;
  private daylightOverlay: HTMLElement;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    if (!canvas) {
      throw new Error("MenuRenderer requires a valid canvas element.");
    }

    this.canvas = canvas;
    this.game = game;
    this.ctx = canvas.getContext("2d")!;

    this.hudLevel = document.getElementById("hud-level")!;
    this.hudWood = document.getElementById("hud-wood")!;
    this.hudWoodCount = document.getElementById("hud-wood-count")!;
    this.hudMoves = document.getElementById("hud-moves")!;
    this.hudDayLabel = document.getElementById("hud-day-label")!;
    this.hudDayRemaining = document.getElementById("hud-day-remaining")!;
    this.hudDayProgress = document.getElementById("hud-day-progress")!;
    this.gameStage = document.getElementById("game-stage")!;
    this.daylightOverlay = document.getElementById("daylight-overlay")!;

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
        this.hudWoodCount.textContent =
        this.hudMoves.textContent =
        this.hudDayLabel.textContent =
        this.hudDayRemaining.textContent =
          "";
      this.hudWood.hidden = true;
      this.hudDayProgress.style.width = "0%";
      this.gameStage.style.setProperty("--daylight-brightness", "1");
      this.daylightOverlay.style.opacity = "0";
      return;
    }
    this.hudLevel.textContent = this.game.level.name;
    this.hudWood.hidden = false;
    this.hudWoodCount.textContent = this.game.player.collectedWood.toString();
    this.hudMoves.textContent = `Moves: ${this.game.usedMoves}/${this.game.maxMoves}`;
    this.updateDaylightHUD();
  }

  private updateDaylightHUD(): void {
    const daylight = this.game.daylight;
    const isEndOverlayVisible =
      this.game.phase === "won" || this.game.phase === "lost";
    const brightness = 0.82 + daylight.lightIntensity * 0.18;
    const overlayDarkness = isEndOverlayVisible
      ? daylight.darkness * 0.35
      : daylight.darkness;

    this.hudDayLabel.textContent = daylight.label;
    this.hudDayRemaining.textContent = `${this.game.remainingMoves} moves left`;
    this.hudDayProgress.style.width = `${daylight.progress * 100}%`;
    this.gameStage.style.setProperty(
      "--daylight-brightness",
      (isEndOverlayVisible ? Math.max(brightness, 0.96) : brightness).toString(),
    );
    this.daylightOverlay.style.opacity = overlayDarkness.toString();
  }
}
