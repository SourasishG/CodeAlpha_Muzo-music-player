import { DEEZER_CONFIG } from '../config/apiConfig';
import { mapDeezerTrackList } from './deezerMappers';
import { FALLBACK_TRACK_COVER } from '../config/constants';

/**
 * Normalizes iTunes public catalog tracks into our internal Track model.
 */
function mapITunesTracks(results) {
  if (!Array.isArray(results)) return [];

  return results
    .filter((item) => item.trackId && item.previewUrl)
    .map((item) => ({
      id: String(item.trackId),
      title: item.trackName || 'Unknown Title',
      artist: item.artistName || 'Unknown Artist',
      artistId: item.artistId || null,
      album: item.collectionName || 'Single / Album',
      albumId: item.collectionId || null,
      duration: item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 30,
      // Convert 100x100 thumbnail to crisp 500x500 artwork
      cover: item.artworkUrl100
        ? item.artworkUrl100.replace('100x100bb', '500x500bb')
        : FALLBACK_TRACK_COVER,
      previewUrl: item.previewUrl || null,
      externalUrl: item.trackViewUrl || null,
      source: 'deezer',
    }));
}

/**
 * Searches the music catalog with automatic global fallback.
 */
export async function searchTracks(query, { signal } = {}) {
  const cleanQuery = query?.trim();
  if (!cleanQuery || cleanQuery.length < DEEZER_CONFIG.MIN_QUERY_LENGTH) {
    return [];
  }

  // 1. First, attempt Deezer API via proxy
  try {
    const deezerUrl = `${DEEZER_CONFIG.BASE_URL}/search?q=${encodeURIComponent(cleanQuery)}&limit=${DEEZER_CONFIG.SEARCH_LIMIT}`;
    const res = await fetch(deezerUrl, { signal });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return mapDeezerTrackList(data.data);
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('Deezer catalog restricted, trying global public catalog...');
  }

  // 2. If Deezer is regionally restricted or returns 0 tracks, query global public catalog
  try {
    const globalUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&media=music&entity=song&limit=${DEEZER_CONFIG.SEARCH_LIMIT}`;
    const res = await fetch(globalUrl, { signal });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    return mapITunesTracks(json.results || []);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('Global catalog search failed:', err.message);
    throw err;
  }
}