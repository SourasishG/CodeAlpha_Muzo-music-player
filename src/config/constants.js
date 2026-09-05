/**
 * Repeat modes supported by the player.
 */
export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
};

/**
 * Audio playback lifecycle states.
 */
export const PLAYER_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error',
};

/**
 * Search workflow lifecycle states.
 */
export const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  EMPTY: 'empty',
  ERROR: 'error',
};

/**
 * Default initial player configuration values.
 */
export const DEFAULT_PLAYER_CONFIG = {
  VOLUME: 0.8,
  IS_MUTED: false,
  REPEAT_MODE: REPEAT_MODES.OFF,
  IS_SHUFFLE: false,
};

/**
 * User-facing status and feedback messages.
 */
export const UI_MESSAGES = {
  SEARCH_INITIAL: 'Search for a track, artist, or album to discover music.',
  SEARCH_LOADING: 'Searching the music catalog…',
  SEARCH_EMPTY: 'No tracks, artists, or albums found. Try another search.',
  SEARCH_ERROR: 'Music search is temporarily unavailable. Please try again.',
  PREVIEW_UNAVAILABLE: 'Preview unavailable for this track.',
  PLAYBACK_ERROR: 'Unable to load or play this preview. Try another track or open it on Deezer.',
  QUEUE_EMPTY: 'Your queue is empty. Search for music and add tracks to start listening.',
};

/**
 * Fallback image path when track artwork is missing or fails to load.
 */
export const FALLBACK_TRACK_COVER = '/assets/images/fallback-cover.jpg';