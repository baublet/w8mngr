import shortDate from "./shortDate";
import dateFromShortDate from "./dateFromShortDate";

export default function yesterday(date?: number | Date): number {
  if (!date) {
    date = new Date();
  }
  if (!(date instanceof Date)) {
    date = dateFromShortDate(date);
  } else {
    date = new Date(date.getTime());
  }
  date.setDate(date.getDate() - 1);
  return shortDate(date);
}
