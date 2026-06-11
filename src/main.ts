import { Game } from "./game";
import { loadImages } from "./game-assets";
import { Input } from "./game-controls/Input";
import { CanvasManager } from "./rendering/canvas-manager";
import { GameRenderer } from "./rendering/game-renderer";
import { MenuRenderer } from "./rendering/menu-renderer";
import { registerCounterTool } from "./webmcp";

const canvas        = document.getElementById('game') as HTMLCanvasElement;
const appContainer  = document.getElementById('app') as HTMLElement;

const canvasManager = new CanvasManager(canvas, appContainer);
const ctx           = canvas.getContext('2d')!;


const images   = await loadImages();
const game     = new Game();
const menuRenderer = new MenuRenderer(canvas, game);
const gameRenderer = new GameRenderer(ctx, images);

function redraw(): void {
  gameRenderer.render(game, canvasManager.getTileSize());
  menuRenderer.updateHUD();
}

function startGame(): void {
  game.startLevel(0);
  redraw();
}

new Input(game, startGame, redraw);

canvasManager.onResize(() => redraw());
window.setInterval(redraw, 1000); 
redraw();

//registerCounterTool();