export function dedupe(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
