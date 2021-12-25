export function doTimes(times: number, fn: () => any): void {
  for (let i = 0; i < times; i++) {
    fn();
  }
}
