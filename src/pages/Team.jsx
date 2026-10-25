
import { useMemo, useState } from 'react';
import {
  Mail,
  UserRoundPlus,
  Trash2,
  Search,
  ShieldCheck,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';
import { Modal, Field } from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';

const blank = {
  name: '',
  email: '',
  role: 'Member',
};

export default function Team({
  members,
  tasks,
  addMember,
  deleteMember,
  search,
  setSearch,
  createIntent,
  setCreateIntent,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const start = () => {
    setForm(blank);
    setOpen(true);
    setCreateIntent('');
  };

  const visible = useMemo(
    () =>
      members.filter((m) =>
        `${m.name} ${m.email} ${m.role}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [members, search]
  );

  const submit = (e) => {
    e.preventDefault();

    if (
      members.some(
        (m) => m.email.toLowerCase() === form.email.toLowerCase()
      )
    ) {
      alert('A member with this email already exists.');
      return;
    }

    addMember(form);
    setOpen(false);
    setForm(blank);
  };

  return (
    <>
      <PageHeader
        eyebrow="PEOPLE & COLLABORATION"
        title="Team members"
        description="Bring the right people into the right work."
        actionLabel="Add member"
        onAction={start}
      />

      {createIntent === 'team' && (
        <div className="notice-bar">
          Add someone to the workspace.{' '}
          <button onClick={start}>Open member form →</button>
        </div>
      )}

      <div className="toolbar">
        <label className="search-box">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a teammate..."
          />
        </label>

        <span className="result-count">
          {visible.length} members
        </span>
      </div>

      {visible.length > 0 ? (
        <div className="team-grid">
          {visible.map((m, i) => (
            <article className="team-card" key={m.id}>
              <div className={`team-avatar avatar-${i % 5}`}>
                {m.name
                  .split(' ')
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join('')}
              </div>

              <h3>{m.name}</h3>

              <p className="team-email">
                <Mail size={14} />
                {m.email}
              </p>

              <span className="role-pill">
                <ShieldCheck size={14} />
                {m.role}
              </span>

              <div className="team-card-stats">
                <div>
                  <b>
                    {
                      tasks.filter(
                        (t) => t.assignee_id === m.id
                      ).length
                    }
                  </b>
                  <small>Assigned tasks</small>
                </div>

                <div>
                  <b>
                    {
                      tasks.filter(
                        (t) =>
                          t.assignee_id === m.id &&
                          t.status === 'Completed'
                      ).length
                    }
                  </b>
                  <small>Completed</small>
                </div>
              </div>

              <button
                className="btn btn-secondary full-btn"
                onClick={() => {
                  if (
                    confirm(
                      `Remove ${m.name} from this workspace?`
                    )
                  ) {
                    deleteMember(m.id);
                  }
                }}
              >
                <Trash2 size={15} />
                Remove member
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No team members found"
          description="Add a teammate or change your search."
        />
      )}

      {open && (
        <Modal
          title="Add a team member"
          onClose={() => setOpen(false)}
        >
          <form className="form-grid" onSubmit={submit}>
            <Field label="Full name" wide>
              <input
                required
                autoFocus
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g. Aanya Kapoor"
              />
            </Field>

            <Field label="Email address" wide>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="name@example.com"
              />
            </Field>

            <Field label="Workspace role" wide>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                {['Admin', 'Project Lead', 'Member', 'Viewer'].map(
                  (role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  )
                )}
              </select>
            </Field>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button className="btn btn-primary" type="submit">
                <UserRoundPlus size={16} />
                Add member
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
