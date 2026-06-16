import type { GameImages } from "../../game-assets";

type RockVariantName = "rock" | "rock1" | "rock2";

interface RockVariant {
  name: RockVariantName;
  groundImage: HTMLImageElement;
  image: HTMLImageElement;
  bushImage: HTMLImageElement | null;
}

export class RockRenderer {
  private ctx: CanvasRenderingContext2D;
  private rockVariants = new Map<string, RockVariant>();
  private images: GameImages;

  constructor(ctx: CanvasRenderingContext2D, images: GameImages) {
    this.ctx = ctx;
    this.images = images;
  }

  drawRock(x: number, y: number, px: number, py: number, tileSize: number): void {
    const rockVariant = this.getRockVariant(x, y);

    this.ctx.drawImage(rockVariant.groundImage, px, py, tileSize, tileSize);
    this.ctx.drawImage(rockVariant.image, px, py, tileSize, tileSize);

    if (rockVariant.bushImage) {
      this.drawBush(rockVariant.bushImage, px, py, tileSize);
    }
  }

  private getRockVariant(x: number, y: number): RockVariant {
    const key = `${x},${y}`;
    const existingVariant = this.rockVariants.get(key);

    if (existingVariant) {
      return existingVariant;
    }

    const rockVariants: RockVariant[] = [
      {
        name: "rock",
        groundImage: this.getRandomGroundImage(),
        image: this.images.rock,
        bushImage: null,
      },
      {
        name: "rock1",
        groundImage: this.getRandomGroundImage(),
        image: this.images.rock1,
        bushImage: this.getRandomBushImage(),
      },
      {
        name: "rock2",
        groundImage: this.getRandomGroundImage(),
        image: this.images.rock2,
        bushImage: this.getRandomBushImage(),
      },
    ];
    const variantIndex = Math.floor(Math.random() * rockVariants.length);
    const rockVariant = rockVariants[variantIndex];

    this.rockVariants.set(key, rockVariant);

    return rockVariant;
  }

  private getRandomGroundImage(): HTMLImageElement {
    return Math.random() < 0.5 ? this.images.land : this.images.dust;
  }

  private getRandomBushImage(): HTMLImageElement | null {
    if (Math.random() >= 0.6) {
      return null;
    }

    return Math.random() < 0.5 ? this.images.bush : this.images.bush1;
  }

  private drawBush(
    bush: HTMLImageElement,
    px: number,
    py: number,
    tileSize: number,
  ): void {
    const sourceWidth = bush.naturalWidth * 0.82;
    const sourceHeight = bush.naturalHeight * 0.82;
    const sourceX = bush.naturalWidth * 0.09;
    const sourceY = bush.naturalHeight * 0.09;

    const bushWidth = tileSize * 0.56;
    const bushHeight = bushWidth * (sourceHeight / sourceWidth);
    const bushX = px + tileSize * 0.04;
    const bushY = py + tileSize - bushHeight - tileSize * 0.04;

    this.ctx.drawImage(
      bush,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      bushX,
      bushY,
      bushWidth,
      bushHeight,
    );
  }
}
