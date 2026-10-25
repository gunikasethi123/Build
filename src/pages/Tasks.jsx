
import { useMemo, useState } from 'react';

import {
  Search,
  MessageCircle,
  Trash2,
  CalendarDays,
  ListTodo,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';
import { Modal, Field } from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';

const blank = {
  title: '',
  description: '',
  project_id: '',
  assignee_id: '',
  status: 'To Do',
  priority: 'Medium',
  due_date: '',
};

export default function Tasks({
  tasks,
  projects,
  members,
  addTask,
  updateTask,
  deleteTask,
  comments,
  addComment,
  search,
  setSearch,
  createIntent,
  setCreateIntent,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [filter, setFilter] = useState('All');
  const [commentTask, setCommentTask] = useState(null);
  const [comment, setComment] = useState('');

  const start = () => {
    setEditing(null);
    setForm(blank);
    setOpen(true);
    setCreateIntent('');
  };

  const visible = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (t.title + ' ' + t.description)
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (filter === 'All' || t.status === filter)
      ),
    [tasks, search, filter]
  );

  const submit = (e) => {
    e.preventDefault();

    if (editing) {
      updateTask(editing, form);
    } else {
      addTask(form);
    }

    setOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="MAKE PROGRESS"
        title="Tasks"
        description="Turn the next step into a done deal."
        actionLabel="New task"
        onAction={start}
      />

      {createIntent === 'tasks' && (
        <div className="notice-bar">
          Ready to add a task?{' '}
          <button onClick={start}>
            Open task form →
          </button>
        </div>
      )}

      <div className="toolbar">
        <label className="search-box">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
          />
        </label>

        <label className="filter-select">
          <ListTodo size={16} />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {['All', 'To Do', 'In Progress', 'Completed'].map(
              (x) => (
                <option key={x}>{x}</option>
              )
            )}
          </select>
        </label>

        <span className="result-count">
          {visible.length} tasks
        </span>
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="task-title-cell">
                      <span
                        className={`task-check ${
                          t.status === 'Completed' ? 'checked' : ''
                        }`}
                        onClick={() =>
                          updateTask(t.id, {
                            ...t,
                            status:
                              t.status === 'Completed'
                                ? 'To Do'
                                : 'Completed',
                          })
                        }
                      >
                        {t.status === 'Completed' ? '✓' : ''}
                      </span>

                      <div>
                        <b>{t.title}</b>
                        <small>
                          {t.description || 'No description'}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {projects.find(
                      (p) => p.id === t.project_id
                    )?.name || '—'}
                  </td>

                  <td>
                    <span className="assignee-pill">
                      <span className="mini-avatar">
                        {members
                          .find((m) => m.id === t.assignee_id)
                          ?.name?.split(' ')
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join('') || '—'}
                      </span>

                      {members.find(
                        (m) => m.id === t.assignee_id
                      )?.name || 'Unassigned'}
                    </span>
                  </td>

                  <td>
                    <span className="date-cell">
                      <CalendarDays size={14} />
                      {t.due_date || '—'}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`priority priority-${t.priority.toLowerCase()}`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={t.status}
                      onChange={(e) =>
                        updateTask(t.id, {
                          ...t,
                          status: e.target.value,
                        })
                      }
                    >
                      {['To Do', 'In Progress', 'Completed'].map(
                        (s) => (
                          <option key={s}>{s}</option>
                        )
                      )}
                    </select>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-button small"
                        title="Comments"
                        onClick={() => setCommentTask(t)}
                      >
                        <MessageCircle size={16} />
                        <span className="comment-count">
                          {(comments[t.id] || []).length}
                        </span>
                      </button>

                      <button
                        className="icon-button small"
                        title="Edit task"
                        onClick={() => {
                          setEditing(t.id);
                          setForm({ ...t });
                          setOpen(true);
                        }}
                      >
                        <span>✎</span>
                      </button>

                      <button
                        className="danger-icon"
                        title="Delete task"
                        onClick={() => {
                          if (confirm('Delete this task?')) {
                            deleteTask(t.id);
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!visible.length && (
            <EmptyState
              title="No tasks found"
              description="Add a task or change your filters."
            />
          )}
        </div>
      </div>

      {open && (
        <Modal
          title={editing ? 'Edit task' : 'Create a task'}
          onClose={() => setOpen(false)}
        >
          <form className="form-grid" onSubmit={submit}>
            <Field label="Task title" wide>
              <input
                required
                autoFocus
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="What needs to get done?"
              />
            </Field>

            <Field label="Description" wide>
              <textarea
                rows="2"
                value={form.description || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Add details..."
              />
            </Field>

            <Field label="Project">
              <select
                value={form.project_id || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    project_id: e.target.value,
                  })
                }
              >
                <option value="">No project</option>

                {projects.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assign to">
              <select
                value={form.assignee_id || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignee_id: e.target.value,
                  })
                }
              >
                <option value="">Unassigned</option>

                {members.map((m) => (
                  <option value={m.id} key={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                {['To Do', 'In Progress', 'Completed'].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
              >
                {['Low', 'Medium', 'High'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Deadline" wide>
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
                {editing ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {commentTask && (
        <Modal
          title={`Comments · ${commentTask.title}`}
          onClose={() => setCommentTask(null)}
        >
          <div className="comments-list">
            {(comments[commentTask.id] || []).map((c) => (
              <div className="comment-item" key={c.id}>
                <div className="mini-avatar">
                  {c.author
                    .split(' ')
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                <div>
                  <b>{c.author}</b>
                  <p>{c.body}</p>
                  <small>
                    {new Date(c.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}

            {!(comments[commentTask.id] || []).length && (
              <p className="muted">
                No comments yet. Start the conversation.
              </p>
            )}
          </div>

          <form
            className="comment-form"
            onSubmit={(e) => {
              e.preventDefault();

              if (comment.trim()) {
                addComment(commentTask.id, comment);
                setComment('');
              }
            }}
          >
            <textarea
              rows="2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />

            <button className="btn btn-primary">
              Add comment
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
