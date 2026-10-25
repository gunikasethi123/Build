
import {
  ChartNoAxesCombined,
  CircleCheck,
  Clock3,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';

export default function Analytics({
  projects,
  tasks,
  members,
  metrics,
  progressFor,
}) {
  const statuses = ['To Do', 'In Progress', 'Completed'];

  const colors = {
    'To Do': '#a7b0c2',
    'In Progress': '#7c5ce7',
    Completed: '#21a67a',
  };

  const priorities = ['High', 'Medium', 'Low'];

  const max = Math.max(
    1,
    ...statuses.map(
      (status) => tasks.filter((task) => task.status === status).length
    )
  );

  return (
    <>
      <PageHeader
        eyebrow="INSIGHTS & REPORTING"
        title="Analytics"
        description="Understand your team's progress and where attention is needed."
      />

      <div className="stats-grid analytics-stats">
        <article className="stat-card">
          <div className="stat-icon violet">
            <FolderKanban size={20} />
          </div>

          <span className="stat-label">Project completion</span>

          <div className="stat-value">
            {projects.length
              ? Math.round(
                  projects.reduce(
                    (total, project) =>
                      total + progressFor(project.id),
                    0
                  ) / projects.length
                )
              : 0}
            %
          </div>

          <div className="stat-caption">
            Average across projects
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">
            <CircleCheck size={20} />
          </div>

          <span className="stat-label">Tasks completed</span>

          <div className="stat-value">
            {metrics.completedTasks}
          </div>

          <div className="stat-caption">
            {metrics.completion}% of all tasks
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={20} />
          </div>

          <span className="stat-label">Overdue tasks</span>

          <div className="stat-value">
            {metrics.overdue}
          </div>

          <div className="stat-caption">
            Needs attention
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">
            <Clock3 size={20} />
          </div>

          <span className="stat-label">Team members</span>

          <div className="stat-value">
            {members.length}
          </div>

          <div className="stat-caption">
            Across this workspace
          </div>
        </article>
      </div>

      <div className="analytics-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Task status</h2>
              <p>How work is distributed right now.</p>
            </div>

            <ChartNoAxesCombined size={20} />
          </div>

          <div className="bar-chart">
            {statuses.map((status) => {
              const count = tasks.filter(
                (task) => task.status === status
              ).length;

              return (
                <div className="bar-row" key={status}>
                  <div className="bar-label">
                    <span>{status}</span>
                    <b>{count}</b>
                  </div>

                  <div className="bar-track">
                    <div
                      style={{
                        width: `${(count / max) * 100}%`,
                        background: colors[status],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chart-footnote">
            Total tasks <b>{tasks.length}</b>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Priority breakdown</h2>
              <p>See what needs focus first.</p>
            </div>
          </div>

          {priorities.map((priority) => {
            const count = tasks.filter(
              (task) => task.priority === priority
            ).length;

            const background =
              priority === 'High'
                ? '#ef6a6a'
                : priority === 'Medium'
                  ? '#e9a23b'
                  : '#3da78b';

            return (
              <div
                className="priority-analytics"
                key={priority}
              >
                <div className="priority-label">
                  <span
                    className={`priority priority-${priority.toLowerCase()}`}
                  >
                    {priority}
                  </span>

                  <b>{count}</b>
                </div>

                <div className="progress-track">
                  <span
                    style={{
                      width: `${
                        tasks.length
                          ? (count / tasks.length) * 100
                          : 0
                      }%`,
                      background,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="panel project-analytics">
        <div className="panel-heading">
          <div>
            <h2>Project health</h2>
            <p>Progress and task counts by project.</p>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Progress</th>
                <th>Deadline</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <b>{project.name}</b>
                  </td>

                  <td>{project.status}</td>

                  <td>
                    {
                      tasks.filter(
                        (task) =>
                          task.project_id === project.id
                      ).length
                    }
                  </td>

                  <td>
                    <div className="analytics-progress">
                      <div className="progress-track">
                        <span
                          style={{
                            width: `${progressFor(project.id)}%`,
                          }}
                        />
                      </div>

                      <b>{progressFor(project.id)}%</b>
                    </div>
                  </td>

                  <td>{project.due_date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}


