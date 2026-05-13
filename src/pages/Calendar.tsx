import { PHeading, PText, PTag, PIcon } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { CalendarEvent } from '../types';

const typeColors: Record<CalendarEvent['type'], string> = {
  meeting: 'var(--p-color-notification-error)',
  reminder: 'var(--p-color-notification-warning)',
  deadline: 'var(--p-color-notification-error)',
  followup: 'var(--p-color-notification-info)',
};

const typeVariant: Record<CalendarEvent['type'], 'error' | 'warning' | 'info' | 'secondary'> = {
  meeting: 'error', reminder: 'warning', deadline: 'error', followup: 'info',
};

const sourceIcon: Record<CalendarEvent['source'], string> = {
  google: 'logo-google', outlook: 'globe', system: 'ai-spark',
};

function CalendarEventCard({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex items-start gap-3 p-static-sm rounded border border-contrast-low bg-canvas" style={{ borderLeft: `3px solid ${typeColors[event.type]}` }}>
      <div className="flex flex-col items-center shrink-0 w-10 text-center">
        <PText size="xx-small" color="contrast-medium">
          {new Date(event.start).toLocaleDateString('en-US', { month: 'short' })}
        </PText>
        <PText size="medium" weight="bold">
          {new Date(event.start).getDate()}
        </PText>
      </div>
      <div className="flex-1 min-w-0">
        <PText size="x-small" weight="semi-bold" ellipsis>{event.title}</PText>
        <PText size="xx-small" color="contrast-medium">
          {new Date(event.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} –{' '}
          {new Date(event.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </PText>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <PTag variant={typeVariant[event.type]} compact>{event.type}</PTag>
        <PIcon name={sourceIcon[event.source] as Parameters<typeof PIcon>[0]['name']} size="small" color="contrast-medium" />
      </div>
    </div>
  );
}

function WeekCalendar({ events }: { events: CalendarEvent[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date('2026-05-11');
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 7);

  const getEventsForDay = (day: Date) =>
    events.filter(e => new Date(e.start).toDateString() === day.toDateString());

  return (
    <div className="bg-surface rounded-lg border border-contrast-low overflow-hidden">
      {/* Day headers */}
      <div className="grid border-b border-contrast-low" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        <div className="p-2 border-r border-contrast-low" />
        {days.map((day, i) => {
          const isToday = day.toDateString() === new Date('2026-05-13').toDateString();
          return (
            <div key={i} className={`p-2 text-center border-r border-contrast-low ${isToday ? 'bg-primary' : ''}`}>
              <PText size="xx-small" color={isToday ? 'inherit' : 'contrast-medium'} theme={isToday ? 'dark' : 'light'}>
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </PText>
              <PText size="x-small" weight={isToday ? 'bold' : 'regular'} theme={isToday ? 'dark' : 'light'}>
                {day.getDate()}
              </PText>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {hours.map(hour => (
          <div key={hour} className="grid border-b border-contrast-low" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '48px' }}>
            <div className="p-1 border-r border-contrast-low flex items-start justify-end pr-2">
              <PText size="xx-small" color="contrast-medium">{hour}:00</PText>
            </div>
            {days.map((day, i) => {
              const dayEvents = getEventsForDay(day).filter(e => new Date(e.start).getHours() === hour);
              return (
                <div key={i} className="border-r border-contrast-low p-0.5">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="rounded px-1 py-0.5 text-white text-xs truncate" style={{ background: typeColors[ev.type] }}>
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props { state: AppState }

export default function Calendar({ state }: Props) {
  const today = new Date('2026-05-13');
  const todayEvents = state.calendarEvents.filter(e => new Date(e.start).toDateString() === today.toDateString());
  const upcomingEvents = state.calendarEvents.filter(e => new Date(e.start) > today).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-fluid-md gap-fluid-sm">
      <div className="flex items-center justify-between">
        <PHeading size="medium" tag="h2">Calendar</PHeading>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <PIcon name="logo-google" size="small" />
            <PTag variant="success" compact>Google Connected</PTag>
          </div>
          <div className="flex items-center gap-2">
            <PIcon name="globe" size="small" />
            <PTag variant="success" compact>Outlook Connected</PTag>
          </div>
          <PTag color="background-frosted" icon="ai-spark" compact>Auto-Sync Active</PTag>
        </div>
      </div>

      <WeekCalendar events={state.calendarEvents} />

      <div className="flex gap-fluid-sm overflow-hidden">
        <section className="flex-1 overflow-y-auto bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="clock" color="primary" />
            <PHeading size="small" tag="h3">Today</PHeading>
          </div>
          <div className="space-y-2">
            {todayEvents.length === 0 ? (
              <PText color="contrast-medium" size="x-small">No events today</PText>
            ) : (
              todayEvents.map(e => <CalendarEventCard key={e.id} event={e} />)
            )}
          </div>
        </section>

        <section className="flex-1 overflow-y-auto bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="arrow-right" color="primary" />
            <PHeading size="small" tag="h3">Upcoming</PHeading>
          </div>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <PText color="contrast-medium" size="x-small">No upcoming events</PText>
            ) : (
              upcomingEvents.map(e => <CalendarEventCard key={e.id} event={e} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
