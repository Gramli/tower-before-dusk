import { Tree } from '../game-objects/tree';
import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level7 extends Level {
  constructor() {
    super();
    this.name = 'Level 7';
    this.maxMoves = 32;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(14, 4);
    this.addTower(6, 12);
    this.addTower(Level.COLS-1, 0);
  }

  private setupWalls(): void {
    this.fillSquare(2,2,5, CellType.rock);
    this.fillSquare(11,2,5, CellType.water);
    this.fillSquare(10,10,5, CellType.rock);
    this.fillSquare(3,10,5, CellType.water);
    this.fillSquare(Level.COLS-3, 0,5, CellType.water);
  }

  private addObjects(): void {
    this.fillEmptyCellsWith(Tree,[{x:0,y:0}, {x:1,y:1}, {x:14,y:1}, {x:10,y:0}, {x:2,y:12}, {x:3,y:9}, {x:4,y:9}]);
  }
}
