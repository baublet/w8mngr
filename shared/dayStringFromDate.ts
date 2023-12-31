import { leftPad } from "./leftPad.js";

export function dayStringFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = leftPad(date.getMonth() + 1, "0", 2);
  const day = leftPad(date.getDate(), "0", 2);
  return `${year}${month}${day}`;
}
