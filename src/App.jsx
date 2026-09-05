import { useState } from 'react';
import { usePlayerSync } from './hooks/usePlayerSync';
import { usePlayerStore } from './store/usePlayerStore';
import { SEARCH_STATUS } from './config/constants';
import { SearchBar } from './components/SearchBar';
import { PlayerCard } from './components/PlayerCard';
import { Playlist } from './components/Playlist';
import { SearchResults } from './components/SearchResults';
import { ListMusic, Compass } from 'lucide-react';

export default function App() {
  // Synchronizes browser audio engine with the Zustand store
  usePlayerSync();

  const error = usePlayerStore((state) => state.error);
  const searchStatus = usePlayerStore((state) => state.searchStatus);

  // Tab state: 'queue' or 'discovery'
  const [activeTab, setActiveTab] = useState('queue');
  const [prevSearchStatus, setPrevSearchStatus] = useState(searchStatus);

  // Adjust state during render when searchStatus changes (avoids cascading render warning)
  if (searchStatus !== prevSearchStatus) {
    setPrevSearchStatus(searchStatus);
    if (
      searchStatus === SEARCH_STATUS.LOADING ||
      searchStatus === SEARCH_STATUS.SUCCESS
    ) {
      setActiveTab('discovery');
    }
  }

  // Determine button classes without ternary operators
  let queueTabClass = 'tab-btn';
  let isQueueSelected = false;
  if (activeTab === 'queue') {
    queueTabClass = 'tab-btn is-active';
    isQueueSelected = true;
  }

  let discoveryTabClass = 'tab-btn';
  let isDiscoverySelected = false;
  if (activeTab === 'discovery') {
    discoveryTabClass = 'tab-btn is-active';
    isDiscoverySelected = true;
  }

  // Determine aria-labelledby without ternary operators
  let panelLabelledBy = 'tab-queue';
  if (activeTab === 'discovery') {
    panelLabelledBy = 'tab-discovery';
  }

  // Render the selected right-hand panel without ternary operators
  const renderSidePanel = () => {
    if (activeTab === 'discovery') {
      return <SearchResults />;
    }
    return <Playlist />;
  };

  return (
    <main className="app-container" aria-label="Music Player Application">
      {/* Top Search Bar */}
      <header className="app-header">
        <SearchBar />
      </header>

      {/* Global Error Banner */}
      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="player-layout">
        {/* Left Column: Neumorphic Player Card */}
        <div className="player-column">
          <PlayerCard />
        </div>

        {/* Right Column: Queue / Discovery Panel with Accessible Switcher */}
        <div className="panel-column">
          <nav
            className="view-tabs"
            role="tablist"
            aria-label="Content view selection"
          >
            <button
              type="button"
              role="tab"
              id="tab-queue"
              className={queueTabClass}
              onClick={() => setActiveTab('queue')}
              aria-selected={isQueueSelected}
              aria-controls="panel-content"
            >
              <ListMusic size={16} />
              <span>Queue</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-discovery"
              className={discoveryTabClass}
              onClick={() => setActiveTab('discovery')}
              aria-selected={isDiscoverySelected}
              aria-controls="panel-content"
            >
              <Compass size={16} />
              <span>Discovery</span>
            </button>
          </nav>

          <div
            id="panel-content"
            className="panel-content-wrapper"
            role="tabpanel"
            aria-labelledby={panelLabelledBy}
          >
            {renderSidePanel()}
          </div>
        </div>
      </div>
    </main>
  );
}