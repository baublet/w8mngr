export function getMovingAverage(
  series: number[],
  { span = 7 }: { span?: number } = {}
): number[] {
  const averages: number[] = series.slice(0);
  const seriesLength = averages.length;

  if (seriesLength < span * 2) {
    return averages;
  }

  for (let i = 0; i < seriesLength; i++) {
    const collectedNumbers = [averages[i]];
    for (let j = 0; j < span; j++) {
      if (averages[i + j]) {
        collectedNumbers.push(averages[i + j]);
        continue;
      }
      if (averages[i - j]) {
        collectedNumbers.push(averages[i - j]);
        continue;
      }
    }

    const total = collectedNumbers.reduce((num, total) => total + num, 0);
    averages[i] = Math.ceil(total / collectedNumbers.length);
  }

  return averages;
}
