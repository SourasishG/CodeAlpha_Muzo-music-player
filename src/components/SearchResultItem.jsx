import { Play, Pause, Plus, ExternalLink, Music2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { formatTime } from '../utils/timeFormat';
import { FALLBACK_TRACK_COVER } from '../config/constants';

export function SearchResultItem({ track }) {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playPreviewTrack = usePlayerStore((state) => state.playPreviewTrack);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  // Active track determination
  const currentTrack = playlist[currentTrackIndex];
  let isCurrent = false;
  if (
    currentTrack &&
    String(currentTrack.id) === String(track.id) &&
    currentTrack.source === track.source
  ) {
    isCurrent = true;
  }

  let isCurrentlyPlaying = false;
  if (isCurrent && isPlaying) {
    isCurrentlyPlaying = true;
  }

  // Determine item row class name
  let itemClassName = 'search-result-item';
  if (isCurrent) {
    itemClassName = 'search-result-item is-active';
  }

  // Fallback image source
  let coverImage = FALLBACK_TRACK_COVER;
  if (track.cover) {
    coverImage = track.cover;
  }

  const handleImageError = (e) => {
    e.currentTarget.src = FALLBACK_TRACK_COVER;
  };

  // Render the Preview Button or No-Preview Badge using if / else
  const renderAudioAction = () => {
    if (track.previewUrl) {
      let previewBtnClass = 'result-preview-btn';
      let previewAriaLabel = `Play preview of ${track.title}`;
      let previewTitle = 'Play 30s preview';
      let PreviewIcon = <Play size={16} />;

      if (isCurrentlyPlaying) {
        previewBtnClass = 'result-preview-btn is-playing';
        previewAriaLabel = `Pause preview of ${track.title}`;
        previewTitle = 'Pause preview';
        PreviewIcon = <Pause size={16} />;
      }

      return (
        <button
          type="button"
          className={previewBtnClass}
          onClick={() => playPreviewTrack(track)}
          aria-label={previewAriaLabel}
          title={previewTitle}
        >
          {PreviewIcon}
        </button>
      );
    }

    return (
      <span
        className="result-no-preview-badge"
        title="Preview unavailable for this track"
        aria-label="Preview unavailable"
      >
        <Music2 size={14} />
      </span>
    );
  };

  return (
    <li className={itemClassName}>
      <div className="search-result-thumb-wrap">
        <img
          src={coverImage}
          alt=""
          className="search-result-thumb"
          onError={handleImageError}
          loading="lazy"
        />
        {renderAudioAction()}
      </div>

      <div className="search-result-info">
        <h4 className="result-track-title" title={track.title}>
          {track.title}
        </h4>
        <p className="result-track-meta" title={`${track.artist} • ${track.album}`}>
          <span className="result-artist">{track.artist}</span>
          <span className="result-separator">•</span>
          <span className="result-album">{track.album}</span>
        </p>
        <span className="result-duration">{formatTime(track.duration)}</span>
      </div>

      <div className="search-result-actions">
        <button
          type="button"
          className="result-action-btn add-queue-btn"
          onClick={() => addToQueue(track)}
          aria-label={`Add ${track.title} to queue`}
          title="Add to queue"
        >
          <Plus size={16} />
        </button>

        {track.externalUrl && (
          <a
            href={track.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="result-action-link deezer-link"
            aria-label={`Open ${track.title} on Deezer (opens in new tab)`}
            title="Open on Deezer"
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </li>
  );
}