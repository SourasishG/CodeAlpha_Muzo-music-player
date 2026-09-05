/**
 * Converts seconds into a readable "mm:ss" string.
 * Example: 75 seconds -> "01:15"
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');

  return `${paddedMins}:${paddedSecs}`;
}