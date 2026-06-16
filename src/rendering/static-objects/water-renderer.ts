import type { GameImages } from "../../game-assets";
import { Level } from "../../levels/level";
import { CellType } from "../../models/game-models";

type WaterEdgeSide = "top" | "bottom" | "left" | "right";

export class WaterRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly images: GameImages;
  private readonly edgeImages: Record<WaterEdgeSide, HTMLImageElement[]>;
  private readonly edgeVariants = new Map<string, HTMLImageElement>();

  constructor(
    ctx: CanvasRenderingContext2D,
    images: GameImages,
  ) {
    this.ctx = ctx;
    this.images = images;
    this.edgeImages = {
      top: [images.land_top, images.land_top_1],
      bottom: [images.land_bottom, images.land_bottom_1],
      left: [images.land_left, images.land_left_1],
      right: [images.land_right, images.land_right_1],
    };
  }

  drawWater(
    grid: CellType[][],
    x: number,
    y: number,
    px: number,
    py: number,
    tileSize: number,
  ): void {
    this.ctx.drawImage(this.images.water, px, py, tileSize, tileSize);

    if (!this.isWaterTile(grid, x, y - 1)) {
      this.drawEdge("top", x, y, px, py, tileSize);
    }
    if (!this.isWaterTile(grid, x, y + 1)) {
      this.drawEdge("bottom", x, y, px, py, tileSize);
    }
    if (!this.isWaterTile(grid, x - 1, y)) {
      this.drawEdge("left", x, y, px, py, tileSize);
    }
    if (!this.isWaterTile(grid, x + 1, y)) {
      this.drawEdge("right", x, y, px, py, tileSize);
    }
  }

  private drawEdge(
    side: WaterEdgeSide,
    x: number,
    y: number,
    px: number,
    py: number,
    tileSize: number,
  ): void {
    const image = this.getEdgeVariant(x, y, side);

    this.ctx.drawImage(image, px, py, tileSize, tileSize);
  }

  private getEdgeVariant(
    x: number,
    y: number,
    side: WaterEdgeSide,
  ): HTMLImageElement {
    const key = `${x},${y},${side}`;
    const existingVariant = this.edgeVariants.get(key);

    if (existingVariant) {
      return existingVariant;
    }

    const variants = this.edgeImages[side];
    const variant = variants[Math.floor(Math.random() * variants.length)];

    this.edgeVariants.set(key, variant);

    return variant;
  }

  private isWaterTile(grid: CellType[][], x: number, y: number): boolean {
    if (x < 0 || x >= Level.COLS || y < 0 || y >= Level.ROWS) {
      return false;
    }

    return grid[x][y] === CellType.water;
  }
}
