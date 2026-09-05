import { Search, X, Loader2 } from 'lucide-react';
import { useMusicSearch } from '../hooks/useMusicSearch';
import { SEARCH_STATUS } from '../config/constants';
import { DEEZER_CONFIG } from '../config/apiConfig';

export function SearchBar() {
  const { query, setQuery, search, clear, status } = useMusicSearch();
  const isLoading = status === SEARCH_STATUS.LOADING;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= DEEZER_CONFIG.MIN_QUERY_LENGTH) {
      search(query);
    }
  };

  const handleClear = () => {
    clear();
  };

  return (
    <form className="search-bar-form" role="search" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-leading-icon" aria-hidden="true" />
        <input
          type="text"
          role="searchbox"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks, artists, albums..."
          aria-label="Search for music"
          autoComplete="off"
          spellCheck="false"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search input"
            title="Clear"
            disabled={isLoading}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="search-submit-btn"
        disabled={isLoading || query.trim().length < DEEZER_CONFIG.MIN_QUERY_LENGTH}
        aria-label={isLoading ? 'Searching...' : 'Search'}
        title="Search"
      >
        {isLoading ? (
          <Loader2 size={18} className="search-spinner" />
        ) : (
          <span>Search</span>
        )}
      </button>
    </form>
  );
}