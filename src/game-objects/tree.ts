import type { GameImages } from "../game-assets";
import { GameObject } from "./gameObject";

export class Tree extends GameObject {
  constructor(x: number, y: number) {
    super(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    ctx.drawImage(images.tree, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
  }
}