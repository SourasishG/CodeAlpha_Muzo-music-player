import { useRef, useCallback, useEffect } from 'react';
import { searchTracks } from '../api/deezerApi';
import { usePlayerStore } from '../store/usePlayerStore';
import { DEEZER_CONFIG } from '../config/apiConfig';
import { UI_MESSAGES } from '../config/constants';

/**
 * Custom hook to execute music catalog searches safely with request cancellation.
 */
export function useMusicSearch() {
  const searchQuery = usePlayerStore((state) => state.searchQuery);
  const searchResults = usePlayerStore((state) => state.searchResults);
  const searchStatus = usePlayerStore((state) => state.searchStatus);
  const searchError = usePlayerStore((state) => state.searchError);

  const setSearchQuery = usePlayerStore((state) => state.setSearchQuery);
  const setSearchLoading = usePlayerStore((state) => state.setSearchLoading);
  const setSearchResults = usePlayerStore((state) => state.setSearchResults);
  const setSearchError = usePlayerStore((state) => state.setSearchError);
  const clearSearch = usePlayerStore((state) => state.clearSearch);

  // Holds reference to the active network request's AbortController
  const abortControllerRef = useRef(null);

  /**
   * Executes track search, aborting any previous pending search.
   */
  const executeSearch = useCallback(
    async (queryToSearch) => {
      const activeQuery =
        typeof queryToSearch === 'string' ? queryToSearch.trim() : searchQuery.trim();

      // Guard against queries below minimum character limit
      if (activeQuery.length < DEEZER_CONFIG.MIN_QUERY_LENGTH) {
        return;
      }

      // Abort any in-flight request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSearchLoading();

      try {
        const tracks = await searchTracks(activeQuery, { signal: controller.signal });
        setSearchResults(tracks, activeQuery);
      } catch (error) {
        // If aborted intentionally by a newer search, exit quietly
        if (error.name === 'AbortError') {
          return;
        }
        setSearchError(UI_MESSAGES.SEARCH_ERROR);
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [searchQuery, setSearchLoading, setSearchResults, setSearchError]
  );

  // Clean up any pending fetch request if the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    status: searchStatus,
    error: searchError,
    search: executeSearch,
    clear: clearSearch,
  };
}