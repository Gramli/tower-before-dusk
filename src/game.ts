import { GameConstants } from "./game-constants";
import { Bridge } from "./game-objects/bridge";
import { Player, type Direction } from "./game-objects/player";
import { Tree } from "./game-objects/tree";
import { getDaylightState, type DaylightState } from "./game-logic/daylight";
import type { Level } from "./levels/level";
import { Level2 } from "./levels/level2";
import { gameState, type GameState } from "./models/game-state";
import { CellType, type GameActor, type GamePhase } from "./models/game-models";
import { Level1 } from "./levels/level1";
import { Level3 } from "./levels/level3";

const LEVELS: Array<() => Level> = [
  () => new Level1(),
  () => new Level2(),
  () => new Level3(),
];

export class Game {
  phase: GamePhase = 'menu';
  levelIndex:     number = 0;
  level!:         Level;
  player!:        Player;
  activeActor:    GameActor = 'player';

  get usedMoves(): number {
    return this.player?.moves ?? 0;
  }

  get maxMoves(): number {
    return this.level?.maxMoves ?? 1;
  }

  get remainingMoves(): number {
    return Math.max(0, this.maxMoves - this.usedMoves);
  }

  get timeLeft(): number {
    return this.remainingMoves;
  }

  get daylight(): DaylightState {
    return getDaylightState(this.usedMoves, this.maxMoves);
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
    this.activeActor    = 'player';
  }

  restartLevel(): void {
    this.startLevel(this.levelIndex);
  }

  nextLevel(): void {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    }
  }

  setActiveActor(actor: GameActor): void {
    this.activeActor = actor;
  }

  failCurrentAttempt(): void {
    if (this.phase === 'playing') {
      this.phase = 'lost';
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

    let usedMoves = 1;

    if(this.level.grid[nx][ny] === CellType.water && canBuildBridge && !this.hasBridgeAt(nx, ny)){
      this.buildBridge(nx, ny);
      usedMoves++;
    }

    if (this.tryCutDownTree()) {
      usedMoves++;
    }

    this.player.x = nx;
    this.player.y = ny;
    this.player.moves += usedMoves;

    this.checkEndConditions();
  }

  private buildBridge(x: number, y: number) {
    this.level.addBridge(x,y);
    this.player.buildBridge();

  }

  handleCollectWood(): void {
    if (this.phase !== 'playing') return;

    if (this.tryCutDownTree()) {
      this.player.moves++;
      this.checkEndConditions();
    }
  }

  setDirection(direction: Direction): void {
    if (this.phase === 'playing') {
      this.player.setDirection(direction);
    }
  }

  public getGameState(): GameState {
    if (!this.level || !this.player) {
      this.startLevel(this.levelIndex);
    }

    return {
      ...gameState,
      legend: { ...gameState.legend },
      rules: { ...gameState.rules },
      remainingMoves: this.remainingMoves,
      wood: this.player.collectedWood,
      visibleMap: this.getVisibleMap(),
    };
  }

  private getVisibleMap(): string[] {
    return Array.from({ length: GameConstants.MAP_ROWS }, (_, y) =>
      Array.from({ length: GameConstants.MAP_COLS }, (_, x) =>
        this.getMapSymbol(x, y)
      ).join(" ")
    );
  }

  private getMapSymbol(x: number, y: number): string {
    if (this.player.x === x && this.player.y === y) {
      return "P";
    }

    const object = this.level.objects.find(obj => obj.x === x && obj.y === y);
    if (object instanceof Tree) {
      return "W";
    }
    if (object instanceof Bridge) {
      return "B";
    }

    switch (this.level.grid[x][y]) {
      case CellType.water:
        return "~";
      case CellType.tower:
        return "G";
      case CellType.rock:
        return "R";
      case CellType.empty:
      default:
        return ".";
    }
  }

  private canMoveTo(x: number, y: number, canBuildBridge: boolean): boolean {
    if (x < 0 || x >= GameConstants.MAP_COLS || y < 0 || y >= GameConstants.MAP_ROWS) { 
      return false;
    }


    const cell = this.level.grid[x][y];
    return cell !== CellType.rock && (cell !== CellType.water || canBuildBridge || this.hasBridgeAt(x, y));
  }

  private hasBridgeAt(x: number, y: number): boolean {
    return this.level.objects.some(obj => obj instanceof Bridge && obj.x === x && obj.y === y);
  }

  private tryCutDownTree(): boolean {
    const { x, y } = this.player;
    let didCutTree = false;

    this.level.objects = this.level.objects.filter(obj => {
      if (obj.x === x && obj.y === y) {
        if (obj instanceof Tree) {
          this.player.collectedWood++;
          this.player.cutedTrees++;
          didCutTree = true;
          return false;
        }
      }
      return true;
    });

    return didCutTree;
  }

  private checkEndConditions(): void {
    const { x, y } = this.player;

    if (this.level.isTower(x, y) && this.usedMoves <= this.maxMoves) {
      this.phase = 'won';
      return;
    }

    if (!this.hasLegalMove() || this.usedMoves >= this.maxMoves) {
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

}
