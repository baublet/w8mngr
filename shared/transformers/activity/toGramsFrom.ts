import { massUnits } from "shared/data/units";

export default function toGramsFrom(num: number, unit: string): number {
  if (!massUnits[unit]) {
    return num;
  }
  return Math.floor(massUnits[unit] * num);
}
