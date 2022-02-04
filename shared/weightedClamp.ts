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
  const oldRange = setMax - min;
  const newRange = max - min;
  const newValue = ((setValue - min) * newRange) / oldRange + min;

  return newValue;
}
