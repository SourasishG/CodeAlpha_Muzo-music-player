import { Volume2, X } from 'lucide-react';
import { FALLBACK_TRACK_COVER } from '../config/constants';
import { formatTime } from '../utils/timeFormat';

export function PlaylistItem({
  track,
  index,
  isActive,
  isPlaying,
  onSelect,
  onRemove,
}) {
  // Determine artwork thumbnail source without ternary operators
  let coverSrc = FALLBACK_TRACK_COVER;
  if (track.cover) {
    coverSrc = track.cover;
  }

  // Determine button container class without ternary operators
  let itemBtnClass = 'playlist-item-btn';
  if (isActive) {
    itemBtnClass = 'playlist-item-btn is-active';
  }

  // Determine aria-current attribute without ternary operators
  let ariaCurrentValue = undefined;
  if (isActive) {
    ariaCurrentValue = 'true';
  }

  // Determine accessibility action label without ternary operators
  let actionVerb = 'Play';
  if (isActive && isPlaying) {
    actionVerb = 'Pause';
  }
  const itemAriaLabel = `${actionVerb} ${track.title} by ${track.artist}`;

  // Determine indicator content (Index number vs animated volume icon)
  let indicatorContent = (
    <span className="playlist-item-index">{index + 1}</span>
  );
  if (isActive && isPlaying) {
    indicatorContent = <Volume2 size={16} className="playlist-active-icon" />;
  }

  const handleImageError = (e) => {
    e.currentTarget.src = FALLBACK_TRACK_COVER;
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <li className="playlist-item">
      <div className="playlist-item-row">
        <button
          type="button"
          className={itemBtnClass}
          onClick={onSelect}
          aria-current={ariaCurrentValue}
          aria-label={itemAriaLabel}
        >
          <div className="playlist-item-indicator">{indicatorContent}</div>

          <img
            src={coverSrc}
            alt=""
            className="playlist-item-thumb"
            onError={handleImageError}
            loading="lazy"
          />

          <div className="playlist-item-meta">
            <span className="playlist-item-title" title={track.title}>
              {track.title}
            </span>
            <span className="playlist-item-artist" title={track.artist}>
              {track.artist}
            </span>
          </div>

          {track.duration > 0 && (
            <span className="playlist-item-duration">
              {formatTime(track.duration)}
            </span>
          )}
        </button>

        {onRemove && (
          <button
            type="button"
            className="playlist-item-remove-btn"
            onClick={handleRemoveClick}
            aria-label={`Remove ${track.title} from queue`}
            title="Remove from queue"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </li>
  );
}