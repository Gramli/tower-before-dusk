import type { Game } from "../game";
import { applyAction, type InputAction } from "./input-action";

export class Input {

    private readonly game: Game;
    private readonly onStartGame: () => void;
    private readonly onRedraw: () => void;
    private readonly isHelpDialogVisible: () => boolean;
    private readonly onShowHelpDialog: () => void;
    private readonly onCloseHelpDialog: () => void;

  constructor(
    game: Game,
    onStartGame: () => void,
    onRedraw: () => void,
    isHelpDialogVisible: () => boolean,
    onShowHelpDialog: () => void,
    onCloseHelpDialog: () => void,
  ) {
    window.addEventListener('keydown', (e) => this.handleKey(e));
    window.addEventListener('pointerdown', () => this.handlePointerDown());
    this.game = game;
    this.onStartGame = onStartGame;
    this.onRedraw = onRedraw;
    this.isHelpDialogVisible = isHelpDialogVisible;
    this.onShowHelpDialog = onShowHelpDialog;
    this.onCloseHelpDialog = onCloseHelpDialog;
  }

  private handleKey(e: KeyboardEvent): void {
    if (this.isHelpDialogVisible()) {
      e.preventDefault();
      this.onCloseHelpDialog();
      return;
    }

    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      this.onShowHelpDialog();
      return;
    }

    const action = this.keyToAction(e);
    if (action !== null) {
      e.preventDefault();
      this.game.setActiveActor("player");
      applyAction(action, this.game, this.onStartGame, this.onRedraw);
    }
  }

  private handlePointerDown(): void {
    if (this.isHelpDialogVisible()) {
      this.onCloseHelpDialog();
    }
  }

  private keyToAction(e: KeyboardEvent): InputAction | null {
    const { phase } = this.game;
    switch (e.key) {
      case 'ArrowUp':    return 'MoveUp';
      case 'ArrowDown':  return 'MoveDown';
      case 'ArrowLeft':  return 'MoveLeft';
      case 'ArrowRight': return 'MoveRight';
      case ' ':
        if (phase === 'menu')    return 'StartOrRestart';
        return null;
      case 'Enter':
        if (phase === 'menu') return 'StartOrRestart';
        if (phase === 'won')  return 'NextLevel';
        return null;
      case 'r': case 'R': return 'StartOrRestart';
      default:            return null;
    }
  }
}
