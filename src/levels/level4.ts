import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level4 extends Level {
  constructor() {
    super();
    this.name = 'Level 4';
    this.maxMoves = 29;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(Level.COLS - 1, 1);
    this.addTower(12, 8);
    this.addTower(10, Level.ROWS-1);
  }

  private setupWalls(): void {
    this.fillColumn(7, 0, Level.ROWS, CellType.water);
    this.fillColumn(8, 0, Level.ROWS, CellType.water);
    this.fillColumn(9, 6, Level.ROWS, CellType.water);
    this.fillColumn(9, 0, 3, CellType.water);
    this.fillColumn(10, 1, 5, CellType.rock);
    this.fillColumn(4,0, 2, CellType.rock);
    this.fillColumn(4,3, 2, CellType.rock);
    this.fillRow(2,5, 2, CellType.rock);
    this.fillRow(2,6, 2, CellType.rock);
    this.fillRow(Level.COLS - 2,0, 2, CellType.rock);
    this.fillDiagonal(10, 5, true, 5, CellType.rock);
    this.fillDiagonal(10, 4, true, 6, CellType.rock);
    this.fillDiagonal(18, 5, false, 5, CellType.rock);
    this.fillColumn(14, 4,2, CellType.water);
    this.fillColumn(15, 4,2, CellType.water);
    this.fillRow(3, 11, 3, CellType.rock);
    this.fillRow(4, 12, 3, CellType.rock);
  }

  private addObjects(): void {
    this.addRowOfTrees(13,3, 5);
    this.addRowOfTrees(13,6, 3);
    this.addTree(2,  11);
    this.addTree(1,  11);
    this.addTree(0,  11);
    this.addTree(0,  12);
    this.addRowOfTrees(0,10, 7);
    this.addRowOfTrees(0,9, 7);
    this.addRowOfTrees(0,8, 7);
    this.addTree(2,  12);
    this.addTree(1,  12);
    this.addRowOfTrees(2,18, 3);
    this.addRowOfTrees(2,19, 3);
    this.addRowOfTrees(0,2, 7);
    this.addTree(10,  8);
    this.addRowOfTrees(13, 11,5);
    this.addRowOfTrees(13, 12,5);
    this.addRowOfTrees(13, 13,5);
    this.addTree(6,  0);
    this.addTree(5, 0);
    this.addTree(6,  1);
    this.addTree(5, 1);
  }
}
