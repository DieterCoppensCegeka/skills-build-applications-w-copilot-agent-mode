import { useCallback, useEffect, useMemo, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Activities endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Activities fetched data:', data);

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      setActivities(records);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return activities;
    }

    return activities.filter((activity) => {
      return [activity.user, activity.team, activity.type]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activities, query]);

  return (
    <section>
      <div className="card data-panel">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
            <div>
              <h1 className="h3 fw-bold mb-1">Activities</h1>
              <p className="section-subtitle mb-0">Activity data from the Django REST API.</p>
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
              <button className="btn btn-primary btn-sm" type="button" onClick={fetchActivities}>
                Refresh
              </button>
            </div>
          </div>

          <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-8">
              <label className="form-label small text-muted mb-1">Search activities</label>
              <input
                className="form-control"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by user, team, or type"
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

          {loading && <p className="mb-0">Loading activities...</p>}
          {error && <div className="alert alert-danger mb-0">{error}</div>}

          {!loading && !error && (
            <div className="table-wrap">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '24%' }}>User</th>
                      <th style={{ width: '24%' }}>Team</th>
                      <th style={{ width: '20%' }}>Type</th>
                      <th style={{ width: '16%' }}>Duration</th>
                      <th style={{ width: '16%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <tr key={activity.id ?? `${activity.user}-${activity.type}`}>
                          <td>{activity.user}</td>
                          <td>{activity.team}</td>
                          <td>{activity.type}</td>
                          <td>{activity.duration} min</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              type="button"
                              onClick={() => setSelectedActivity(activity)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No activities available.
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

      {selectedActivity && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">Activity Details</h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedActivity(null)}
                />
              </div>
              <div className="modal-body">
                <pre className="mb-0 small">{JSON.stringify(selectedActivity, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedActivity(null)}
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

export default Activities;