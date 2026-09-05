import { ListMusic, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { PlaylistItem } from './PlaylistItem';
import { UI_MESSAGES } from '../config/constants';

export function Playlist() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const selectTrack = usePlayerStore((state) => state.selectTrack);
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue);
  const clearQueue = usePlayerStore((state) => state.clearQueue);

  // Determine pluralization for track count without ternary operators
  let trackCountText = '0 tracks';
  if (playlist.length === 1) {
    trackCountText = '1 track';
  }
  if (playlist.length > 1) {
    trackCountText = `${playlist.length} tracks`;
  }

  // Determine queue content without ternary operators
  let queueContent = (
    <div className="playlist-empty">
      <p>{UI_MESSAGES.QUEUE_EMPTY}</p>
    </div>
  );

  if (playlist.length > 0) {
    queueContent = (
      <ol className="playlist-list">
        {playlist.map((track, index) => {
          let isActive = false;
          if (index === currentTrackIndex) {
            isActive = true;
          }

          let isCurrentTrackPlaying = false;
          if (isActive && isPlaying) {
            isCurrentTrackPlaying = true;
          }

          return (
            <PlaylistItem
              key={`${track.source || 'local'}-${track.id}-${index}`}
              track={track}
              index={index}
              isActive={isActive}
              isPlaying={isCurrentTrackPlaying}
              onSelect={() => selectTrack(index)}
              onRemove={() => removeFromQueue(track.id)}
            />
          );
        })}
      </ol>
    );
  }

  return (
    <section className="playlist-container" aria-label="Playback Queue">
      <header className="playlist-header">
        <div className="playlist-title-wrap">
          <ListMusic size={20} className="playlist-icon" aria-hidden="true" />
          <h2 className="playlist-title">Queue</h2>
          <span className="playlist-count">{trackCountText}</span>
        </div>

        {playlist.length > 0 && (
          <button
            type="button"
            className="playlist-clear-btn"
            onClick={clearQueue}
            aria-label="Clear all tracks from queue"
            title="Clear Queue"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        )}
      </header>

      {queueContent}
    </section>
  );
}