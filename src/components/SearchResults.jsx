import { Search, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { SearchResultItem } from './SearchResultItem';
import { SEARCH_STATUS, UI_MESSAGES } from '../config/constants';

export function SearchResults() {
  const searchResults = usePlayerStore((state) => state.searchResults);
  const searchStatus = usePlayerStore((state) => state.searchStatus);
  const searchError = usePlayerStore((state) => state.searchError);
  const lastSearchedQuery = usePlayerStore((state) => state.lastSearchedQuery);

  // Render status feedback or the results list without ternary operators
  const renderContent = () => {
    if (searchStatus === SEARCH_STATUS.LOADING) {
      return (
        <div className="search-status-box" aria-live="polite" aria-busy="true">
          <Loader2 size={24} className="search-spinner" />
          <p>{UI_MESSAGES.SEARCH_LOADING}</p>
        </div>
      );
    }

    if (searchStatus === SEARCH_STATUS.ERROR) {
      let errorMessage = UI_MESSAGES.SEARCH_ERROR;
      if (searchError) {
        errorMessage = searchError;
      }

      return (
        <div className="search-status-box search-error" role="alert">
          <AlertCircle size={24} />
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (searchStatus === SEARCH_STATUS.EMPTY) {
      let emptyMessage = UI_MESSAGES.SEARCH_EMPTY;
      if (lastSearchedQuery) {
        emptyMessage = `No tracks found for "${lastSearchedQuery}". Try another search.`;
      }

      return (
        <div className="search-status-box">
          <Inbox size={24} />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    if (searchStatus === SEARCH_STATUS.SUCCESS && searchResults.length > 0) {
      return (
        <ul className="search-results-list" aria-label="Catalog Track Results">
          {searchResults.map((track) => (
            <SearchResultItem key={track.id} track={track} />
          ))}
        </ul>
      );
    }

    // Default: IDLE state (before user initiates a search)
    return (
      <div className="search-status-box search-idle">
        <Search size={24} />
        <p>{UI_MESSAGES.SEARCH_INITIAL}</p>
      </div>
    );
  };

  return (
    <section className="search-results-panel" aria-label="Music Discovery Results">
      <header className="search-results-header">
        <h3 className="search-results-title">Discovery</h3>
        {searchStatus === SEARCH_STATUS.SUCCESS && (
          <span className="search-results-count">
            {searchResults.length} results
          </span>
        )}
      </header>

      <div className="search-results-content">{renderContent()}</div>
    </section>
  );
}