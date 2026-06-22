import { Tree } from '../game-objects/tree';
import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level8 extends Level {
  constructor() {
    super();
    this.name = 'Level 8';
    this.maxMoves = 26;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(15, 5);
    this.addTower(5, 11);
    this.addTower(11, 11);
  }

  private setupWalls(): void {
    this.fillSquare(2,2,10, CellType.water);
    this.fillSquare(2,12,10, CellType.water);
    this.fillSquare(13,2,10, CellType.water);
    this.fillColumn(0,1,9, CellType.rock);
  }

  private addObjects(): void {
    this.addRowOfObjects(Tree, 2,0, Level.COLS);
    this.addColumnsOfObjects(Tree,12,5,4);
    this.addSquareOfObjects(Tree,0,10,4);
  }
}
