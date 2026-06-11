import type { Game } from "../game";

export type InputAction =
  | 'MoveUp'
  | 'MoveDown'
  | 'MoveLeft'
  | 'MoveRight'
  | 'BigJump'
  | 'StartOrRestart'
  | 'NextLevel'
  | 'ToggleMusic'
  | 'StartOrNextLevel';

export function applyAction(
  action: InputAction,
  game: Game,
  onStartGame: () => void,
  onRedraw: () => void,
): void {

  switch (game.phase) {
    case 'menu':
      if (action === 'StartOrRestart' || action === 'StartOrNextLevel') onStartGame();
      return;

    case 'won':
      if (action === 'NextLevel' && game.hasNextLevel) {
        game.nextLevel();
        onRedraw();
      } else if (action === 'StartOrRestart') {
        game.restartLevel();
        onRedraw();
      } else if (action === 'StartOrNextLevel') {
        if (game.hasNextLevel) {
          game.nextLevel();
        } else {
          game.restartLevel();
        }
        onRedraw();
      }
      return;

    case 'lost':
      if (action === 'StartOrRestart') {
        game.restartLevel();
        onRedraw();
      }
      return;

    case 'playing':
      switch (action) {
        case 'MoveUp':         game.setDirection('up');    game.handleMove(0, -1); break;
        case 'MoveDown':       game.setDirection('down');  game.handleMove(0, 1);  break;
        case 'MoveLeft':       game.setDirection('left');  game.handleMove(-1, 0); break;
        case 'MoveRight':      game.setDirection('right'); game.handleMove(1, 0);  break;
        case 'StartOrRestart': game.restartLevel();                                        break;
        default: return;
      }
      onRedraw();
      return;
  }
}
