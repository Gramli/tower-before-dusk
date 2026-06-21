import { Bridge } from "../game-objects/bridge";
import type { GameObject } from "../game-objects/gameObject";
import { Tree } from "../game-objects/tree";
import { CellType } from "../models/game-models";

type GameObjectConstructor = new (x: number, y: number) => GameObject;

export abstract class Level {
  static readonly COLS = 20;
  static readonly ROWS = 15;
  static readonly TILE_SIZE = 40;

  name: string = "";

  grid: CellType[][];

  objects: GameObject[] = [];
  towers: Array<{ x: number; y: number }> = [];
  maxMoves: number = 40;

  constructor() {
    this.grid = Array.from({ length: Level.COLS }, () =>
      new Array<CellType>(Level.ROWS).fill(CellType.empty),
    );
  }

  abstract setup(): void;

  protected fillColumn(
    x: number,
    startY: number,
    count: number,
    cell: CellType,
  ): void {
    for (let y = startY; y < Level.ROWS && count > 0; y++, count--) {
      this.grid[x][y] = cell;
    }
  }

  protected fillRow(
    startX: number,
    y: number,
    count: number,
    cell: CellType,
  ): void {
    for (let x = startX; x < Level.COLS && count > 0; x++, count--) {
      this.grid[x][y] = cell;
    }
  }

  protected fillSquare(
    startX: number,
    startY: number,
    size: number,
    cell: CellType,
  ): void {
    for (let x = startX; x < Level.COLS && x < startX + size; x++) {
      for (let y = startY; y < Level.ROWS && y < startY + size; y++) {
        this.grid[x][y] = cell;
      }
    }
  }

  protected fillDiagonal(
    startX: number,
    startY: number,
    rightDown: boolean,
    count: number,
    cell: CellType,
  ): void {
    let x = startX;
    for (let y = startY; y < Level.ROWS && count > 0; y++, count--) {
      if (x >= 0 && x < Level.COLS) {
        this.grid[x][y] = cell;
      }
      x += rightDown ? 1 : -1;
    }
  }

  isTower(x: number, y: number): boolean {
    return this.towers.some((d) => d.x === x && d.y === y);
  }

  canBuildBridge(collectedWood: number): boolean {
    return collectedWood >= 2;
  }

  addBridge(x: number, y: number): void {
    this.objects.push(new Bridge(x, y));
  }

  protected addTower(x: number, y: number): void {
    this.grid[x][y] = CellType.tower;
    this.towers.push({ x, y });
  }

  addTree(x: number, y: number): void {
    this.objects.push(new Tree(x, y));
  }

  protected addRowOfObjects(
    objectType: GameObjectConstructor,
    startX: number,
    y: number,
    count: number,
  ): void {
    for (let x = startX; x < Level.COLS && count > 0; x++, count--) {
      this.objects.push(new objectType(x, y));
    }
  }

  protected addColumnsOfObjects(
    objectType: GameObjectConstructor,
    x: number,
    startY: number,
    count: number,
  ): void {
    for (let y = startY; y < Level.ROWS && count > 0; y++, count--) {
      this.objects.push(new objectType(x, y));
    }
  }

  protected addSquareOfObjects(
    objectType: GameObjectConstructor,
    startX: number,
    startY: number,
    size: number,
  ): void {
    for (let x = startX; x < Level.COLS && x < startX + size; x++) {
      for (let y = startY; y < Level.ROWS && y < startY + size; y++) {
        this.objects.push(new objectType(x, y));
      }
    }
  }

  protected addRowOfTrees(startX: number, y: number, count: number): void {
    this.addRowOfObjects(Tree, startX, y, count);
  }

  protected addColumnsOfTrees(x: number, startY: number, count: number): void {
    this.addColumnsOfObjects(Tree, x, startY, count);
  }

  protected addSquareOfTrees(startX: number, startY: number, size: number): void {
    this.addSquareOfObjects(Tree, startX, startY, size);
  }
}
