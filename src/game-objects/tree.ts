import type { GameImages } from "../game-assets";
import { GameObject } from "./gameObject";

type TreeImageName = "tree" | "tree1" | "tree2";

export class Tree extends GameObject {
  private readonly imageName: TreeImageName;

  constructor(x: number, y: number) {
    super(x, y);
    const imageNames: TreeImageName[] = ["tree", "tree1", "tree2"];
    const imageIndex = Math.floor(Math.random() * imageNames.length);

    this.imageName = imageNames[imageIndex];
  }

  draw(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    const treeImage = images[this.imageName];
    const sourceWidth = treeImage.naturalWidth * 0.96;
    const sourceHeight = treeImage.naturalHeight * 0.96;
    const sourceX = (treeImage.naturalWidth - sourceWidth) / 2;
    const sourceY = treeImage.naturalHeight - sourceHeight;

    ctx.drawImage(
      treeImage,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      this.x * tileSize,
      this.y * tileSize,
      tileSize,
      tileSize,
    );
  }
}
