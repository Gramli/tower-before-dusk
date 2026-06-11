import type { GameImages } from '../game-assets';
import { GameObject } from './gameObject';

export type Direction = 'right' | 'left' | 'up' | 'down';

type SpriteCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const playerSpriteCrops: Record<Direction, SpriteCrop> = {
  right: { x: 317, y: 148, width: 221, height: 430 },
  left: { x: 302, y: 148, width: 221, height: 430 },
  up: { x: 279, y: 141, width: 282, height: 415 },
  down: { x: 277, y: 135, width: 286, height: 419 },
};

export class Player extends GameObject {
  direction:     Direction = 'right';
  collectedWood: number    = 0;
  moves:         number    = 0;
  cutedTrees:    number    = 0;
  bridgesBuilded: number   = 0;

  constructor(x: number, y: number) {
    super(x, y);
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  draw(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    const sprite: HTMLImageElement = {
      right: images.p_right,
      left:  images.p_left,
      up:    images.p_back,
      down:  images.p_front,
    }[this.direction];

    ctx.drawImage(sprite, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
  }

  drawCropped(ctx: CanvasRenderingContext2D, tileSize: number, images: GameImages): void {
    const sprite: HTMLImageElement = {
      right: images.p_right,
      left:  images.p_left,
      up:    images.p_back,
      down:  images.p_front,
    }[this.direction];
    const crop = playerSpriteCrops[this.direction];
    const drawHeight = tileSize;
    const drawWidth = tileSize * (crop.width / crop.height);
    const drawX = this.x * tileSize + (tileSize - drawWidth) / 2;
    const drawY = this.y * tileSize + tileSize - drawHeight;

    ctx.drawImage(
      sprite,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      drawX,
      drawY,
      drawWidth,
      drawHeight,
    );
  }

  buildBridge(){
    this.collectedWood -=2;
    this.bridgesBuilded++;
  }
}
