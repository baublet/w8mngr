const numeric = "1234567890.,";

export default function splitNumeric(str: string): [number, string] {
  str = str.trim();

  let i;
  for (i = 0; i < str.length; i++) {
    if (!numeric.includes(str[i])) {
      break;
    }
  }

  const numericPart = parseFloat(str.substring(0, i).trim()),
    nonNumericPart = str
      .substring(i)
      .trim()
      .replace(".", "")
      .replace(",", "");

  return [numericPart, nonNumericPart];
}
