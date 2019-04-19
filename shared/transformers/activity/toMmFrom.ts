import { distanceUnits } from "shared/data/units";

export default function toMmFrom(num: number, unit: string): number {
  if (!distanceUnits[unit]) {
    return num;
  }
  return Math.floor(distanceUnits[unit] * num);
}
