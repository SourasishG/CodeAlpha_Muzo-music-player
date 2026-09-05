import { useState, useEffect } from 'react';
import { usePlayerSync } from './hooks/usePlayerSync';
import { usePlayerStore } from './store/usePlayerStore';
import { SEARCH_STATUS } from './config/constants';
import { SearchBar } from './components/SearchBar';
import { PlayerCard } from './components/PlayerCard';
import { Playlist } from './components/Playlist';
import { SearchResults } from './components/SearchResults';
import { ListMusic, Compass, X } from 'lucide-react';

export default function App() {
  usePlayerSync();

  const error = usePlayerStore((state) => state.error);
  const setError = usePlayerStore((state) => state.setError);
  const searchStatus = usePlayerStore((state) => state.searchStatus);

  const [activeTab, setActiveTab] = useState('queue');
  const [prevSearchStatus, setPrevSearchStatus] = useState(searchStatus);

  // Switch to discovery during render when a search starts
  if (searchStatus !== prevSearchStatus) {
    setPrevSearchStatus(searchStatus);
    if (
      searchStatus === SEARCH_STATUS.LOADING ||
      searchStatus === SEARCH_STATUS.SUCCESS
    ) {
      setActiveTab('discovery');
    }
  }

  // Auto-dismiss the error banner after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

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

  let panelLabelledBy = 'tab-queue';
  if (activeTab === 'discovery') {
    panelLabelledBy = 'tab-discovery';
  }

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

      {/* Dismissable Error Banner */}
      {error && (
        <div className="error-banner" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="player-layout">
        <div className="player-column">
          <PlayerCard />
        </div>

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