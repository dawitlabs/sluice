export function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function formatClock(date: Date): string {
  return date.toISOString().slice(11, 19);
}

export function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
