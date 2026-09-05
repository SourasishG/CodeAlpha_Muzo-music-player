import { PlayerHeader } from './PlayerHeader';
import { TrackInfo } from './TrackInfo';
import { ProgressBar } from './ProgressBar';
import { Controls } from './Controls';
import { VolumeControl } from './VolumeControl';

export function PlayerCard() {
  return (
    <section className="player-card" aria-label="Music Player Controls">
      <PlayerHeader />
      <TrackInfo />
      <ProgressBar />
      <Controls />
      <VolumeControl />
    </section>
  );
}