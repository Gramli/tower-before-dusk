import type { GameImages } from "../game-assets";
import { GameObject } from "./gameObject";

export class Bridge extends GameObject {
  constructor(x: number, y: number) {
    super(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    ctx.drawImage(images.bridge, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
  }
}