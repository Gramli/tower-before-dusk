import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level5 extends Level {
  constructor() {
    super();
    this.name = 'Level 5';
    this.maxMoves = 28;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(Level.COLS - 5, Level.ROWS - 1);
    this.addTower(16, 4);
    this.addTower(9, 10);
  }

  private setupWalls(): void {
    this.fillColumn(7, 2, 5, CellType.rock);
    this.fillColumn(6, 2, 5, CellType.rock);
    this.fillColumn(8, 2, 4, CellType.rock);
    this.fillColumn(10,0, Level.COLS, CellType.water);
    this.fillColumn(11,0, Level.ROWS -2, CellType.water);
    this.fillRow(12,0, 10, CellType.water);
    this.fillRow(0,8, Level.COLS, CellType.water);
    this.fillColumn(15, 1, 4, CellType.rock);
    this.fillColumn(16, 1, 3, CellType.rock);
    this.grid[9][9] = CellType.rock;
    this.fillColumn(8, 10, 2, CellType.rock);
    this.fillColumn(Level.COLS-2, Level.ROWS-2, 2, CellType.rock);
    this.fillColumn(Level.COLS-4, Level.ROWS-4, 2, CellType.rock);
  }

  private addObjects(): void {
    this.addRowOfTrees(2,5, 3);
    this.addRowOfTrees(3,6, 3);
    this.addRowOfTrees(1,9, 8);
    this.addRowOfTrees(1,10, 7);
    this.addRowOfTrees(5,0, 5);
    this.addRowOfTrees(5,1, 3);
    this.addTree(9,  1);
    this.addTree(8,  12);
    this.addRowOfTrees(0,Level.ROWS-1, 10);
    this.addTree(2,  11);
    this.addTree(1,  11);
    this.addTree(2,  12);
    this.addTree(1,  12);
    this.addTree(18,  4);
    this.addTree(18,  3);
    this.addTree(18,  2);
    this.addRowOfTrees(17,11, 3);
    this.addRowOfTrees(13,12, 3);
    this.addRowOfTrees(12,1, 3);
    this.addRowOfTrees(13,2, 2);
    this.addRowOfTrees(13,3, 2);
    this.addRowOfTrees(13,4, 2);
    this.addTree(14, 11);
  }
}
