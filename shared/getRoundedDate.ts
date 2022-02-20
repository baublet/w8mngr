/**
 * Given a date, returns date rounded to the nearest interval and interval
 * amount.
 *
 * When rounding by hours, when intervalAmount is 1:
 * 12:30 -> 12:00; 12:31 -> 1:00
 *
 * When interval amount is 2:
 * 12:30 -> 12; 1:30 -> 2:00
 *
 * The same is true of seconds, minutes, hours, and days.
 */
export function getRoundedDate({
  date = new Date(),
  interval,
  intervalAmount = 1,
}: {
  date?: Date;
  intervalAmount?: number;
  interval: "seconds" | "minutes" | "hours" | "days";
}) {
  if (intervalAmount < 1) {
    throw new Error("You cannot round to zero or less than zero.");
  }

  const clonedDate = new Date(date.getTime());

  if (interval === "days") {
    const day = date.getDate();
    const remainder = day % intervalAmount;
    const roundedDay = remainder === 0 ? day : day - remainder;
    clonedDate.setDate(roundedDay);
    clonedDate.setHours(0, 0, 0, 0);
    return clonedDate;
  }

  if (interval === "hours") {
    const hour = date.getHours();
    const remainder = hour % intervalAmount;
    const roundedHour = remainder === 0 ? hour : hour - remainder;
    clonedDate.setHours(roundedHour);
    clonedDate.setMinutes(0, 0, 0);
    return clonedDate;
  }

  if (interval === "minutes") {
    const minute = date.getMinutes();
    const remainder = minute % intervalAmount;
    const roundedMinute = remainder === 0 ? minute : minute - remainder;
    clonedDate.setMinutes(roundedMinute);
    clonedDate.setSeconds(0, 0);
    return clonedDate;
  }

  if (interval === "seconds") {
    const second = date.getSeconds();
    const remainder = second % intervalAmount;
    const roundedSecond = remainder === 0 ? second : second - remainder;
    clonedDate.setSeconds(roundedSecond);
    return clonedDate;
  }

  return clonedDate;
}
