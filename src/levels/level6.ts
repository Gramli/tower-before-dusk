import { Tree } from '../game-objects/tree';
import { CellType } from '../models/game-models';
import { Level } from './level';

export class Level6 extends Level {
  constructor() {
    super();
    this.name = 'Level 6';
    this.maxMoves = 32;
  }

  setup(): void {
    this.setupWalls();
    this.addObjects();
    this.addTower(14, 5);
    this.addTower(5, 2);
    this.addTower(5, 11);
    this.addTower(6, Level.ROWS-1);
  }

  private setupWalls(): void {
    this.fillRow(1,1, 8, CellType.rock);
    this.fillRow(1,2, 4, CellType.rock);
    this.fillColumn(7, 1, Level.ROWS-2, CellType.rock);
    this.fillColumn(4, 3, 3, CellType.rock);
    this.fillColumn(6, 1, Level.ROWS-2, CellType.rock);
    this.fillColumn(10,0, Level.ROWS, CellType.water);
    this.fillColumn(11,0, Level.ROWS, CellType.water);
    this.fillRow(12,0, 10, CellType.water);
    this.fillColumn(0,2, Level.ROWS -2, CellType.water);
    this.fillRow(12,1, 4, CellType.rock);
    this.fillRow(12,2, 6, CellType.rock);
    this.fillRow(2,9, 4, CellType.rock);
    this.fillRow(2,10, 4, CellType.rock);
    this.fillColumn(4,11, 4, CellType.water);
    this.fillColumn(5,11, 4, CellType.water);
    this.fillSquare(12,6,3, CellType.rock);
  }

  private addObjects(): void {
    this.addTree(14,  3);
    this.addTree(14,  4);
    this.addTree(15,  4);
    this.addTree(12,  3);
    this.addTree(12,  4);
    this.addTree(13,  3);
    this.addTree(13,  4);
    this.addTree(9,  1);
    this.addTree(0,  1);
    this.addRowOfTrees(1,0,9);
    this.addRowOfTrees(2,8,3);
    this.addColumnsOfTrees(5,3, 4);
    this.addColumnsOfTrees(2,3, 4);
    this.addColumnsOfTrees(3,3, 4);
    this.addRowOfTrees(1,11,3);
    this.addRowOfTrees(1,12,3);
    this.addRowOfTrees(1,13,3);
    this.addTree(18,  4);
    this.addTree(18,  3);
    this.addTree(18,  2);
    this.addTree(10,  8);
    this.addTree(14, 11);
    this.addColumnsOfTrees(8,2, Level.ROWS-2);
    this.addColumnsOfTrees(9,4, Level.ROWS-2);
    this.addSquareOfObjects(Tree,12,9,8);
    this.addSquareOfObjects(Tree,17,6,3);
  }
}
