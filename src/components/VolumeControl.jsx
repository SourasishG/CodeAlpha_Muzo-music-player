import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export function VolumeControl() {
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);

  // Effective volume level for slider and icons
  const currentVolume = isMuted ? 0 : volume;
  const volumePercent = currentVolume * 100;

  // Choose the appropriate volume icon
  const renderVolumeIcon = () => {
    if (isMuted || currentVolume === 0) return <VolumeX size={18} />;
    if (currentVolume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // If previously muted and user moves slider up, toggleMute unmutes
    if (isMuted && newVolume > 0) {
      toggleMute();
    }
  };

  return (
    <div className="volume-container" role="group" aria-label="Volume Controls">
      <button
        type="button"
        className="volume-mute-btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        aria-pressed={isMuted}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {renderVolumeIcon()}
      </button>

      <div className="volume-slider-wrapper">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentVolume}
          onChange={handleVolumeChange}
          className="volume-slider"
          style={{ '--volume-percent': `${volumePercent}%` }}
          aria-label="Volume slider"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(volumePercent)}
          aria-valuetext={`${Math.round(volumePercent)} percent volume`}
        />
      </div>
    </div>
  );
}