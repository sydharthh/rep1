import { PHeading, PText, PTag, PIcon, PButton } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { Notification } from '../types';

const typeVariant: Record<Notification['type'], 'success' | 'info' | 'warning' | 'error'> = {
  success: 'success', info: 'info', warning: 'warning', error: 'error',
};

const typeIcons: Record<Notification['type'], string> = {
  success: 'check', info: 'information', warning: 'exclamation', error: 'error',
};

interface Props {
  state: AppState;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setActiveSection: (section: string) => void;
}

export default function Notifications({ state, markNotificationRead, markAllNotificationsRead, setActiveSection }: Props) {
  const unread = state.notifications.filter(n => !n.isRead);

  return (
    <div className="flex-1 overflow-y-auto p-fluid-md">
      <div className="flex items-center justify-between mb-fluid-md">
        <div>
          <PHeading size="medium" tag="h2">Notifications</PHeading>
          <PText size="x-small" color="contrast-medium">{unread.length} unread</PText>
        </div>
        {unread.length > 0 && (
          <PButton variant="secondary" compact type="button" onClick={markAllNotificationsRead}>
            Mark all read
          </PButton>
        )}
      </div>

      <div className="space-y-3 max-w-2xl">
        {state.notifications.map(notif => (
          <div
            key={notif.id}
            className={`rounded-lg border p-fluid-sm flex items-start gap-3 transition-colors ${notif.isRead ? 'bg-surface border-contrast-low opacity-70' : 'bg-canvas border-contrast-low'}`}
            style={!notif.isRead ? { borderLeft: `3px solid var(--p-color-notification-${notif.type})` } : {}}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `var(--p-color-notification-${notif.type}-soft)` }}>
              <PIcon
                name={typeIcons[notif.type] as Parameters<typeof PIcon>[0]['name']}
                size="small"
                color={`notification-${notif.type}` as 'notification-success' | 'notification-info' | 'notification-warning' | 'notification-error'}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <PText size="x-small" weight={notif.isRead ? 'regular' : 'semi-bold'}>{notif.title}</PText>
                <PText size="xx-small" color="contrast-medium" tag="span">
                  {new Date(notif.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </PText>
              </div>
              <PText size="xx-small" color="contrast-medium">{notif.message}</PText>
              <div className="flex items-center gap-2 mt-2">
                <PTag variant={typeVariant[notif.type]} compact>{notif.type}</PTag>
                {notif.action && (
                  <button
                    className="text-xs font-semibold underline"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-color-primary)' }}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      setActiveSection(notif.action!.href.replace('/', ''));
                    }}
                  >
                    {notif.action.label}
                  </button>
                )}
                {!notif.isRead && (
                  <button
                    className="text-xs"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--p-color-contrast-medium)', marginLeft: 'auto' }}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
