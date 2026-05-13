import { PHeading, PText, PTag, PIcon, PInlineNotification, PSpinner } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { Priority } from '../types';

const priorityVariant: Record<Priority, 'error' | 'warning' | 'info' | 'secondary'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'secondary',
};

interface Props { state: AppState }

export default function TodaysPlan({ state }: Props) {
  const { briefing, tasks, meetings } = state;
  const todayMeetings = meetings.filter(m => m.status === 'scheduled' && m.date.startsWith('2026-05-13'));
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const dueTodayTasks = tasks.filter(t => t.dueDate === '2026-05-13' && t.status !== 'completed');

  if (!briefing) return (
    <div className="flex-1 flex items-center justify-center">
      <PSpinner size="large" aria={{ 'aria-label': 'Generating Today\'s Plan' }} />
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-fluid-md space-y-fluid-md">
      {/* AI Summary Banner */}
      <div className="rounded-lg p-fluid-md border border-contrast-low" style={{ background: 'var(--p-color-notification-info-soft)' }}>
        <div className="flex items-start gap-3">
          <PIcon name="ai-spark-filled" color="notification-info" size="medium" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <PHeading size="small" tag="h2">AI Executive Summary</PHeading>
              <PTag color="background-frosted" icon="ai-spark">AI-generated</PTag>
            </div>
            <PText color="contrast-high">{briefing.summary}</PText>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-fluid-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Today's Priorities */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="exclamation-filled" color="primary" />
            <PHeading size="small" tag="h3">Today's Priorities</PHeading>
          </div>
          <div className="space-y-3">
            {briefing.priorities.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-static-sm rounded border border-contrast-low bg-canvas">
                <PTag variant={priorityVariant[item.priority]} compact>{item.priority.toUpperCase()}</PTag>
                <div className="flex-1 min-w-0">
                  <PText size="x-small" weight="semi-bold" ellipsis>{item.title}</PText>
                  <PText size="xx-small" color="contrast-medium">{item.description}</PText>
                </div>
                <PIcon
                  name={item.type === 'meeting' ? 'chat' : item.type === 'task' ? 'check' : 'exclamation'}
                  size="small"
                  color="contrast-medium"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Task Summary */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="check" color="primary" />
            <PHeading size="small" tag="h3">Task Overview</PHeading>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-fluid-sm">
            {[
              { label: 'Total', value: briefing.taskSummary.total, color: 'var(--p-color-primary)' },
              { label: 'Overdue', value: briefing.taskSummary.overdue, color: 'var(--p-color-notification-error)' },
              { label: 'Due Today', value: briefing.taskSummary.dueToday, color: 'var(--p-color-notification-warning)' },
              { label: 'In Progress', value: briefing.taskSummary.inProgress, color: 'var(--p-color-notification-info)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-static-sm rounded border border-contrast-low bg-canvas text-center">
                <PText size="large" weight="bold" color="inherit" style={{ color }}>{value}</PText>
                <PText size="xx-small" color="contrast-medium">{label}</PText>
              </div>
            ))}
          </div>

          {overdueTasks.length > 0 && (
            <PInlineNotification
              heading={`${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`}
              description={overdueTasks.map(t => t.title).join(', ')}
              state="warning"
              dismissButton={false}
            />
          )}
        </section>

        {/* Today's Meetings */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="chat" color="primary" />
            <PHeading size="small" tag="h3">Today's Meetings</PHeading>
          </div>
          {todayMeetings.length === 0 ? (
            <PText color="contrast-medium" size="x-small">No meetings scheduled today</PText>
          ) : (
            <div className="space-y-3">
              {todayMeetings.map(meeting => (
                <div key={meeting.id} className="p-static-sm rounded border border-contrast-low bg-canvas">
                  <div className="flex items-start justify-between gap-2">
                    <PText size="x-small" weight="semi-bold">{meeting.title}</PText>
                    <PTag variant={priorityVariant[meeting.priority]} compact>{meeting.priority}</PTag>
                  </div>
                  <PText size="xx-small" color="contrast-medium">
                    {new Date(meeting.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {meeting.duration} min · {meeting.participants.length} participants
                  </PText>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Email Summary */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="email" color="primary" />
            <PHeading size="small" tag="h3">Email Intelligence</PHeading>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-fluid-sm">
            {[
              { label: 'Unread', value: briefing.emailSummary.unread, color: 'var(--p-color-primary)' },
              { label: 'Action Required', value: briefing.emailSummary.requiresAction, color: 'var(--p-color-notification-warning)' },
              { label: 'High Priority', value: briefing.emailSummary.highPriority, color: 'var(--p-color-notification-error)' },
              { label: 'Total Today', value: briefing.emailSummary.total, color: 'var(--p-color-contrast-high)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-static-sm rounded border border-contrast-low bg-canvas text-center">
                <PText size="large" weight="bold" color="inherit" style={{ color }}>{value}</PText>
                <PText size="xx-small" color="contrast-medium">{label}</PText>
              </div>
            ))}
          </div>
        </section>

        {/* Due Today Tasks */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md" style={{ gridColumn: '1 / -1' }}>
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="clock" color="primary" />
            <PHeading size="small" tag="h3">Due Today</PHeading>
          </div>
          <div className="space-y-2">
            {dueTodayTasks.length === 0 ? (
              <PText color="contrast-medium" size="x-small">No tasks due today</PText>
            ) : (
              dueTodayTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-static-sm rounded border border-contrast-low bg-canvas">
                  <PTag variant={priorityVariant[task.priority]} compact>{task.priority}</PTag>
                  <div className="flex-1 min-w-0">
                    <PText size="x-small" weight="semi-bold" ellipsis>{task.title}</PText>
                    <PText size="xx-small" color="contrast-medium">{task.owner}</PText>
                  </div>
                  {task.aiGenerated && <PTag color="background-frosted" icon="ai-spark" compact>AI</PTag>}
                  <div className="flex gap-1">
                    {task.tags.slice(0, 2).map(tag => (
                      <PTag key={tag} compact>{tag}</PTag>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Market Summary */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md" style={{ gridColumn: '1 / -1' }}>
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="chart" color="primary" />
            <PHeading size="small" tag="h3">Market Snapshot</PHeading>
          </div>
          <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {briefing.marketData.map(m => (
              <div key={m.symbol} className="p-static-sm rounded border border-contrast-low bg-canvas">
                <div className="flex items-center justify-between">
                  <PText size="xx-small" weight="bold">{m.symbol}</PText>
                  <PTag variant={m.change >= 0 ? 'success' : 'error'} compact>
                    {m.change >= 0 ? '+' : ''}{m.changePercent.toFixed(2)}%
                  </PTag>
                </div>
                <PText size="x-small" weight="semi-bold">{m.value.toLocaleString()}</PText>
                <PText size="xx-small" color="contrast-medium">{m.name}</PText>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
