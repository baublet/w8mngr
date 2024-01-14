export function leftPad(
  subject: string | number,
  pad: string,
  desiredLength: number,
): string {
  let newSubject = `${subject}`;
  while (newSubject.length < desiredLength) {
    newSubject = pad + newSubject;
  }
  return newSubject;
}
