import { useState } from 'react';
import { PHeading, PText, PTag, PIcon, PTabs, PTabsItem } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { Email, Priority } from '../types';

const priorityVariant: Record<Priority, 'error' | 'warning' | 'info' | 'secondary'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'secondary',
};

function EmailListItem({ email, selected, onClick }: { email: Email; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-static-sm rounded border transition-colors ${selected ? 'border-primary bg-surface' : 'border-transparent hover:bg-surface'} ${!email.isRead ? 'border-l-2 border-l-primary' : ''}`}
      style={{ background: selected ? undefined : 'transparent', cursor: 'pointer' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {!email.isRead && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--p-color-primary)' }} />}
            <PText size="xx-small" weight={email.isRead ? 'regular' : 'semi-bold'} ellipsis>{email.sender}</PText>
          </div>
          <PText size="x-small" weight={email.isRead ? 'regular' : 'semi-bold'} ellipsis>{email.subject}</PText>
          {email.summary && <PText size="xx-small" color="contrast-medium" ellipsis>{email.summary}</PText>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <PText size="xx-small" color="contrast-medium">
            {new Date(email.receivedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </PText>
          <PTag variant={priorityVariant[email.priority]} compact>{email.priority}</PTag>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        {email.aiClassified && <PTag color="background-frosted" icon="ai-spark" compact>AI</PTag>}
        {email.requiresFollowUp && <PTag variant="warning" compact>Follow-up</PTag>}
        {email.labels.map(l => <PTag key={l} compact>{l}</PTag>)}
      </div>
    </button>
  );
}

function EmailDetail({ email }: { email: Email }) {
  return (
    <div className="space-y-fluid-sm">
      <div>
        <PHeading size="small" tag="h3">{email.subject}</PHeading>
        <div className="flex items-center gap-3 mt-1">
          <PText size="xx-small" color="contrast-medium">From: <strong>{email.sender}</strong> &lt;{email.senderEmail}&gt;</PText>
          <PText size="xx-small" color="contrast-medium">{new Date(email.receivedAt).toLocaleString()}</PText>
        </div>
      </div>

      {email.summary && (
        <div className="p-static-sm rounded border" style={{ background: 'var(--p-color-notification-info-soft)', borderColor: 'var(--p-color-notification-info)' }}>
          <div className="flex items-center gap-2 mb-1">
            <PIcon name="ai-spark" color="notification-info" size="small" />
            <PText size="xx-small" weight="semi-bold" color="notification-info">AI Summary</PText>
          </div>
          <PText size="x-small">{email.summary}</PText>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <PTag variant={priorityVariant[email.priority]}>{email.priority.toUpperCase()} PRIORITY</PTag>
        <PTag compact>{email.category}</PTag>
        {email.requiresFollowUp && <PTag variant="warning" icon="exclamation">Follow-up Required</PTag>}
        {email.aiClassified && <PTag color="background-frosted" icon="ai-spark">AI Classified</PTag>}
        {email.labels.map(l => <PTag key={l} compact>{l}</PTag>)}
      </div>

      <div className="p-fluid-md rounded border border-contrast-low bg-canvas">
        <PText size="x-small" tag="p" style={{ lineHeight: 1.7 }}>{email.body}</PText>
      </div>
    </div>
  );
}

interface Props { state: AppState }

export default function EmailIntelligence({ state }: Props) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(state.emails[0] ?? null);
  const [activeTab, setActiveTab] = useState(0);

  const unread = state.emails.filter(e => !e.isRead);
  const requiresAction = state.emails.filter(e => e.requiresFollowUp);
  const critical = state.emails.filter(e => e.priority === 'critical');

  const stats = [
    { label: 'Total', value: state.emails.length, color: 'var(--p-color-primary)' },
    { label: 'Unread', value: unread.length, color: 'var(--p-color-notification-info)' },
    { label: 'Action Required', value: requiresAction.length, color: 'var(--p-color-notification-warning)' },
    { label: 'Critical', value: critical.length, color: 'var(--p-color-notification-error)' },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-fluid-md gap-fluid-sm">
      {/* Stats */}
      <div className="flex items-center gap-4">
        <PHeading size="medium" tag="h2">Email Intelligence</PHeading>
        <PTag color="background-frosted" icon="ai-spark">AI Classification Active</PTag>
        <div className="ml-auto flex gap-3">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1 rounded border border-contrast-low bg-surface">
              <PText size="large" weight="bold" color="inherit" style={{ color }}>{value}</PText>
              <PText size="xx-small" color="contrast-medium">{label}</PText>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-4">
        {/* Email list */}
        <aside className="w-80 shrink-0 flex flex-col bg-surface rounded-lg border border-contrast-low overflow-hidden">
          <PTabs activeTabIndex={activeTab} onUpdate={e => setActiveTab(e.detail.activeTabIndex)} size="small">
            <PTabsItem label={`All (${state.emails.length})`}>
              <div className="overflow-y-auto p-static-xs space-y-1">
                {state.emails.map(e => <EmailListItem key={e.id} email={e} selected={selectedEmail?.id === e.id} onClick={() => setSelectedEmail(e)} />)}
              </div>
            </PTabsItem>
            <PTabsItem label={`Action (${requiresAction.length})`}>
              <div className="overflow-y-auto p-static-xs space-y-1">
                {requiresAction.map(e => <EmailListItem key={e.id} email={e} selected={selectedEmail?.id === e.id} onClick={() => setSelectedEmail(e)} />)}
              </div>
            </PTabsItem>
          </PTabs>
        </aside>

        {/* Email detail */}
        <main className="flex-1 overflow-y-auto bg-surface rounded-lg border border-contrast-low p-fluid-md">
          {selectedEmail ? (
            <EmailDetail email={selectedEmail} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <PIcon name="email" size="large" color="contrast-medium" />
              <PText color="contrast-medium">Select an email to view</PText>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
