import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_PLAYLIST } from '../config/playlist';
import {
  REPEAT_MODES,
  PLAYER_STATUS,
  SEARCH_STATUS,
  DEFAULT_PLAYER_CONFIG,
  UI_MESSAGES,
} from '../config/constants';
import { getNextTrackIndex, getPreviousTrackIndex } from '../utils/playlistHelpers';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // =========================================================================
      // 1. PLAYBACK STATE
      // =========================================================================
      playlist: INITIAL_PLAYLIST,
      currentTrackIndex: 0,
      isPlaying: false, // Always start paused on page load to respect browser autoplay policies
      currentTime: 0,
      duration: 0,
      volume: DEFAULT_PLAYER_CONFIG.VOLUME,
      isMuted: DEFAULT_PLAYER_CONFIG.IS_MUTED,
      repeatMode: DEFAULT_PLAYER_CONFIG.REPEAT_MODE,
      isShuffle: DEFAULT_PLAYER_CONFIG.IS_SHUFFLE,
      status: PLAYER_STATUS.IDLE,
      error: null,

      // =========================================================================
      // 2. SEARCH STATE (Temporary UI state, not persisted)
      // =========================================================================
      searchQuery: '',
      searchResults: [],
      searchStatus: SEARCH_STATUS.IDLE,
      searchError: null,
      lastSearchedQuery: '',

      // =========================================================================
      // 3. SEARCH ACTIONS
      // =========================================================================
      setSearchQuery: (query) => set({ searchQuery: query }),

      setSearchLoading: () =>
        set({
          searchStatus: SEARCH_STATUS.LOADING,
          searchError: null,
        }),

      setSearchResults: (results, query) =>
        set({
          searchResults: results,
          lastSearchedQuery: query,
          searchStatus: results.length > 0 ? SEARCH_STATUS.SUCCESS : SEARCH_STATUS.EMPTY,
          searchError: null,
        }),

      setSearchError: (errorMessage) =>
        set({
          searchStatus: SEARCH_STATUS.ERROR,
          searchError: errorMessage,
        }),

      clearSearch: () =>
        set({
          searchQuery: '',
          searchResults: [],
          searchStatus: SEARCH_STATUS.IDLE,
          searchError: null,
        }),

      // =========================================================================
      // 4. QUEUE MANAGEMENT ACTIONS
      // =========================================================================
      addToQueue: (track) => {
        if (!track || !track.id) return;
        const { playlist } = get();

        // Prevent duplicate tracks
        const alreadyExists = playlist.some(
          (item) => String(item.id) === String(track.id)
        );
        if (alreadyExists) return;

        set({ playlist: [...playlist, track] });
      },

      playPreviewTrack: (track) => {
        if (!track || !track.id) return;

        if (!track.previewUrl && !track.src) {
          set({ error: UI_MESSAGES.PREVIEW_UNAVAILABLE });
          return;
        }

        const { playlist } = get();
        const existingIndex = playlist.findIndex(
          (item) => String(item.id) === String(track.id)
        );

        if (existingIndex !== -1) {
          set({
            currentTrackIndex: existingIndex,
            currentTime: 0,
            isPlaying: true,
            error: null,
            status: PLAYER_STATUS.LOADING,
          });
        } else {
          const updatedPlaylist = [...playlist, track];
          set({
            playlist: updatedPlaylist,
            currentTrackIndex: updatedPlaylist.length - 1,
            currentTime: 0,
            isPlaying: true,
            error: null,
            status: PLAYER_STATUS.LOADING,
          });
        }
      },

      removeFromQueue: (trackId) => {
        const { playlist, currentTrackIndex } = get();
        const targetIndex = playlist.findIndex(
          (item) => String(item.id) === String(trackId)
        );
        if (targetIndex === -1) return;

        const updatedPlaylist = playlist.filter(
          (item) => String(item.id) !== String(trackId)
        );

        if (updatedPlaylist.length === 0) {
          set({
            playlist: [],
            currentTrackIndex: 0,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            status: PLAYER_STATUS.IDLE,
          });
          return;
        }

        let nextIndex = currentTrackIndex;
        if (targetIndex < currentTrackIndex) {
          nextIndex = currentTrackIndex - 1;
        } else if (currentTrackIndex >= updatedPlaylist.length) {
          nextIndex = updatedPlaylist.length - 1;
        }

        set({
          playlist: updatedPlaylist,
          currentTrackIndex: nextIndex,
        });
      },

      clearQueue: () =>
        set({
          playlist: [],
          currentTrackIndex: 0,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          status: PLAYER_STATUS.IDLE,
        }),

      // =========================================================================
      // 5. PLAYBACK ACTIONS
      // =========================================================================
      loadPlaylist: (newPlaylist) =>
        set({
          playlist: newPlaylist,
          currentTrackIndex: 0,
          currentTime: 0,
          isPlaying: false,
          error: null,
        }),

      selectTrack: (index) => {
        const { playlist, currentTrackIndex } = get();
        if (index < 0 || index >= playlist.length) return;

        if (index === currentTrackIndex) {
          set((state) => ({ isPlaying: !state.isPlaying }));
          return;
        }

        set({
          currentTrackIndex: index,
          currentTime: 0,
          isPlaying: true,
          error: null,
          status: PLAYER_STATUS.LOADING,
        });
      },

      togglePlay: () => {
        const { playlist } = get();
        if (playlist.length === 0) return;
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),

      nextTrack: () => {
        const { currentTrackIndex, playlist, repeatMode, isShuffle } = get();
        const nextIndex = getNextTrackIndex({
          currentIndex: currentTrackIndex,
          playlistLength: playlist.length,
          repeatMode,
          isShuffle,
        });

        if (nextIndex === -1) {
          set({ isPlaying: false, currentTime: 0 });
        } else {
          set({
            currentTrackIndex: nextIndex,
            currentTime: 0,
            isPlaying: true,
            error: null,
            status: PLAYER_STATUS.LOADING,
          });
        }
      },

      prevTrack: () => {
        const { currentTrackIndex, playlist, isShuffle, currentTime } = get();
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        const prevIndex = getPreviousTrackIndex({
          currentIndex: currentTrackIndex,
          playlistLength: playlist.length,
          isShuffle,
        });

        if (prevIndex !== -1) {
          set({
            currentTrackIndex: prevIndex,
            currentTime: 0,
            isPlaying: true,
            error: null,
            status: PLAYER_STATUS.LOADING,
          });
        }
      },

      seek: (time) => set({ currentTime: time }),

      setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({
          volume: clampedVolume,
          isMuted: clampedVolume === 0,
        });
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      cycleRepeatMode: () => {
        const { repeatMode } = get();
        let nextMode;
        if (repeatMode === REPEAT_MODES.OFF) nextMode = REPEAT_MODES.ALL;
        else if (repeatMode === REPEAT_MODES.ALL) nextMode = REPEAT_MODES.ONE;
        else nextMode = REPEAT_MODES.OFF;

        set({ repeatMode: nextMode });
      },

      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

      // =========================================================================
      // 6. ENGINE SYNCHRONIZATION SETTERS
      // =========================================================================
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error, isPlaying: false, status: PLAYER_STATUS.ERROR }),
    }),
    {
      name: 'musique-player-storage', // LocalStorage item key
      // Whitelist only persistent settings (do not persist temporary search queries or error messages)
      partialize: (state) => ({
        playlist: state.playlist,
        currentTrackIndex: state.currentTrackIndex,
        volume: state.volume,
        isMuted: state.isMuted,
        repeatMode: state.repeatMode,
        isShuffle: state.isShuffle,
      }),
    }
  )
);  