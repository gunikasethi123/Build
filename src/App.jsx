
import { useState, useEffect } from 'react';

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Paperclip,
  CalendarDays,
  ChartNoAxesCombined,
  Activity,
  Settings,
  Bell,
  Search,
  Plus,
  Sparkles
} from 'lucide-react';

import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

import { useWorkspace } from './hooks/useWorkspace.js';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import Tasks from './pages/Tasks.jsx';
import Team from './pages/Team.jsx';
import Files from './pages/Files.jsx';
import CalendarPage from './pages/Calendar.jsx';
import Analytics from './pages/Analytics.jsx';
import ActivityPage from './pages/Activity.jsx';
import SettingsPage from './pages/Settings.jsx';
import { Modal } from './components/Modal.jsx';


function RequireAuth({ children }) {
  const [allowed] = useState(
    () => localStorage.getItem('buildsphere_logged_in') === 'true'
  );

  useEffect(() => {
    if (!allowed) {
      window.location.replace('/login.html');
    }
  }, [allowed]);

  if (!allowed) return null;

  return children;
}


const nav = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'WORKSPACE'
  },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'team', label: 'Team members', icon: Users },
  {
    id: 'files',
    label: 'Files & resources',
    icon: Paperclip,
    group: 'MANAGE'
  },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings }
];


function WorkspaceLayout() {
  const ws = useWorkspace();

  const [search, setSearch] = useState('');
  const [quickAdd, setQuickAdd] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const [profileName, setProfileName] = useState(
    () => localStorage.getItem('buildsphere_name') || 'User'
  );

  const [profileEmail, setProfileEmail] = useState(
    () => localStorage.getItem('buildsphere_email') || ''
  );

  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.split('/')[1] || 'dashboard';
  const title = nav.find(n => n.id === currentPage)?.label || 'Dashboard';

  const profileInitials = profileName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const pageProps = {
    ...ws,
    search,
    setSearch,
    profileName,
    setProfileName,
    profileEmail,
    setProfileEmail,
    navigate: (page) => navigate(`/${page}`)
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">◈</div>
          <div>
            <strong>BuildSphere</strong>
            <span>PROJECT WORKSPACE</span>
          </div>
        </div>

        <div
          className="workspace-switch"
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="workspace-avatar">BS</div>
          <div>
            <b>My workspace</b>
            <small>Personal workspace</small>
          </div>
          <span className="chevrons">
            {workspaceOpen ? '⌃' : '⌄'}
          </span>
        </div>

        {workspaceOpen && (
          <div className="workspace-dropdown">
            <div className="workspace-option">
              <div className="workspace-avatar">BS</div>
              <div>
                <b>My workspace</b>
                <small>Personal workspace</small>
              </div>
              <span>✓</span>
            </div>

            <div className="workspace-dropdown-footer">
              Your personal project space
            </div>
          </div>
        )}

        {['WORKSPACE', 'MANAGE'].map(group => (
          <div className="nav-group" key={group}>
            <p>{group}</p>

            {nav.filter(
              n => (n.group || 'MANAGE') === group
            ).map(item => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={`/${item.id}`}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>

                  {item.id === 'tasks' &&
                    ws.tasks.filter(
                      t => t.status !== 'Completed'
                    ).length > 0 && (
                      <em>
                        {
                          ws.tasks.filter(
                            t => t.status !== 'Completed'
                          ).length
                        }
                      </em>
                    )}
                </NavLink>
              );
            })}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={18} />
            </div>

            <b>Make ideas happen</b>
            <p>Keep your next milestone moving.</p>

            <button onClick={() => navigate('/projects')}>
              Explore projects <span>↗</span>
            </button>
          </div>

          <div className="profile-row">
            <div className="profile-avatar">
              {profileInitials}
            </div>

            <div>
              <b>{profileName}</b>
              <small>Workspace admin</small>
            </div>

            <button
              title="Settings"
              onClick={() => navigate('/settings')}
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <b>{title}</b>
          </div>

          <div className="top-actions">
            <label className="search-box">
              <Search size={16} />

              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search anything..."
              />

              <kbd>⌘ K</kbd>
            </label>

            <button
              className="icon-button"
              title="Notifications"
              onClick={() => navigate('/activity')}
            >
              <Bell size={19} />
              <i />
            </button>

            <div className="top-avatar">
              {profileInitials}
            </div>
          </div>
        </header>

        <div className="page-wrap">
          <Routes>
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<Dashboard {...pageProps} />}
            />

            <Route
              path="projects"
              element={<Projects {...pageProps} />}
            />

            <Route
              path="tasks"
              element={<Tasks {...pageProps} />}
            />

            <Route
              path="calendar"
              element={<CalendarPage {...pageProps} />}
            />

            <Route
              path="team"
              element={<Team {...pageProps} />}
            />

            <Route
              path="files"
              element={<Files {...pageProps} />}
            />

            <Route
              path="analytics"
              element={<Analytics {...pageProps} />}
            />

            <Route
              path="activity"
              element={<ActivityPage {...pageProps} />}
            />

            <Route
              path="settings"
              element={<SettingsPage {...pageProps} />}
            />

            <Route
              path="*"
              element={
                <div className="empty-state">
                  Page not found.
                </div>
              }
            />
          </Routes>
        </div>
      </main>

      {quickAdd && (
        <Modal
          title="Quick create"
          onClose={() => setQuickAdd(false)}
        >
          <div className="quick-grid">
            {[
              ['projects', 'New project'],
              ['tasks', 'New task'],
              ['team', 'Add team member'],
              ['files', 'Upload a file']
            ].map(([page, label]) => (
              <button
                key={page}
                className="quick-option"
                onClick={() => {
                  navigate(`/${page}`);
                  setQuickAdd(false);
                  ws.setCreateIntent(page);
                }}
              >
                {label}
                <span>→</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      <button
        className="floating-add"
        title="Quick create"
        onClick={() => setQuickAdd(true)}
      >
        <Plus size={22} />
      </button>
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <RequireAuth>
            <WorkspaceLayout />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
