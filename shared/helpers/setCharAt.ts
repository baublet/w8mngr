export default function setCharAt(
  originalString: string,
  index: number,
  char: string
): string {
  if (index > originalString.length - 1) return originalString;
  return (
    originalString.substr(0, index) + char + originalString.substr(index + 1)
  );
}
