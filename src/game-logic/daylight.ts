export type DaylightLabel =
  | "Morning"
  | "Noon"
  | "Afternoon"
  | "Evening"
  | "Sunset";

export interface DaylightState {
  progress: number;
  lightIntensity: number;
  darkness: number;
  label: DaylightLabel;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getDaylightState(
  usedMoves: number,
  maxMoves: number,
): DaylightState {
  const safeMaxMoves = Math.max(1, maxMoves);
  const progress = clamp(usedMoves / safeMaxMoves, 0, 1);

  const morningLight = 0.7;
  const noonLight = 1;
  const sunsetLight = 0.18;
  const lightIntensity =
    progress <= 0.5
      ? morningLight + (progress / 0.5) * (noonLight - morningLight)
      : noonLight - ((progress - 0.5) / 0.5) * (noonLight - sunsetLight);

  const darknessStart = 0.58;
  const darkness =
    progress <= darknessStart
      ? 0
      : ((progress - darknessStart) / (1 - darknessStart)) * 0.62;

  return {
    progress,
    lightIntensity: clamp(lightIntensity, sunsetLight, noonLight),
    darkness: clamp(darkness, 0, 0.62),
    label: getDaylightLabel(progress),
  };
}

function getDaylightLabel(progress: number): DaylightLabel {
  if (progress < 0.25) return "Morning";
  if (progress < 0.58) return "Noon";
  if (progress < 0.78) return "Afternoon";
  if (progress < 0.95) return "Evening";
  return "Sunset";
}
