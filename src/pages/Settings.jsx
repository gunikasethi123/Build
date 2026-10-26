
import { useState } from 'react';
import {UserRound,Database,Palette,CheckCircle2,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';

export default function SettingsPage({
  projects = [],
  tasks = [],
  members = [],
  files = [],
}) {
  const [name, setName] = useState(
  () => localStorage.getItem('buildsphere_name') || ''
);

const [email, setEmail] = useState(
  () => localStorage.getItem('buildsphere_email') || ''
);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="YOUR PREFERENCES"
        title="Settings"
        description="Manage your workspace profile and preferences."
      />

      <div className="settings-layout">
        {}
        <section className="panel settings-panel">
          <div className="settings-section-head">
            <div className="settings-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Profile</h2>
              <p>Personal details shown in your workspace.</p>
            </div>
          </div>

          
<form
  className="settings-form"
  onSubmit={(e) => {
    e.preventDefault();

    const oldEmail = localStorage.getItem('buildsphere_email') || '';
    const updatedName = name.trim();
    const updatedEmail = email.trim().toLowerCase();

    localStorage.setItem('buildsphere_name', updatedName);
    localStorage.setItem('buildsphere_email', updatedEmail);

    const users = JSON.parse(
      localStorage.getItem('buildsphere_users') || '[]'
    );

    const updatedUsers = users.map((user) =>
      user.email.toLowerCase() === oldEmail.toLowerCase()
        ? { ...user, name: updatedName, email: updatedEmail }
        : user
    );

    localStorage.setItem('buildsphere_users', JSON.stringify(updatedUsers));

    setName(updatedName);
    setEmail(updatedEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }}
>

            <label className="field">
              <span>Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button className="btn btn-primary" type="submit">
              Save profile
            </button>

            {saved && (
              <span className="save-message">
                <CheckCircle2 size={15} />
                Profile saved for this session.
              </span>
            )}
          </form>
        </section>

        {}
        <section className="panel settings-panel">
          <div className="settings-section-head">
            <div className="settings-icon">
              <Database size={19} />
            </div>

            <div>
              <h2>Workspace overview</h2>
              <p>Summary of your workspace items.</p>
            </div>
          </div>

          <div className="connection-row">
            <div>
              <b>Projects</b>
              <small>Workspace projects</small>
            </div>
            <strong>{projects.length}</strong>
          </div>

          <div className="connection-row">
            <div>
              <b>Tasks</b>
              <small>Workspace tasks</small>
            </div>
            <strong>{tasks.length}</strong>
          </div>

          <div className="connection-row">
            <div>
              <b>Team members</b>
              <small>Registered workspace members</small>
            </div>
            <strong>{members.length}</strong>
          </div>

          <div className="connection-row">
            <div>
              <b>Files</b>
              <small>Registered attachments</small>
            </div>
            <strong>{files.length}</strong>
          </div>
        </section>
       </div>
    </>     

  );
}
