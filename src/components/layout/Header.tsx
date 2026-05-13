import { PText, PIcon, PTag, PSpinner } from '@porsche-design-system/components-react';
import type { AppState } from '../../store/appStore';

const sectionTitles: Record<string, string> = {
  dashboard: "Today's Plan",
  planner: 'Planner',
  meetings: 'Meetings & MOM',
  email: 'Email Intelligence',
  calendar: 'Calendar',
  briefing: 'Daily Briefing',
  automation: 'Automation Engine',
  notifications: 'Notifications',
};

interface HeaderProps {
  state: AppState;
}

export default function Header({ state }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const overdueTasks = state.tasks.filter(t => t.status === 'overdue').length;

  return (
    <header className="h-14 border-b border-contrast-low bg-canvas flex items-center px-fluid-md gap-4 shrink-0">
      <div className="flex-1">
        <PText size="medium" weight="semi-bold">{sectionTitles[state.activeSection] ?? 'Dashboard'}</PText>
        <PText size="xx-small" color="contrast-medium">{today}</PText>
      </div>

      <div className="flex items-center gap-3">
        {state.isAutomationRunning && (
          <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ background: 'var(--p-color-notification-info-soft)' }}>
            <PSpinner size="small" aria={{ 'aria-label': 'Automation running' }} />
            <PText size="xx-small" color="notification-info">AI Processing...</PText>
          </div>
        )}

        {overdueTasks > 0 && (
          <PTag variant="error" icon="exclamation-filled" compact>
            {overdueTasks} Overdue
          </PTag>
        )}

        <PTag variant="info" icon="ai-spark" compact>
          Claude 3.5 Active
        </PTag>

        <div className="flex items-center gap-1">
          <PIcon name="cloud" size="small" color="contrast-medium" />
          <PText size="xx-small" color="contrast-medium">Live</PText>
        </div>
      </div>
    </header>
  );
}
