import type { Game } from "../game";
import type { GameImages } from "../game-assets";
import { Level } from "../levels/Level";
import { CellType } from "../models/gameState";
import { DeviceDetection } from "./game-detection";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private images: GameImages;
  private rockVariants = new Map<string, HTMLImageElement>();

  constructor(ctx: CanvasRenderingContext2D, images: GameImages) {
    this.ctx = ctx;
    this.images = images;
  }

  render(game: Game, tileSize: number = Level.TILE_SIZE): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    switch (game.phase) {
      case "menu":
        this.drawMenu(tileSize);
        break;
      case "playing":
        this.drawLevel(game, tileSize);
        break;
      case "won":
      case "lost":
        this.drawLevel(game, tileSize);
        this.drawOverlay(game, tileSize);
        break;
    }
  }

  private drawLevel(game: Game, tileSize: number): void {
    this.drawGrid(game, tileSize);
    this.drawObjects(game, tileSize);
    game.player.drawCropped(this.ctx, tileSize, this.images);
  }

  private drawGrid(game: Game, tileSize: number): void {
    const { grid } = game.level;
    const { ctx, images } = this;

    for (let x = 0; x < Level.COLS; x++) {
      for (let y = 0; y < Level.ROWS; y++) {
        const px = x * tileSize;
        const py = y * tileSize;

        switch (grid[x][y]) {
          case CellType.empty:
            ctx.drawImage(images.land, px, py, tileSize, tileSize);
            break;
          case CellType.rock:
            ctx.drawImage(images.land, px, py, tileSize, tileSize);
            ctx.drawImage(this.getRockImage(x, y), px, py, tileSize, tileSize);
            break;
          case CellType.tower:
            ctx.drawImage(images.land, px, py, tileSize, tileSize);
            ctx.drawImage(images.castle, px, py, tileSize, tileSize);
            break;
          case CellType.water:
            ctx.drawImage(images.water, px, py, tileSize, tileSize);
            break;
        }
      }
    }
  }

  private drawObjects(game: Game, tileSize: number): void {
    for (const obj of game.level.objects) {
      obj.draw(this.ctx, tileSize, this.images);
    }
  }

  private getRockImage(x: number, y: number): HTMLImageElement {
    const key = `${x},${y}`;
    const existingVariant = this.rockVariants.get(key);

    if (existingVariant) {
      return existingVariant;
    }

    const rockImages = [this.images.rock, this.images.rock1, this.images.rock2];
    const variantIndex = Math.floor(Math.random() * rockImages.length);
    const rockImage = rockImages[variantIndex];

    this.rockVariants.set(key, rockImage);

    return rockImage;
  }

  private drawMenu(tileSize: number): void {
    const { ctx, images } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const pattern = ctx.createPattern(images.land, "repeat");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = "rgba(0,0,0,0.52)";
    ctx.fillRect(0, 0, w, h);

    const isTouchDevice = DeviceDetection.isTouchDevice();

    this.drawSprites(isTouchDevice, tileSize);
    this.drawGameTitle();

    if (isTouchDevice) {
      this.drawTouchDevicesControls();
    } else {
      this.drawLargeDevicesControls();
    }
  }

  private drawGameTitle(): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 38px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Tower Before Down", w / 2, h / 2 - 90);

    ctx.fillStyle = "#d4f7b0";
    ctx.font = "17px system-ui, sans-serif";
    ctx.fillText(
      "Plan your path · build a bridge · reach the Tower",
      w / 2,
      h / 2 - 52,
    );
  }

  private drawSprites(isTouchDevice: boolean, tileSize: number): void {
    const { ctx, images } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const spriteY = h / 2 - (isTouchDevice ? 150 : 190);
    const spriteSize = tileSize * 1.5;
    const sprites = [
      images.rock,
      images.bridge,
      images.tree,
      images.p_front,
      images.castle,
    ];

    const totalW = sprites.length * spriteSize + (sprites.length - 1) * 8;
    sprites.forEach((img, i) => {
      ctx.drawImage(
        img,
        w / 2 - totalW / 2 + i * (spriteSize + 8),
        spriteY,
        spriteSize,
        spriteSize,
      );
    });
  }

  private drawTouchDevicesControls() {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(w / 2 - 220, h / 2 - 20, 440, 76);

    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#d4f7b0";
    ctx.fillText("Use the on-screen controls to play", w / 2, h / 2);
    ctx.fillText("S — Toggle music", w / 2, h / 2 + 22);

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Tap or R to start", w / 2, h / 2 + 140);
  }

  private drawLargeDevicesControls() {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(w / 2 - 220, h / 2 - 20, 440, 108);

    const controls: [string, string][] = [
      ["← → ↑ ↓", "Move the rabbit"],
      ["Space", "Jump 2 tiles (requires a carrot)"],
      ["R", "Start / Restart"],
      ["S", "Toggle music"],
    ];
    controls.forEach(([key, desc], i) => {
      ctx.font = "14px monospace";
      ctx.fillStyle = "#f1c40f";
      ctx.textAlign = "right";
      ctx.fillText(key, w / 2 - 60, h / 2 + 2 + i * 24);
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(desc, w / 2 -10 , h / 2 +2  + i * 24);
    });

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#d4f7b0";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter or Space to start", w / 2, h / 2 + 140);
  }

  private drawOverlay(game: Game, tileSize: number): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const won = game.phase === "won";

    ctx.fillStyle = "rgba(0,0,0,0.68)";
    ctx.fillRect(0, 0, w, h);

    const icon = won ? this.images.flag : this.images.p_front;
    const iconSize = tileSize * 2;
    ctx.drawImage(icon, w / 2 - iconSize / 2, h / 2 - 110, iconSize, iconSize);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = won ? "#f1c40f" : "#e74c3c";
    ctx.font = "bold 34px system-ui, sans-serif";
    ctx.fillText(
      won
        ? game.hasNextLevel
          ? "Level Complete!"
          : "🎊  You Win!  🎊"
        : "No moves left!",
      w / 2,
      h / 2 - 10,
    );

    const time = this.formatTime(game.elapsedSeconds);
    ctx.fillStyle = "#fff";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(
      `Moves: ${game.player.moves}   |   Time: ${time}`,
      w / 2,
      h / 2 + 32,
    );

    ctx.fillStyle = "#d4f7b0";
    ctx.font = "15px system-ui, sans-serif";
    const hint =
      won && game.hasNextLevel
        ? "Enter — next level   |   R — replay"
        : "R — restart";
    ctx.fillText(hint, w / 2, h / 2 + 68);
  }

  private formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
}
