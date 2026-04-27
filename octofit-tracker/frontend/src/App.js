import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark octofit-navbar shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-semibold octofit-brand">OctoFit Tracker</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octofit-nav"
            aria-controls="octofit-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="octofit-nav">
            <div className="navbar-nav ms-auto gap-lg-2">
              <NavLink
                className={({ isActive }) =>
                  `nav-link octofit-nav-link${isActive ? ' active' : ''}`
                }
                to="/activities"
              >
                Activities
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link octofit-nav-link${isActive ? ' active' : ''}`
                }
                to="/leaderboard"
              >
                Leaderboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link octofit-nav-link${isActive ? ' active' : ''}`
                }
                to="/teams"
              >
                Teams
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link octofit-nav-link${isActive ? ' active' : ''}`
                }
                to="/users"
              >
                Users
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link octofit-nav-link${isActive ? ' active' : ''}`
                }
                to="/workouts"
              >
                Workouts
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="container content-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      <footer className="container pb-4 app-footer small">
        <span className="fw-semibold">OctoFit Tracker</span>
        <span> frontend powered by Bootstrap and React Router.</span>
      </footer>
    </div>
  );
}

export default App;
