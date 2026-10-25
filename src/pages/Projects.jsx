
import { useMemo, useState } from 'react';

import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  Pencil,
  Trash2,
  FolderKanban,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';
import { Modal, Field } from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';

const blank = {
  name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  start_date: '',
  due_date: '',
  progress: 0,
};

export default function Projects({
  projects,
  tasks,
  addProject,
  updateProject,
  deleteProject,
  progressFor,
  search,
  setSearch,
  createIntent,
  setCreateIntent,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [form, setForm] = useState(blank);

  const startCreate = () => {
    setEditing(null);
    setForm(blank);
    setOpen(true);
    setCreateIntent('');
  };

  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (p.name + ' ' + p.description)
            .toLowerCase()
            .includes((query || search).toLowerCase()) &&
          (status === 'All' || p.status === status)
      ),
    [projects, query, search, status]
  );

  const edit = (p) => {
    setEditing(p.id);
    setForm({ ...p });
    setOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (editing) {
      updateProject(editing, form);
    } else {
      addProject(form);
    }

    setOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="PLAN & BUILD"
        title="Projects"
        description="Every big idea starts with a plan. Keep yours moving."
        actionLabel="New project"
        onAction={startCreate}
      />

      {createIntent === 'projects' && (
        <div className="notice-bar">
          Ready to create a project?{' '}
          <button onClick={startCreate}>
            Open project form →
          </button>
        </div>
      )}

      <div className="toolbar">
        <label className="search-box">
          <Search size={16} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a project..."
          />
        </label>

        <label className="filter-select">
          <SlidersHorizontal size={16} />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Planning</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </label>

        <span className="result-count">
          {visible.length} projects
        </span>
      </div>

      {visible.length ? (
        <div className="project-cards">
          {visible.map((p, i) => (
            <article className="project-card" key={p.id}>
              <div className="project-card-top">
                <div
                  className={`project-symbol large symbol-${i % 4}`}
                >
                  <FolderKanban size={21} />
                </div>

                <button
                  className="icon-button small"
                  onClick={() => edit(p)}
                  title="Edit project"
                >
                  <Pencil size={16} />
                </button>
              </div>

              <div className="project-card-title">
                <h3>{p.name}</h3>
                <StatusBadge>{p.status}</StatusBadge>
              </div>

              <p className="project-description">
                {p.description || 'No description added yet.'}
              </p>

              <div className="project-card-progress">
                <div>
                  <span>Overall progress</span>
                  <b>{progressFor(p.id)}%</b>
                </div>

                <div className="progress-track">
                  <span
                    style={{
                      width: `${progressFor(p.id)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="project-card-footer">
                <span>
                  <CalendarDays size={15} />
                  {p.due_date || 'No deadline'}
                </span>

                <span
                  className={`priority priority-${p.priority.toLowerCase()}`}
                >
                  {p.priority} priority
                </span>
              </div>

              <div className="project-card-bottom">
                <span>
                  {tasks.filter((t) => t.project_id === p.id).length}{' '}
                  tasks
                </span>

                <div>
                  <button
                    className="text-button"
                    onClick={() => edit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-icon"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) {
                        deleteProject(p.id);
                      }
                    }}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Try another search or create a new project."
        />
      )}

      {open && (
        <Modal
          title={editing ? 'Edit project' : 'Create a project'}
          onClose={() => setOpen(false)}
        >
          <form className="form-grid" onSubmit={submit}>
            <Field label="Project name" wide>
              <input
                required
                autoFocus
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g. Campus Connect"
              />
            </Field>

            <Field label="Description" wide>
              <textarea
                rows="3"
                value={form.description || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="What are you building?"
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                {['Planning', 'In Progress', 'Completed', 'On Hold'].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  )
                )}
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                {['Low', 'Medium', 'High'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>

            <Field label="Start date">
              <input
                type="date"
                value={form.start_date || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Deadline">
              <input
                type="date"
                value={form.due_date || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    due_date: e.target.value,
                  })
                }
              />
            </Field>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button className="btn btn-primary">
                {editing ? 'Save changes' : 'Create project'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
