import "./style.css";
import { AIGame } from "./ai-game";
import { Game } from "./game";
import { loadImages } from "./game-assets";
import { AiPlanReplayer } from "./game-controls/ai-plan-replayer";
import { Input } from "./game-controls/input";
import { CanvasManager } from "./rendering/canvas-manager";
import { GameRenderer } from "./rendering/game-renderer";
import { MenuRenderer } from "./rendering/menu-renderer";
import { registerGameTools, setAiPlanHandler } from "./webmcp";
import { DeviceDetection } from "./rendering/game-detection";
import { TouchControls } from "./game-controls/TouchControls";

const canvas        = document.getElementById('game') as HTMLCanvasElement;
const appContainer  = document.getElementById('app') as HTMLElement;

const canvasManager = new CanvasManager(canvas, appContainer);
const ctx           = canvas.getContext('2d')!;


const images   = await loadImages();
const game     = new Game();
const aiGame   = new AIGame(game, { maxPlanChecksPerLevel: 2 });
const menuRenderer = new MenuRenderer(canvas, game);
const gameRenderer = new GameRenderer(ctx, images);
let showHelpDialog = false;

function redraw(): void {
  gameRenderer.render(game, canvasManager.getTileSize(), showHelpDialog);
  menuRenderer.updateHUD();
}

function startGame(): void {
  showHelpDialog = false;
  game.startLevel(0);
  redraw();
}

function openHelpDialog(): void {
  showHelpDialog = true;
  redraw();
}

function closeHelpDialog(): void {
  showHelpDialog = false;
  redraw();
}

if (DeviceDetection.shouldShowTouchControls()) {
  new TouchControls(
    game,
    startGame,
    redraw,
    () => showHelpDialog,
    closeHelpDialog,
  );
}

new Input(
  game,
  startGame,
  redraw,
  () => showHelpDialog,
  openHelpDialog,
  closeHelpDialog,
);
const aiPlanReplayer = new AiPlanReplayer(game, startGame, redraw);
setAiPlanHandler(plan => aiPlanReplayer.replay(plan));
registerGameTools(() => {
  const state = aiGame.getGameState();
  redraw();
  return state;
}, plan => {
  return aiGame.checkPlan(plan);
});

canvasManager.onResize(() => redraw());
redraw();
