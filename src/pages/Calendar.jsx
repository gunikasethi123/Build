
import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';

export default function CalendarPage({ projects, tasks, navigate }) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));

  const year = month.getFullYear();
  const m = month.getMonth();

  const first = new Date(year, m, 1).getDay();
  const days = new Date(year, m + 1, 0).getDate();

  const events = useMemo(
    () => [
      ...projects
        .filter((project) => project.due_date)
        .map((project) => ({
          id: `p-${project.id}`,
          date: project.due_date,
          title: project.name,
          type: 'Project deadline',
          status: project.status,
        })),

      ...tasks
        .filter((task) => task.due_date)
        .map((task) => ({
          id: `t-${task.id}`,
          date: task.due_date,
          title: task.title,
          type: 'Task deadline',
          status: task.status,
        })),
    ],
    [projects, tasks]
  );

  const eventMap = {};

  events.forEach((event) => {
    const date = new Date(`${event.date}T12:00:00`);

    if (
      date.getFullYear() === year &&
      date.getMonth() === m
    ) {
      (eventMap[date.getDate()] ??= []).push(event);
    }
  });

  const upcoming = events
    .filter(
      (event) =>
        event.date >=
        `${year}-${String(m + 1).padStart(2, '0')}-01`
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7);

  return (
    <>
      <PageHeader
        eyebrow="PLAN AHEAD"
        title="Calendar"
        description="See project milestones and task deadlines at a glance."
      />

      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-head">
            <button
              className="icon-button"
              onClick={() => setMonth(new Date(year, m - 1, 1))}
            >
              <ChevronLeft />
            </button>

            <h2>
              {month.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <button
              className="icon-button"
              onClick={() => setMonth(new Date(year, m + 1, 1))}
            >
              <ChevronRight />
            </button>

            <button
              className="text-button today-button"
              onClick={() => setMonth(new Date())}
            >
              Today
            </button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day) => (
                <div className="weekday" key={day}>
                  {day}
                </div>
              )
            )}

            {Array.from({ length: first }, (_, index) => (
              <div
                className="calendar-day blank"
                key={`b${index}`}
              />
            ))}

            {Array.from({ length: days }, (_, index) => {
              const day = index + 1;
              const list = eventMap[day] || [];
              const today = new Date();

              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === m &&
                today.getDate() === day;

              return (
                <div
                  className={`calendar-day ${
                    isToday ? 'today' : ''
                  } ${list.length ? 'has-events' : ''}`}
                  key={day}
                >
                  <span>{day}</span>

                  {list.slice(0, 2).map((event) => (
                    <button
                      title={event.title}
                      className={`calendar-event ${
                        event.type.startsWith('Project')
                          ? 'event-project'
                          : 'event-task'
                      }`}
                      key={event.id}
                      onClick={() =>
                        navigate(
                          event.type.startsWith('Project')
                            ? 'projects'
                            : 'tasks'
                        )
                      }
                    >
                      {event.title}
                    </button>
                  ))}

                  {list.length > 2 && (
                    <small>+{list.length - 2} more</small>
                  )}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="legend-project" />
              Project deadline
            </span>

            <span>
              <i className="legend-task" />
              Task deadline
            </span>
          </div>
        </section>

        <section className="panel upcoming-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming dates</h2>
              <p>Keep the next step in view.</p>
            </div>

            <CalendarDays size={20} />
          </div>

          {upcoming.map((event) => (
            <div className="upcoming-event" key={event.id}>
              <div
                className={`event-icon ${
                  event.type.startsWith('Project')
                    ? 'purple'
                    : 'blue'
                }`}
              >
                <CalendarDays size={17} />
              </div>

              <div>
                <b>{event.title}</b>
                <small>{event.type}</small>

                <span>
                  {new Date(
                    `${event.date}T12:00:00`
                  ).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}

          {!upcoming.length && (
            <p className="muted">No dates to show.</p>
          )}
        </section>
      </div>
    </>
  );
}
