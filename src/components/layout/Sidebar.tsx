import { PText, PIcon } from '@porsche-design-system/components-react';
import type { AppState } from '../../store/appStore';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: "Today's Plan", icon: 'ai-spark' },
  { id: 'planner', label: 'Planner', icon: 'grid' },
  { id: 'meetings', label: 'Meetings & MOM', icon: 'chat' },
  { id: 'email', label: 'Email Intelligence', icon: 'email' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'briefing', label: 'Daily Briefing', icon: 'chart' },
  { id: 'automation', label: 'Automation Engine', icon: 'brain' },
];

interface SidebarProps {
  state: AppState;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ state, setActiveSection }: SidebarProps) {
  const unreadNotifs = state.notifications.filter(n => !n.isRead).length;
  const overdueTasks = state.tasks.filter(t => t.status === 'overdue').length;
  const unreadEmails = state.emails.filter(e => !e.isRead).length;

  const getBadge = (id: string) => {
    if (id === 'planner' && overdueTasks > 0) return overdueTasks;
    if (id === 'email' && unreadEmails > 0) return unreadEmails;
    return undefined;
  };

  return (
    <aside className="w-64 bg-surface border-r border-contrast-low flex flex-col h-full shrink-0">
      {/* Brand */}
      <div className="p-fluid-md border-b border-contrast-low flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shrink-0">
          <PIcon name="ai-spark" color="inherit" theme="dark" size="small" />
        </div>
        <div className="overflow-hidden">
          <PText size="x-small" weight="bold" ellipsis>AI Executive</PText>
          <PText size="xx-small" color="contrast-medium" ellipsis>Automation Platform</PText>
        </div>
      </div>

      {/* User */}
      <div className="px-fluid-md py-fluid-sm border-b border-contrast-low flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-contrast-low flex items-center justify-center shrink-0">
          <PText size="xx-small" weight="bold">{state.user.name.split(' ').map(n => n[0]).join('')}</PText>
        </div>
        <div className="overflow-hidden">
          <PText size="xx-small" weight="semi-bold" ellipsis>{state.user.name}</PText>
          <PText size="xx-small" color="contrast-medium" ellipsis tag="span" style={{ textTransform: 'capitalize' }}>{state.user.role}</PText>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-fluid-sm">
        {navItems.map(item => {
          const isActive = state.activeSection === item.id;
          const badge = getBadge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-fluid-md py-static-sm text-left transition-colors relative ${isActive ? 'bg-primary text-[var(--p-color-canvas-light)]' : 'hover:bg-contrast-low'}`}
              style={{ border: 'none', background: isActive ? 'var(--p-color-primary)' : undefined, cursor: 'pointer' }}
            >
              <PIcon
                name={item.icon as Parameters<typeof PIcon>[0]['name']}
                size="small"
                theme={isActive ? 'dark' : 'light'}
                color={isActive ? 'inherit' : 'primary'}
              />
              <PText
                size="x-small"
                weight={isActive ? 'semi-bold' : 'regular'}
                color={isActive ? 'inherit' : 'primary'}
                theme={isActive ? 'dark' : 'light'}
              >
                {item.label}
              </PText>
              {badge !== undefined && (
                <span className={`ml-auto text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 ${isActive ? 'bg-[rgba(255,255,255,0.2)] text-white' : 'bg-[var(--p-color-notification-error)] text-white'}`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-fluid-sm border-t border-contrast-low">
        <button
          onClick={() => setActiveSection('notifications')}
          className="w-full flex items-center gap-3 px-fluid-sm py-static-xs rounded hover:bg-contrast-low transition-colors"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <div className="relative">
            <PIcon name="bell" size="small" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-white" style={{ fontSize: '8px', background: 'var(--p-color-notification-error)' }}>
                {unreadNotifs}
              </span>
            )}
          </div>
          <PText size="x-small">Notifications</PText>
          {unreadNotifs > 0 && <span className="ml-auto text-xs text-[var(--p-color-notification-error)] font-bold">{unreadNotifs}</span>}
        </button>

        <div className="flex items-center gap-2 px-fluid-sm py-static-xs mt-static-xs">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--p-color-notification-success)' }} />
          <PText size="xx-small" color="contrast-medium">Automation Active</PText>
        </div>
      </div>
    </aside>
  );
}
