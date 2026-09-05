import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Music } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export function TrackInfo() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  // Track the specific image URL that failed loading (derived state without effect)
  const [failedCover, setFailedCover] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowDistance, setOverflowDistance] = useState(0);

  const containerRef = useRef(null);
  const titleRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex];

  let title = 'No Track Selected';
  let artist = 'Unknown Artist';
  let coverSrc = '';

  if (currentTrack) {
    if (currentTrack.title) {
      title = currentTrack.title;
    }
    if (currentTrack.artist) {
      artist = currentTrack.artist;
    }
    if (currentTrack.cover) {
      coverSrc = currentTrack.cover;
    }
  }

  // Derive whether this specific cover image failed (resets automatically when coverSrc changes)
  let isImageFailed = false;
  if (coverSrc && failedCover === coverSrc) {
    isImageFailed = true;
  }

  // Measure title overflow to activate the train marquee
  useEffect(() => {
    if (containerRef.current && titleRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = titleRef.current.scrollWidth;

      if (textWidth > containerWidth) {
        setIsOverflowing(true);
        setOverflowDistance(textWidth - containerWidth + 16);
      } else {
        setIsOverflowing(false);
        setOverflowDistance(0);
      }
    }
  }, [title]);

  let artworkContainerClass = 'artwork-container';
  if (isPlaying) {
    artworkContainerClass = 'artwork-container is-playing';
  }

  // Train marquee classes and distance styles
  let titleWrapperClass = 'track-title-wrapper';
  let titleClass = 'track-title';
  let titleStyle = {};

  if (isOverflowing) {
    titleWrapperClass = 'track-title-wrapper is-overflowing';
    titleClass = 'track-title is-marquee';
    const durationSeconds = Math.max(5, Math.round(overflowDistance / 25) + 3);
    titleStyle = {
      '--marquee-dist': `-${overflowDistance}px`,
      '--marquee-duration': `${durationSeconds}s`,
    };
  }

  // Render artwork image or fallback music icon without ternary operators
  let artworkContent = (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)',
      }}
    >
      <Music size={54} />
    </div>
  );

  if (coverSrc && !isImageFailed) {
    artworkContent = (
      <img
        src={coverSrc}
        alt={`Album artwork for ${title} by ${artist}`}
        className="artwork-image"
        onError={() => setFailedCover(coverSrc)}
      />
    );
  }

  return (
    <div className="track-info">
      {/* Album Artwork Frame */}
      <div className={artworkContainerClass}>{artworkContent}</div>

      {/* Song Metadata with Train Ticker */}
      <div className="track-details">
        <div ref={containerRef} className={titleWrapperClass}>
          <h1
            ref={titleRef}
            className={titleClass}
            style={titleStyle}
            title={title}
          >
            {title}
          </h1>
        </div>

        <p className="track-artist" title={artist}>
          {artist}
        </p>

        {/* Deezer Source Badges & External Link */}
        {currentTrack && currentTrack.source === 'deezer' && (
          <div className="track-provider-meta">
            {currentTrack.previewUrl && (
              <span className="track-preview-pill">30s Preview</span>
            )}

            {currentTrack.externalUrl && (
              <a
                href={currentTrack.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="track-external-anchor"
                aria-label={`Open ${title} on Deezer (opens in new tab)`}
                title="Open on Deezer"
              >
                <span>Deezer</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}