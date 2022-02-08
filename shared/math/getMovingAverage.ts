export function getMovingAverage(
  series: number[],
  { span = 7 }: { span?: number } = {}
): number[] {
  const averages: number[] = [];
  const seriesLength = series.length;

  if (seriesLength < span * 5) {
    return averages;
  }

  for (let i = 0; i < seriesLength; i++) {
    const subSeries = series.slice(i, i + span).filter(Boolean);
    if (subSeries.length === 0) {
      continue;
    }
    averages.push(
      subSeries.reduce((total, num) => total + num, 0) / subSeries.length
    );
    i += span - 1;
  }


  return averages;
}
