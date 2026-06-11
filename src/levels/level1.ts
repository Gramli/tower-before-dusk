import { CellType } from '../models/gameState';
import { Level } from './Level';

export class Level1 extends Level {
  constructor() {
    super();
    this.name = 'Level 1';
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(Level.COLS - 1, Level.ROWS - 1);
  }

  private setupWalls(): void {
    this.fillDiagonal(1, 1, true, Level.ROWS, CellType.rock);
    this.fillDiagonal(Level.COLS - 3, 2, false, Level.ROWS, CellType.rock);
    this.fillDiagonal(2, 1, true, Level.ROWS - 3, CellType.rock);
    this.fillColumn(7, 2, 5, CellType.rock);
    this.grid[0][2] = CellType.rock;
  }

  private addObjects(): void {
    this.addTree(2,  11);
    this.addTree(18,  4);
    this.addTree(10,  8);
    this.addTree(14,  4);
    this.addTree(14, 11);
  }
}
