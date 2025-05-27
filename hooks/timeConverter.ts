export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [secondsInUnit, unit] of intervals) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}