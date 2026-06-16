import type { Game } from "../game";
import type { GameImages } from "../game-assets";
import { Level } from "../levels/level";
import { CellType } from "../models/game-models";
import { DeviceDetection } from "./game-detection";
import { OverlayRenderer } from "./overlay-renderer";
import { RockRenderer } from "./static-objects/rock-renderer";
import { WaterRenderer } from "./static-objects/water-renderer";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private images: GameImages;
  private overlayRenderer: OverlayRenderer;
  private rockRenderer: RockRenderer;
  private waterRenderer: WaterRenderer;

  constructor(ctx: CanvasRenderingContext2D, images: GameImages) {
    this.ctx = ctx;
    this.images = images;
    this.overlayRenderer = new OverlayRenderer(ctx, images);
    this.rockRenderer = new RockRenderer(ctx, images);
    this.waterRenderer = new WaterRenderer(ctx, images);
  }

  render(
    game: Game,
    tileSize: number = Level.TILE_SIZE,
    showHelpDialog: boolean = false,
  ): void {
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
        this.overlayRenderer.drawEndOverlay(game, tileSize);
        break;
    }

    if (showHelpDialog) {
      this.overlayRenderer.drawHelpDialog();
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
            this.rockRenderer.drawRock(x, y, px, py, tileSize);
            break;
          case CellType.tower:
            ctx.drawImage(images.land, px, py, tileSize, tileSize);
            ctx.drawImage(images.castle, px, py, tileSize, tileSize);
            break;
          case CellType.water:
            this.waterRenderer.drawWater(grid, x, y, px, py, tileSize);
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

  private drawMenu(tileSize: number): void {
    const { ctx, images } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const pattern = ctx.createPattern(images.land, "repeat");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = "rgba(22, 17, 13, 0.58)";
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

    ctx.fillStyle = "#ffd36d";
    ctx.font = "bold 38px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Tower Before Dusk", w / 2, h / 2 - 90);

    ctx.fillStyle = "#f1dfad";
    ctx.font = "17px system-ui, sans-serif";
    ctx.fillText(
      "Guide the orc home before sunset",
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

  private drawTouchDevicesControls(): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "rgba(34, 27, 20, 0.72)";
    ctx.fillRect(w / 2 - 220, h / 2 - 20, 440, 76);

    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#f1dfad";
    ctx.fillText("Use the on-screen controls to play", w / 2, h / 2);
    ctx.fillText("Move into water to build a bridge", w / 2, h / 2 + 22);

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Tap or R to start", w / 2, h / 2 + 140);
  }

  private drawLargeDevicesControls(): void {
    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "rgba(34, 27, 20, 0.72)";
    ctx.fillRect(w / 2 - 220, h / 2 - 20, 440, 108);

    const controls: [string, string, boolean?][] = [
      ["Arrow keys", "Move the orc"],
      ["Water", "Enter to build bridge (needs", true],
      ["R", "Start / Restart"],
      ["H", "Help"],
    ];
    controls.forEach(([key, desc, needsTree], i) => {
      const textX = w / 2 - 10;
      const textY = h / 2 + 2 + i * 24;
      ctx.font = "14px monospace";
      ctx.fillStyle = "#ffd36d";
      ctx.textAlign = "right";
      ctx.fillText(key, w / 2 - 60, textY);
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillStyle = "#f7ead0";
      ctx.textAlign = "left";
      ctx.fillText(desc, textX, textY);

      if (needsTree) {
        const iconSize = 16;
        const iconX = textX + ctx.measureText(desc).width + 5;
        ctx.drawImage(this.images.tree, iconX, textY - iconSize / 2, iconSize, iconSize);
        ctx.fillText(")", iconX + iconSize + 4, textY);
      }
    });

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#f1dfad";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter or Space to start", w / 2, h / 2 + 140);
  }
}
