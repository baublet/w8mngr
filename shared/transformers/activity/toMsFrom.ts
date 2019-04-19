import { timeUnits } from "shared/data/units";

export default function toMsFrom(num: number, unit: string): number {
  if (!timeUnits[unit]) {
    return num;
  }
  return Math.floor(timeUnits[unit] * num);
}
