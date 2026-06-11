export class DeviceDetection {
  static isTouchDevice(): boolean {
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasTouchEvents = "ontouchstart" in window;
    const maxTouchPoints = navigator.maxTouchPoints > 0;
    return hasCoarsePointer || hasTouchEvents || maxTouchPoints;
  }

  private static isSmallScreen(): boolean {
    return window.innerWidth < 768;
  }

  static shouldShowTouchControls(): boolean {
    return this.isTouchDevice() || (!this.isEmbedded() && this.isSmallScreen());
  }

  static isEmbedded(): boolean {
    return window.self !== window.top;
  }
}