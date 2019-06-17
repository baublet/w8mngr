export default function msToTime(ms: number): string {
  const milliseconds = ms % 1000;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (60 * 1000)) % 60);
  const hours = Math.floor((ms / (60 * 1000) / 60) % 60);

  return (
    (hours ? hours + "h" : "") +
    (minutes ? minutes + "m" : "") +
    (seconds ? seconds + "s" : "") +
    (milliseconds ? milliseconds + "ms" : "")
  );
}
