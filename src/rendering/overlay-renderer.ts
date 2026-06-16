import type { Game } from "../game";
import type { GameImages } from "../game-assets";

export class OverlayRenderer {
  private ctx: CanvasRenderingContext2D;
  private images: GameImages;

  constructor(ctx: CanvasRenderingContext2D, images: GameImages) {
    this.ctx = ctx;
    this.images = images;
  }

  drawEndOverlay(game: Game, tileSize: number): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const won = game.phase === "won";
    const isFinalWin = won && !game.hasNextLevel;
    const overlayAlpha = Math.max(0.42, 0.68 - game.daylight.darkness * 0.36);

    ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
    ctx.fillRect(0, 0, w, h);

    const icon = won ? this.images.flag : this.images.p_front;
    const iconSize = tileSize * 2;
    ctx.drawImage(icon, w / 2 - iconSize / 2, h / 2 - 140, iconSize, iconSize);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = won ? "#f1c40f" : "#e74c3c";
    if (isFinalWin) {
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.fillText(
        "Your Orc Warrior reached the tower before dusk.",
        w / 2,
        h / 2 - 18,
      );
      ctx.fillText("You beat the game!", w / 2, h / 2 + 12);
    } else {
      ctx.font = "bold 34px system-ui, sans-serif";
      ctx.fillText(
        won
          ? game.hasNextLevel
            ? "Level Complete!"
            : "You Win!"
          : game.activeActor === "ai" ? "AI Loses!" : "You Lose!",
        w / 2,
        h / 2 - 10,
      );
    }

    ctx.fillStyle = "#fff";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(
      `Moves: ${game.player.moves}/${game.maxMoves}`,
      w / 2,
      h / 2 + (isFinalWin ? 54 : 32),
    );

    ctx.fillStyle = "#d4f7b0";
    ctx.font = "15px system-ui, sans-serif";
    const hint =
      won && game.hasNextLevel
        ? "Enter - next level   |   R - replay"
        : "R - restart";
    ctx.fillText(hint, w / 2, h / 2 + (isFinalWin ? 90 : 68));
  }

  drawHelpDialog(): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const dialogW = Math.min(w - 56, 620);
    const dialogH = 330;
    const x = (w - dialogW) / 2;
    const y = Math.max(24, (h - dialogH) / 2);
    const padding = 28;

    ctx.fillStyle = "rgba(0,0,0,0.48)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(33, 28, 22, 0.96)";
    ctx.fillRect(x, y, dialogW, dialogH);
    ctx.strokeStyle = "rgba(255, 211, 109, 0.72)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, dialogW, dialogH);

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffd36d";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillText("Game Logic", x + padding, y + padding);

    ctx.fillStyle = "#f7ead0";
    ctx.font = "17px system-ui, sans-serif";
    const lines = [
      "Reach the tower before dusk.",
      "Each step spends moves and pushes the day toward sunset.",
      "Walk onto trees to collect wood.",
      "Move into water to build a bridge when you have enough wood.",
      "Building bridges and collecting wood can cost extra moves.",
      "You lose when you run out of moves or have no legal move left.",
    ];

    lines.forEach((line, index) => {
      ctx.fillText(line, x + padding, y + 82 + index * 30);
    });

    ctx.fillStyle = "#d4f7b0";
    ctx.font = "15px system-ui, sans-serif";
    ctx.fillText(
      "Press any key or click to close.",
      x + padding,
      y + dialogH - padding - 18,
    );
  }
}
