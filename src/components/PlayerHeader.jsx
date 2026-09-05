import { Music2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export function PlayerHeader() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);

  const currentTrack = playlist[currentTrackIndex];
  const albumTitle = currentTrack?.album || 'Featured Playlist';

  return (
    <header className="player-header">
      <div className="player-header-icon" aria-hidden="true">
        <Music2 size={18} />
      </div>
      <div className="player-header-text">
        <span className="player-header-badge">NOW PLAYING</span>
        <h2 className="player-header-album" title={albumTitle}>
          {albumTitle}
        </h2>
      </div>
    </header>
  );
}