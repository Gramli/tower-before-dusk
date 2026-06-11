import { GameConstants } from "../game-constants";
import { DeviceDetection } from "./game-detection";

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private appContainer: HTMLElement;
  private currentTileSize: number = GameConstants.TILE_SIZE;
  private resizeObserver: ResizeObserver | null = null;
  private onResizeCallback: (() => void) | null = null;

  private readonly MIN_TILE_SIZE = 24;
  private readonly MAX_TILE_SIZE = 72;
  private readonly CONTROL_WIDTH = 220;
  private readonly CONTROL_HEIGHT = 220;

  constructor(canvas: HTMLCanvasElement, appContainer: HTMLElement) {
    if (!canvas || !appContainer) {
      throw new Error(
        "CanvasManager requires both a canvas element and an app container element.",
      );
    }

    this.appContainer = appContainer;
    this.canvas = canvas;

    this.setupResizeListener();
    this.recalculateSize();
  }

  onResize(callback: () => void): void {
    this.onResizeCallback = callback;
  }

  getTileSize(): number {
    return this.currentTileSize;
  }

  recalculateSize(): void {
    const newTileSize = this.calculateOptimalTileSize();
    const sizeChanged = newTileSize !== this.currentTileSize;
    this.currentTileSize = newTileSize;
    this.applyCanvasSize();
    if (sizeChanged && this.onResizeCallback) {
      this.onResizeCallback();
    }
  }

  private applyCanvasSize(): void {
    const canvasWidth = GameConstants.MAP_COLS * this.currentTileSize;
    const canvasHeight = GameConstants.MAP_ROWS * this.currentTileSize;

    if (this.canvas.width !== canvasWidth) {
      this.canvas.width = canvasWidth;
    }
    if (this.canvas.height !== canvasHeight) {
      this.canvas.height = canvasHeight;
    }

    const hud = document.getElementById("hud");
    if (hud) {
      hud.style.width = DeviceDetection.shouldShowTouchControls()
        ? ""
        : `${canvasWidth}px`;
    }

    this.canvas.style.maxWidth = "100%";
    this.canvas.style.maxHeight = this.isLandscapeTouch()
      ? "calc(100dvh - 44px)"
      : "";
  }

  private calculateOptimalTileSize(): number {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const HUD_H = 30;
    const PAD = 16;

    let availW: number;
    let availH: number;

    if (this.isLandscapeTouch()) {
      availW = vw - this.CONTROL_WIDTH - PAD;
      availH = vh - HUD_H - PAD;
    } else if (DeviceDetection.shouldShowTouchControls()) {
      availW = vw - PAD;
      availH = vh - this.CONTROL_HEIGHT - HUD_H - PAD;
    } else {
      availW = vw - PAD;
      availH = vh - HUD_H - PAD;
    }

    const fromW = Math.floor(availW / GameConstants.MAP_COLS);
    const fromH = Math.floor(availH / GameConstants.MAP_ROWS);
    return Math.max(
      this.MIN_TILE_SIZE,
      Math.min(this.MAX_TILE_SIZE, Math.min(fromW, fromH)),
    );
  }

  private isLandscapeTouch(): boolean {
    return (
      DeviceDetection.shouldShowTouchControls() &&
      window.innerWidth > window.innerHeight
    );
  }

  private setupResizeListener(): void {
    window.addEventListener("resize", () => {
      this.recalculateSize();
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.recalculateSize(), 100);
    });

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.recalculateSize();
      });
      this.resizeObserver.observe(this.appContainer);
    }
  }

  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
