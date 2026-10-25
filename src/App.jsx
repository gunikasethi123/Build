import { useState } from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Paperclip, CalendarDays, ChartNoAxesCombined, Activity, Settings, Menu, Bell, Search, Plus, Sparkles } from 'lucide-react';
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

const nav = [
  { id:'dashboard', label:'Dashboard', icon:LayoutDashboard, group:'WORKSPACE' },
  { id:'projects', label:'Projects', icon:FolderKanban },
  { id:'tasks', label:'Tasks', icon:CheckSquare },
  { id:'calendar', label:'Calendar', icon:CalendarDays },
  { id:'team', label:'Team members', icon:Users },
  { id:'files', label:'Files & resources', icon:Paperclip, group:'MANAGE' },
  { id:'analytics', label:'Analytics', icon:ChartNoAxesCombined },
  { id:'activity', label:'Activity', icon:Activity },
  { id:'settings', label:'Settings', icon:Settings }
];

export default function App() {
  const ws = useWorkspace();
  const [page,setPage] = useState('dashboard');
  const [search,setSearch] = useState('');
  const [quickAdd,setQuickAdd] = useState(false);
  const title = nav.find(n=>n.id===page)?.label || 'Dashboard';
  const pageProps = { ...ws, search, setSearch, navigate:setPage };
  const content = {
    dashboard:<Dashboard {...pageProps} />,
    projects:<Projects {...pageProps} />,
    tasks:<Tasks {...pageProps} />,
    calendar:<CalendarPage {...pageProps} />,
    team:<Team {...pageProps} />,
    files:<Files {...pageProps} />,
    analytics:<Analytics {...pageProps} />,
    activity:<ActivityPage {...pageProps} />,
    settings:<SettingsPage {...pageProps} />
  }[page];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">◈</div><div><strong>BuildSphere</strong><span>PROJECT WORKSPACE</span></div></div>
      <div className="workspace-switch"><div className="workspace-avatar">BS</div><div><b>My workspace</b><small>Personal workspace</small></div><span className="chevrons">⌄</span></div>
      {['WORKSPACE','MANAGE'].map(group=><div className="nav-group" key={group}><p>{group}</p>{nav.filter(n=>(n.group||'MANAGE')===group).map(item=><button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>setPage(item.id)}><item.icon size={18}/><span>{item.label}</span>{item.id==='tasks'&&ws.tasks.filter(t=>t.status!=='Completed').length>0&&<em>{ws.tasks.filter(t=>t.status!=='Completed').length}</em>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={18}/></div><b>Make ideas happen</b><p>Keep your next milestone moving.</p><button onClick={()=>setPage('projects')}>Explore projects <span>↗</span></button></div><div className="profile-row"><div className="profile-avatar">GS</div><div><b>Gunika Sethi</b><small>Workspace admin</small></div><button title="Settings" onClick={()=>setPage('settings')}><Settings size={17}/></button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span>/</span><b>{title}</b></div><div className="top-actions"><label className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label><button className="icon-button" title="Notifications" onClick={()=>setPage('activity')}><Bell size={19}/><i/></button><div className="top-avatar">GS</div></div></header>
      <div className="page-wrap">{content}</div>
    </main>
    {quickAdd&&<Modal title="Quick create" onClose={()=>setQuickAdd(false)}><div className="quick-grid">{[['projects','New project'],['tasks','New task'],['team','Add team member'],['files','Upload a file']].map(([p,l])=><button key={p} className="quick-option" onClick={()=>{setPage(p);setQuickAdd(false);ws.setCreateIntent(p)}}>{l}<span>→</span></button>)}</div></Modal>}
    <button className="floating-add" title="Quick create" onClick={()=>setQuickAdd(true)}><Plus size={22}/></button>
  </div>;
}
