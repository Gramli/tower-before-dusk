import type { GameImages } from "../game-assets";
import { GameObject } from "./gameObject";

export class Bridge extends GameObject {
  private static readonly SPRITE_X = 41;
  private static readonly SPRITE_Y = 15;
  private static readonly SPRITE_WIDTH = 398;
  private static readonly SPRITE_HEIGHT = 290;

  constructor(x: number, y: number) {
    super(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    ctx.drawImage(
      images.bridge,
      Bridge.SPRITE_X,
      Bridge.SPRITE_Y,
      Bridge.SPRITE_WIDTH,
      Bridge.SPRITE_HEIGHT,
      this.x * tileSize,
      this.y * tileSize,
      tileSize,
      tileSize,
    );
  }
}
