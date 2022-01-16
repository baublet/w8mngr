export function weightedClamp({
  setValue,
  max,
  min,
  setMax,
}: {
  setValue: number;
  max: number;
  min: number;
  setMax: number;
}): number {
  //  x     setValue
  // ---- = --------
  //  max    setMax          x * setMax = max * setValue
  //                         x = (max * setValue) / setMax
  return Math.ceil(clamp((max * setValue) / setMax, min, max));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
