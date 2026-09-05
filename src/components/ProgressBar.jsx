import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioEngine } from '../engine/audioEngine';
import { formatTime } from '../utils/timeFormat';

export function ProgressBar() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const seek = usePlayerStore((state) => state.seek);

  // Local state to prevent the slider from jumping while the user is actively dragging it
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  // Use the scrub position while dragging, or the real engine time while listening
  const activeTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = duration > 0 ? (activeTime / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    setIsScrubbing(true);
    setScrubValue(Number(e.target.value));
  };

  const handleSeekCommit = (e) => {
    const targetSeconds = Number(e.target.value);
    setIsScrubbing(false);
    seek(targetSeconds);
    audioEngine.seek(targetSeconds);
  };

  return (
    <div className="progress-container">
      <div className="progress-slider-wrapper">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={activeTime || 0}
          onChange={handleSeekChange}
          onMouseUp={handleSeekCommit}
          onTouchEnd={handleSeekCommit}
          onKeyUp={handleSeekCommit}
          className="progress-slider"
          style={{ '--progress-percent': `${progressPercent}%` }}
          aria-label="Playback timeline"
          aria-valuemin="0"
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(activeTime)}
          aria-valuetext={`${formatTime(activeTime)} of ${formatTime(duration)}`}
          disabled={!duration || duration === 0}
        />
      </div>

      <div className="progress-timestamps" aria-hidden="true">
        <span className="timestamp current-time">{formatTime(activeTime)}</span>
        <span className="timestamp total-duration">{formatTime(duration)}</span>
      </div>
    </div>
  );
}