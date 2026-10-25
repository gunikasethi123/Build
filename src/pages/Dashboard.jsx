
import {
  ArrowUpRight,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Users,
  CalendarClock,
  MoreHorizontal,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const dateLabel = (date) =>
  date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'No deadline';

export default function Dashboard({
  projects,
  tasks,
  members,
  metrics,
  progressFor,
  navigate,
  activity,
}) {
  const upcoming = [...tasks]
    .filter((task) => task.status !== 'Completed' && task.due_date)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);

  const recent = activity.slice(0, 4);

  const stats = [
    {
      label: 'Total projects',
      value: metrics.projectCount,
      caption: `${projects.filter((project) => project.status === 'In Progress').length} currently active`,
      icon: FolderKanban,
      tint: 'violet',
    },
    {
      label: 'Active tasks',
      value: metrics.activeTasks,
      caption: `${metrics.completedTasks} completed so far`,
      icon: CheckCircle2,
      tint: 'blue',
    },
    {
      label: 'Upcoming deadlines',
      value: metrics.upcoming,
      caption: `${metrics.overdue} overdue tasks`,
      icon: CalendarClock,
      tint: 'orange',
    },
    {
      label: 'Team members',
      value: metrics.members,
      caption: 'People in your workspace',
      icon: Users,
      tint: 'green',
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="YOUR WORKSPACE"
        title="Good morning, Gunika ✨"
        description="Here’s what’s happening with your projects today."
        actionLabel="New project"
        onAction={() => navigate('projects')}
      />

      <div className="welcome-banner">
        <div>
          <span className="banner-kicker">
            YOUR NEXT BIG THING STARTS HERE
          </span>

          <h2>
            Ideas move forward
            <br />
            when work comes together.
          </h2>

          <p>
            Keep your plans, people and progress in one calm workspace.
          </p>

          <button
            className="btn btn-light"
            onClick={() => navigate('projects')}
          >
            Explore projects
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="banner-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-center">◈</div>
          <div className="art-chip chip-one">✓ On track</div>
          <div className="art-chip chip-two">✦ Make it happen</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.tint}`}>
              <stat.icon size={20} />
            </div>

            <span className="stat-label">{stat.label}</span>

            <div className="stat-value">
              {stat.value.toString().padStart(2, '0')}
            </div>

            <div className="stat-caption">{stat.caption}</div>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel project-panel">
          <div className="panel-heading">
            <div>
              <h2>Projects in motion</h2>
              <p>A quick look at what you’re building.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate('projects')}
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="project-list">
            {projects.slice(0, 4).map((project, index) => (
              <div className="project-row" key={project.id}>
                <div className={`project-symbol symbol-${index % 4}`}>
                  {project.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="project-main">
                  <div className="project-name-line">
                    <b>{project.name}</b>
                    <StatusBadge>{project.status}</StatusBadge>
                  </div>

                  <div className="progress-line">
                    <div className="progress-track">
                      <span
                        style={{
                          width: `${progressFor(project.id)}%`,
                        }}
                      />
                    </div>

                    <small>{progressFor(project.id)}%</small>
                  </div>

                  <div className="project-meta">
                    Due {dateLabel(project.due_date)}
                  </div>
                </div>

                <button
                  className="icon-button small"
                  onClick={() => navigate('projects')}
                >
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel deadlines-panel">
          <div className="panel-heading">
            <div>
              <h2>Coming up</h2>
              <p>Stay ahead of your deadlines.</p>
            </div>

            <button
              className="icon-button small"
              onClick={() => navigate('calendar')}
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          {upcoming.length ? (
            upcoming.map((task) => (
              <div className="deadline-row" key={task.id}>
                <div className="deadline-date">
                  <b>
                    {new Date(
                      `${task.due_date}T12:00:00`
                    ).getDate()}
                  </b>

                  <small>
                    {new Date(
                      `${task.due_date}T12:00:00`
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </small>
                </div>

                <div className="deadline-copy">
                  <b>{task.title}</b>

                  <small>
                    {projects.find(
                      (project) => project.id === task.project_id
                    )?.name || 'Workspace task'}
                  </small>
                </div>

                <span className="deadline-dot" />
              </div>
            ))
          ) : (
            <div className="inline-empty">
              No upcoming deadlines — nice work!
            </div>
          )}

          <button
            className="panel-footer-link"
            onClick={() => navigate('tasks')}
          >
            Open task manager
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Little steps add up.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate('activity')}
            >
              See activity
              <ArrowRight size={15} />
            </button>
          </div>

          {recent.map((item) => (
            <div className="activity-row" key={item.id}>
              <span className="activity-dot" />

              <div>
                <b>{item.message}</b>

                <small>
                  {new Date(item.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </small>
              </div>
            </div>
          ))}
        </section>

        <section className="panel team-preview">
          <div className="panel-heading">
            <div>
              <h2>Your people</h2>
              <p>Great work happens together.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate('team')}
            >
              Team
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="member-stack">
            {members.slice(0, 5).map((member, index) => (
              <div
                className={`member-avatar avatar-${index % 5}`}
                key={member.id}
                title={member.name}
              >
                {member.name
                  .split(' ')
                  .map((name) => name[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            ))}

            <button
              onClick={() => navigate('team')}
              className="member-add"
            >
              +
            </button>
          </div>

          <h3>{members.length} people in your workspace</h3>

          <p className="muted">
            Share the load, celebrate the wins.
          </p>
        </section>
      </div>
    </>
  );
}
