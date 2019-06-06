const numeric = "1234567890.,";

export default function splitNumeric(str: string): Array<number | string> {
  str = str.trim();

  const parts: Array<number | string> = [];

  if (!str.length) {
    return [0, ""];
  }

  let i: number = 0;
  let accumulator: string = "";
  let lastCharNumeric: boolean = true;
  while (i < str.length) {
    if (numeric.includes(str[i])) {
      if (lastCharNumeric) {
        accumulator += str[i];
      } else {
        parts.push(accumulator.trim());
        lastCharNumeric = true;
        accumulator = str[i];
      }
    } else {
      if (lastCharNumeric) {
        parts.push(parseFloat(accumulator.substring(0, i).trim()) || 0);
        lastCharNumeric = false;
        accumulator = str[i];
      } else {
        accumulator += str[i];
      }
    }
    i++;
  }

  if (lastCharNumeric) {
    parts.push(parseFloat(accumulator.substring(0, i).trim()) || 0);
  } else {
    parts.push(accumulator.trim());
  }

  return parts;
}
