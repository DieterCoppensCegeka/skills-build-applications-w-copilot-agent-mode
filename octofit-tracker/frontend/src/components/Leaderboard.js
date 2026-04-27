import { useCallback, useEffect, useMemo, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Leaderboard endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Leaderboard fetched data:', data);

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      setEntries(records);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => `${entry.team} ${entry.points}`.toLowerCase().includes(normalizedQuery));
  }, [entries, query]);

  return (
    <section>
      <div className="card data-panel">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
            <div>
              <h1 className="h3 fw-bold mb-1">Leaderboard</h1>
              <p className="section-subtitle mb-0">Team rankings from the Django REST API.</p>
            </div>
            <div className="d-flex gap-2">
              <a
                className="btn btn-outline-primary btn-sm"
                href={endpoint}
                target="_blank"
                rel="noreferrer"
              >
                API Link
              </a>
              <button className="btn btn-primary btn-sm" type="button" onClick={fetchLeaderboard}>
                Refresh
              </button>
            </div>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-8">
              <label className="form-label small text-muted mb-1">Search leaderboard</label>
              <input
                className="form-control"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by team or points"
              />
            </div>
            <div className="col-12 col-md-4 d-grid">
              <button className="btn btn-outline-secondary" type="button" onClick={() => setQuery('')}>
                Clear Filter
              </button>
            </div>
          </form>

          <p className="small mb-3">
            Endpoint:{' '}
            <a className="link-primary endpoint-link" href={endpoint} target="_blank" rel="noreferrer">
              {endpoint}
            </a>
          </p>

          {loading && <p className="mb-0">Loading leaderboard...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}

          {!loading && !error && (
            <div className="table-wrap">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>#</th>
                      <th style={{ width: '46%' }}>Team</th>
                      <th style={{ width: '24%' }}>Points</th>
                      <th style={{ width: '18%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry, index) => (
                        <tr key={entry.id ?? `${entry.team}-${entry.points}`}>
                          <td>{index + 1}</td>
                          <td>{entry.team}</td>
                          <td>
                            <span className="badge text-bg-primary">{entry.points}</span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              type="button"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No leaderboard data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedEntry && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">Leaderboard Entry</h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedEntry(null)}
                />
              </div>
              <div className="modal-body">
                <pre className="mb-0 small">{JSON.stringify(selectedEntry, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedEntry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Leaderboard;