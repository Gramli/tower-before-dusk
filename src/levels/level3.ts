import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level3 extends Level {
  constructor() {
    super();
    this.name = 'Level 3';
    this.maxMoves = 28;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(Level.COLS - 1, 1);
    this.addTower(12, 10);
  }

  private setupWalls(): void {
    this.fillColumn(7, 0, Level.ROWS, CellType.water);
    this.fillColumn(8, 0, Level.ROWS-3, CellType.water);
    this.fillRow(2,5, 2, CellType.rock);
    this.fillRow(2,6, 2, CellType.rock);
    this.fillRow(Level.COLS - 2,0, 2, CellType.rock);
    this.fillDiagonal(10, 5, true, 5, CellType.rock);
    this.fillDiagonal(10, 4, true, 6, CellType.rock);
  }

  private addObjects(): void {
    this.addTree(2,  11);
    this.addTree(1,  11);
    this.addTree(0,  11);
    this.addTree(0,  12);
    this.addTree(2,  12);
    this.addTree(1,  12);
    this.addTree(18,  4);
    this.addTree(18,  3);
    this.addTree(18,  2);
    this.addTree(19,  4);
    this.addTree(19,  3);
    this.addTree(19,  2);
    this.addTree(10,  8);
    this.addTree(14,  4);
    this.addTree(14, 11);
    this.addTree(6,  0);
    this.addTree(5, 0);
    this.addTree(6,  1);
    this.addTree(5, 1);
  }
}
