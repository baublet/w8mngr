export default function dateFromShortDate(shortDate: number | string): Date {
  const shortDateString = `${shortDate}`;

  if (shortDateString.length !== 8) {
    throw new Error(
      `Expected shortDate to be an 8-character string or an 8-digit number. Got instead ${shortDate}`
    );
  }

  return new Date(
    parseInt(shortDateString.substring(0, 4)),
    parseInt(shortDateString.substring(4, 6)) - 1,
    parseInt(shortDateString.substring(6, 8))
  );
}
