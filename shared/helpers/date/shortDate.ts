import leftPad from "../leftPad";

export default function shortDate(date: Date): number {
  const year = date.getFullYear(),
    month = leftPad(date.getMonth() + 1),
    day = leftPad(date.getDate());

  return parseInt(`${year}${month}${day}`);
}
