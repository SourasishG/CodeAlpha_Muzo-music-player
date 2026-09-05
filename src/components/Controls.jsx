import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { REPEAT_MODES } from '../config/constants';

export function Controls() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isShuffle = usePlayerStore((state) => state.isShuffle);
  const repeatMode = usePlayerStore((state) => state.repeatMode);
  const playlist = usePlayerStore((state) => state.playlist);

  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const prevTrack = usePlayerStore((state) => state.prevTrack);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const cycleRepeatMode = usePlayerStore((state) => state.cycleRepeatMode);

  const isPlaylistEmpty = playlist.length === 0;

  // Render appropriate Repeat icon and label
  const isRepeatActive = repeatMode !== REPEAT_MODES.OFF;
  const isRepeatOne = repeatMode === REPEAT_MODES.ONE;
  const repeatLabel = `Repeat mode: ${repeatMode}`;

  return (
    <div className="player-controls" role="group" aria-label="Audio Playback Controls">
      {/* 1. Shuffle Button */}
      <button
        type="button"
        className={`control-btn secondary-btn ${isShuffle ? 'is-active' : ''}`}
        onClick={toggleShuffle}
        disabled={isPlaylistEmpty}
        aria-label="Toggle shuffle mode"
        aria-pressed={isShuffle}
        title={isShuffle ? 'Shuffle: On' : 'Shuffle: Off'}
      >
        <Shuffle size={18} />
      </button>

      {/* 2. Previous Track Button */}
      <button
        type="button"
        className="control-btn secondary-btn"
        onClick={prevTrack}
        disabled={isPlaylistEmpty}
        aria-label="Previous track"
        title="Previous track"
      >
        <SkipBack size={20} />
      </button>

      {/* 3. Primary Play / Pause Button */}
      <button
        type="button"
        className="control-btn primary-btn"
        onClick={togglePlay}
        disabled={isPlaylistEmpty}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={28} className="control-icon" />
        ) : (
          <Play size={28} className="control-icon play-icon-offset" />
        )}
      </button>

      {/* 4. Next Track Button */}
      <button
        type="button"
        className="control-btn secondary-btn"
        onClick={nextTrack}
        disabled={isPlaylistEmpty}
        aria-label="Next track"
        title="Next track"
      >
        <SkipForward size={20} />
      </button>

      {/* 5. Repeat Button */}
      <button
        type="button"
        className={`control-btn secondary-btn ${isRepeatActive ? 'is-active' : ''}`}
        onClick={cycleRepeatMode}
        disabled={isPlaylistEmpty}
        aria-label={repeatLabel}
        aria-pressed={isRepeatActive}
        title={repeatLabel}
      >
        {isRepeatOne ? <Repeat1 size={18} /> : <Repeat size={18} />}
      </button>
    </div>
  );
}