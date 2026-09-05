import { FALLBACK_TRACK_COVER } from '../config/constants';

/**
 * Normalizes a single raw Deezer track item into the application's internal Track model.
 *
 * Internal Track Model Shape:
 * {
 *   id: string,
 *   title: string,
 *   artist: string,
 *   artistId: string | number | null,
 *   album: string,
 *   albumId: string | number | null,
 *   duration: number,
 *   cover: string,
 *   previewUrl: string | null,
 *   externalUrl: string | null,
 *   source: 'deezer'
 * }
 *
 * @param {Object} rawTrack - Raw track item from Deezer API response.
 * @returns {Object|null} Normalized track object, or null if input is invalid.
 */
export function mapDeezerTrackToTrack(rawTrack) {
  if (!rawTrack || typeof rawTrack !== 'object') {
    return null;
  }

  // Choose the best available album artwork resolution, falling back to local asset
  const coverImage =
    rawTrack.album?.cover_medium ||
    rawTrack.album?.cover_big ||
    rawTrack.album?.cover ||
    FALLBACK_TRACK_COVER;

  return {
    // Ensure ID is a string for stable React list keys
    id: String(rawTrack.id ?? `track-${Date.now()}`),
    title: rawTrack.title_short || rawTrack.title || 'Unknown Title',
    artist: rawTrack.artist?.name || 'Unknown Artist',
    artistId: rawTrack.artist?.id ?? null,
    album: rawTrack.album?.title || 'Single / Unknown Album',
    albumId: rawTrack.album?.id ?? null,
    duration: typeof rawTrack.duration === 'number' ? rawTrack.duration : 0,
    cover: coverImage,
    // 30-second official MP3 preview URL (or null if unavailable)
    previewUrl: rawTrack.preview || null,
    // Official Deezer web page for the track
    externalUrl: rawTrack.link || null,
    source: 'deezer',
  };
}

/**
 * Transforms an array of raw Deezer track items, filtering out any malformed entries.
 *
 * @param {Array} rawTrackList - Array of raw track items from Deezer.
 * @returns {Array} Array of sanitized, normalized Track objects.
 */
export function mapDeezerTrackList(rawTrackList) {
  if (!Array.isArray(rawTrackList)) {
    return [];
  }

  return rawTrackList
    .map(mapDeezerTrackToTrack)
    .filter((track) => track !== null && Boolean(track.id));
}