import { PHeading, PText, PTag, PIcon, PDivider } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { Priority } from '../types';

const priorityVariant: Record<Priority, 'error' | 'warning' | 'info' | 'secondary'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'secondary',
};

const relevanceColor = { high: 'var(--p-color-notification-error)', medium: 'var(--p-color-notification-warning)', low: 'var(--p-color-contrast-medium)' };

interface Props { state: AppState }

export default function DailyBriefing({ state }: Props) {
  const { briefing } = state;

  if (!briefing) return (
    <div className="flex-1 flex items-center justify-center">
      <PText color="contrast-medium">Generating briefing...</PText>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-fluid-md space-y-fluid-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <PHeading size="large" tag="h1">Executive Briefing</PHeading>
            <PTag color="background-frosted" icon="ai-spark">AI-generated</PTag>
          </div>
          <PText size="x-small" color="contrast-medium">
            {new Date(briefing.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Delivered automatically at 06:00 CET
          </PText>
        </div>
        <div className="flex gap-2 shrink-0">
          <PTag variant="success" icon="check">Delivered</PTag>
          <PTag compact>Email Sent</PTag>
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-lg p-fluid-md" style={{ background: 'var(--p-color-background-surface)', border: '1px solid var(--p-color-contrast-low)' }}>
        <div className="flex items-center gap-2 mb-3">
          <PIcon name="ai-spark-filled" color="primary" />
          <PHeading size="small" tag="h2">AI Executive Summary</PHeading>
        </div>
        <PText size="medium" color="contrast-high">{briefing.summary}</PText>
      </div>

      <div className="grid gap-fluid-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Today's Priorities */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="exclamation-filled" color="primary" />
            <PHeading size="small" tag="h3">Priority Focus</PHeading>
          </div>
          <div className="space-y-2">
            {briefing.priorities.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-static-sm rounded border border-contrast-low bg-canvas">
                <PTag variant={priorityVariant[item.priority]} compact>{item.priority.toUpperCase()}</PTag>
                <div className="flex-1 min-w-0">
                  <PText size="x-small" weight="semi-bold">{item.title}</PText>
                  <PText size="xx-small" color="contrast-medium">{item.description}</PText>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market Data */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="chart" color="primary" />
            <PHeading size="small" tag="h3">Markets Overview</PHeading>
          </div>
          <div className="space-y-3">
            {briefing.marketData.map(m => (
              <div key={m.symbol}>
                <div className="flex items-center justify-between">
                  <div>
                    <PText size="x-small" weight="semi-bold">{m.symbol}</PText>
                    <PText size="xx-small" color="contrast-medium">{m.name}</PText>
                  </div>
                  <div className="text-right">
                    <PText size="x-small" weight="semi-bold">{m.value.toLocaleString()}</PText>
                    <PTag variant={m.change >= 0 ? 'success' : 'error'} compact>
                      {m.change >= 0 ? '+' : ''}{m.changePercent.toFixed(2)}%
                    </PTag>
                  </div>
                </div>
                <PDivider />
              </div>
            ))}
          </div>
        </section>

        {/* News */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="news" color="primary" />
            <PHeading size="small" tag="h3">Relevant News</PHeading>
          </div>
          <div className="space-y-3">
            {briefing.newsItems.map(news => (
              <div key={news.id} className="p-static-sm rounded border border-contrast-low bg-canvas">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: relevanceColor[news.relevance] }} />
                  <div>
                    <PText size="x-small" weight="semi-bold">{news.title}</PText>
                    <div className="flex items-center gap-2 mt-1">
                      <PText size="xx-small" color="contrast-medium">{news.source}</PText>
                      <PTag compact>{news.category}</PTag>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Metrics */}
        <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
          <div className="flex items-center gap-2 mb-fluid-sm">
            <PIcon name="aggregation" color="primary" />
            <PHeading size="small" tag="h3">Executive Metrics</PHeading>
          </div>

          <PText size="xx-small" weight="semi-bold" color="contrast-medium" tag="p" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Tasks</PText>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Total', value: briefing.taskSummary.total },
              { label: 'Overdue', value: briefing.taskSummary.overdue, alert: briefing.taskSummary.overdue > 0 },
              { label: 'Due Today', value: briefing.taskSummary.dueToday },
            ].map(({ label, value, alert }) => (
              <div key={label} className="p-static-xs rounded border border-contrast-low bg-canvas text-center">
                <PText size="medium" weight="bold" color={alert ? 'notification-error' : 'primary'}>{value}</PText>
                <PText size="xx-small" color="contrast-medium">{label}</PText>
              </div>
            ))}
          </div>

          <PText size="xx-small" weight="semi-bold" color="contrast-medium" tag="p" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Emails</PText>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Unread', value: briefing.emailSummary.unread },
              { label: 'Action', value: briefing.emailSummary.requiresAction, alert: briefing.emailSummary.requiresAction > 0 },
              { label: 'Critical', value: briefing.emailSummary.highPriority, alert: briefing.emailSummary.highPriority > 0 },
            ].map(({ label, value, alert }) => (
              <div key={label} className="p-static-xs rounded border border-contrast-low bg-canvas text-center">
                <PText size="medium" weight="bold" color={alert ? 'notification-warning' : 'primary'}>{value}</PText>
                <PText size="xx-small" color="contrast-medium">{label}</PText>
              </div>
            ))}
          </div>

          <PText size="xx-small" weight="semi-bold" color="contrast-medium" tag="p" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Meetings</PText>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Today', value: briefing.meetingSummary.todayCount },
              { label: 'Upcoming', value: briefing.meetingSummary.upcomingCount },
              { label: 'Pending MOM', value: briefing.meetingSummary.pendingMOMCount, alert: briefing.meetingSummary.pendingMOMCount > 0 },
            ].map(({ label, value, alert }) => (
              <div key={label} className="p-static-xs rounded border border-contrast-low bg-canvas text-center">
                <PText size="medium" weight="bold" color={alert ? 'notification-warning' : 'primary'}>{value}</PText>
                <PText size="xx-small" color="contrast-medium">{label}</PText>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
