import { GameConstants } from "./game-constants";
import { Player, type Direction } from "./game-objects/player";
import { Tree } from "./game-objects/tree";
import { Level } from "./levels/Level";
import { Level1 } from "./levels/level1";
import { CellType, gameState, type GameState } from "./models/gameState";

export type GamePhase = 'menu' | 'playing' | 'won' | 'lost';

const LEVELS: Array<() => Level> = [
  () => new Level1(),
];

export class Game {
  phase: GamePhase = 'menu';
  levelIndex:     number = 0;
  level!:         Level;
  player!:        Player;
  elapsedSeconds: number = 0;

  private timerHandle: number | null = null;

  get timeLeft(): number {
    return this.level.dayTime - 
    (this.player.moves * this.level.stepTakenTime + 
      this.player.cutedTrees * this.level.cutDownTreeTakenTime +
      this.player.bridgesBuilded * this.level.buildBridgeTakenTime);
  }

  get hasNextLevel(): boolean {
    return this.levelIndex + 1 < LEVELS.length;
  }

  startLevel(index: number): void {
    this.levelIndex = index;
    this.level      = LEVELS[index]();
    this.level.setup();

    this.player         = new Player(0, 0);
    this.phase          = 'playing';
    this.elapsedSeconds = 0;

    this.stopTimer();
    this.timerHandle = window.setInterval(() => {
      if (this.phase === 'playing') this.elapsedSeconds++;
    }, 1000);
  }

  restartLevel(): void {
    this.startLevel(this.levelIndex);
  }

  nextLevel(): void {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    }
  }

  handleMove(dx: number, dy: number): void {
    if (this.phase !== 'playing') return;

    const { x, y, collectedWood } = this.player;
    const canBuildBridge = this.level.canBuildBridge(collectedWood);

    const nx = x + dx;
    const ny = y + dy;
    if (!this.canMoveTo(nx, ny, canBuildBridge)){
       return;
    }

    if(this.level.grid[nx][ny] === CellType.water && canBuildBridge){
      this.buildBridge(nx, ny);
    }

    this.tryCutDownTree();

    this.player.x = nx;
    this.player.y = ny;
    this.player.moves++;

    this.checkEndConditions();
  }


  private buildBridge(x: number, y: number) {
    this.level.addBridge(x,y);
    this.player.buildBridge();

  }

  setDirection(direction: Direction): void {
    if (this.phase === 'playing') {
      this.player.setDirection(direction);
    }
  }

  public getAIState(): GameState {
    return {
      ...gameState,
      legend: { ...gameState.legend },
      rules: { ...gameState.rules },
      visibleMap: [...gameState.visibleMap],
    };
  }

  private canMoveTo(x: number, y: number, canBuildBridge: boolean): boolean {
    if (x < 0 || x >= GameConstants.MAP_COLS || y < 0 || y >= GameConstants.MAP_ROWS) { 
      return false;
    }


    const cell = this.level.grid[x][y];
    return cell !== CellType.rock && (cell !== CellType.water || canBuildBridge);
  }

  private tryCutDownTree(): void {
    const { x, y } = this.player;
    this.level.objects = this.level.objects.filter(obj => {
      if (obj.x === x && obj.y === y) {
        if (obj instanceof Tree) {
          this.player.collectedWood++;
          this.player.cutedTrees++;
          return false;
        }
      }
      return true;
    });
  }

  private checkEndConditions(): void {
    const { x, y } = this.player;

    if (this.level.isTower(x, y) && this.timeLeft > 0) {
      this.stopTimer();
      this.phase = 'won';
      return;
    }

    if (!this.hasLegalMove() || this.timeLeft === 0) {
      this.stopTimer();
      this.phase = 'lost';
    }
  }

  private hasLegalMove(): boolean {
    const { x, y, collectedWood } = this.player;
    const canBuildBridge = this.level.canBuildBridge(collectedWood);
    const steps = [1];

    for (const step of steps) {
      if (this.canMoveTo(x + step, y, canBuildBridge)) return true;
      if (this.canMoveTo(x - step, y, canBuildBridge)) return true;
      if (this.canMoveTo(x, y + step, canBuildBridge)) return true;
      if (this.canMoveTo(x, y - step, canBuildBridge)) return true;
    }
    return false;
  }

  private stopTimer(): void {
    if (this.timerHandle !== null) {
      window.clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}
