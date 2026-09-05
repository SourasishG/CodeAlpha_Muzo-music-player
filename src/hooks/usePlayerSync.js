import { useEffect, useRef } from 'react';
import { audioEngine } from '../engine/audioEngine';
import { usePlayerStore } from '../store/usePlayerStore';
import { PLAYER_STATUS, REPEAT_MODES, UI_MESSAGES } from '../config/constants';

/**
 * Custom hook that synchronizes the Zustand player store with the Audio Engine.
 */
export function usePlayerSync() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const repeatMode = usePlayerStore((state) => state.repeatMode);

  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setStatus = usePlayerStore((state) => state.setStatus);
  const setError = usePlayerStore((state) => state.setError);
  const nextTrack = usePlayerStore((state) => state.nextTrack);

  const currentTrack = playlist[currentTrackIndex];
  const audioSource = currentTrack?.previewUrl || currentTrack?.src || null;

  const isFirstRender = useRef(true);

  // -------------------------------------------------------------
  // 1. LISTEN TO AUDIO ENGINE EVENTS
  // -------------------------------------------------------------
  useEffect(() => {
    const unsubTime = audioEngine.on('timeupdate', () => {
      setCurrentTime(audioEngine.getCurrentTime());
    });

    const unsubMeta = audioEngine.on('loadedmetadata', () => {
      setDuration(audioEngine.getDuration());
      setStatus(PLAYER_STATUS.IDLE);
    });

    const unsubWaiting = audioEngine.on('waiting', () => {
      setStatus(PLAYER_STATUS.LOADING);
    });

    const unsubCanPlay = audioEngine.on('canplay', () => {
      if (usePlayerStore.getState().isPlaying) {
        setStatus(PLAYER_STATUS.PLAYING);
      }
    });

    const unsubEnded = () => {
      if (repeatMode === REPEAT_MODES.ONE) {
        audioEngine.seek(0);
        audioEngine.play();
      } else {
        nextTrack();
      }
    };
    const unsubEndedListener = audioEngine.on('ended', unsubEnded);

    const unsubError = () => {
      // Only report an error if the user was actively trying to play audio
      if (usePlayerStore.getState().isPlaying) {
        setError(UI_MESSAGES.PLAYBACK_ERROR);
      }
    };
    const unsubErrorListener = audioEngine.on('error', unsubError);

    return () => {
      unsubTime();
      unsubMeta();
      unsubWaiting();
      unsubCanPlay();
      unsubEndedListener();
      unsubErrorListener();
    };
  }, [repeatMode, nextTrack, setCurrentTime, setDuration, setStatus, setError]);

  // -------------------------------------------------------------
  // 2. SYNCHRONIZE TRACK CHANGES (Runs ONLY when audioSource changes)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!audioSource) {
      audioEngine.loadTrack(null);
      setDuration(0);
      setCurrentTime(0);
      return;
    }

    audioEngine.loadTrack(audioSource);

    // Prevent autoplay on the very first mount of the website
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // If already playing when track switched, play new track
    if (usePlayerStore.getState().isPlaying) {
      audioEngine.play();
    }
  }, [audioSource, setDuration, setCurrentTime]);

  // -------------------------------------------------------------
  // 3. SYNCHRONIZE PLAY / PAUSE (Runs ONLY when isPlaying toggles)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isFirstRender.current) return;

    if (isPlaying) {
      if (audioSource) {
        audioEngine.play();
        setStatus(PLAYER_STATUS.PLAYING);
      }
    } else {
      audioEngine.pause();
      setStatus(PLAYER_STATUS.PAUSED);
    }
  }, [isPlaying, audioSource, setStatus]);

  // -------------------------------------------------------------
  // 4. SYNCHRONIZE VOLUME & MUTE
  // -------------------------------------------------------------
  useEffect(() => {
    audioEngine.setVolume(volume);
    audioEngine.setMuted(isMuted);
  }, [volume, isMuted]);
}