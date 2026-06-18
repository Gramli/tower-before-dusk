import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level1 extends Level {
  constructor() {
    super();
    this.name = 'Level 1';
    this.maxMoves = 33;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(Level.COLS - 1, Level.ROWS - 1);
  }

  private setupWalls(): void {
    this.fillColumn(7, 2, 5, CellType.rock);
    this.fillColumn(6, 2, 5, CellType.rock);
    this.fillColumn(10,0, 2, CellType.water);
    this.fillColumn(11,0, 2, CellType.water);
    this.fillRow(12,0, 10, CellType.water);
    this.fillColumn(0,8, 2, CellType.water);
  }

  private addObjects(): void {
    this.addTree(1,  1);
    this.addTree(8,  1);
    this.addTree(2,  11);
    this.addTree(1,  11);
    this.addTree(2,  12);
    this.addTree(1,  12);
    this.addTree(18,  4);
    this.addTree(18,  3);
    this.addTree(18,  2);
    this.addTree(10,  8);
    this.addTree(14,  4);
    this.addTree(14, 11);
  }
}
