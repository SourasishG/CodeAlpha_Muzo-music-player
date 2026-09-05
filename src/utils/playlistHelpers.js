import { REPEAT_MODES } from '../config/constants';

/**
 * Generates a random track index different from the current one (if possible).
 */
export function getRandomTrackIndex(currentIndex, playlistLength) {
  if (playlistLength <= 1) return currentIndex;

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * playlistLength);
  } while (randomIndex === currentIndex);

  return randomIndex;
}

/**
 * Calculates the next track index based on playlist position, repeat mode, and shuffle status.
 *
 * @returns {number} The next index, or -1 if the playlist has ended (Repeat OFF).
 */
export function getNextTrackIndex({ currentIndex, playlistLength, repeatMode, isShuffle }) {
  if (playlistLength <= 0) return -1;

  // 1. Repeat ONE: Stay on the current track
  if (repeatMode === REPEAT_MODES.ONE) {
    return currentIndex;
  }

  // 2. Shuffle enabled: Pick a random different track
  if (isShuffle && playlistLength > 1) {
    return getRandomTrackIndex(currentIndex, playlistLength);
  }

  // 3. Normal sequential progress
  const nextIndex = currentIndex + 1;

  if (nextIndex < playlistLength) {
    return nextIndex;
  }

  // 4. End of playlist reached: Check Repeat Mode
  if (repeatMode === REPEAT_MODES.ALL) {
    return 0; // Loop back to the first track
  }

  // Repeat OFF: Playback stops
  return -1;
}

/**
 * Calculates the previous track index.
 */
export function getPreviousTrackIndex({ currentIndex, playlistLength, isShuffle }) {
  if (playlistLength <= 0) return -1;

  // 1. Shuffle enabled: Pick a random different track
  if (isShuffle && playlistLength > 1) {
    return getRandomTrackIndex(currentIndex, playlistLength);
  }

  // 2. If at the first track, wrap around to the last track
  if (currentIndex <= 0) {
    return playlistLength - 1;
  }

  // 3. Move back one track
  return currentIndex - 1;
}