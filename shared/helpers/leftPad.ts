export default function leftPad(
  value: string | number,
  length: number = 2,
  padWith: string = "0"
): string {
  const stringValue = `${value}`;
  if (stringValue.length == length) {
    return stringValue;
  }
  const padAmount = length - stringValue.length;
  let newString = "";
  for (let i = 0; i < padAmount; i++) {
    newString += padWith;
  }
  return newString + stringValue;
}
