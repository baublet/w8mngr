// Asserts that day is a valid day string, e.g., YYYYMMDD. Does not validate
// the date itself (yet).
export function assertDayIsValid(day: unknown): asserts day is string {
  if (typeof day !== "string") {
    throw new Error(
      `Invalid day. Not a string: ${day} (${typeof day}). Date string must be YYYYMMDD.`,
    );
  }
  if (!day) {
    throw new Error(
      `Day cannot be a blank string. Date string must be YYYYMMDD.`,
    );
  }
  if (!day.match(/^\d{4}\d{2}\d{2}$/)) {
    throw new Error(`Invalid day: ${day}. Date string must be YYYYMMDD.`);
  }
}
