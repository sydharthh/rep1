import { useState } from 'react';
import { PHeading, PText, PTag, PIcon, PButton, PTabs, PTabsItem } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { Task, Priority, TaskStatus } from '../types';

const priorityVariant: Record<Priority, 'error' | 'warning' | 'info' | 'secondary'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'secondary',
};

const statusColors: Record<TaskStatus, string> = {
  todo: 'var(--p-color-contrast-medium)',
  in_progress: 'var(--p-color-notification-info)',
  completed: 'var(--p-color-notification-success)',
  overdue: 'var(--p-color-notification-error)',
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isOverdue = task.status === 'overdue';

  return (
    <div
      className="bg-canvas rounded border border-contrast-low p-static-sm space-y-2 cursor-pointer hover:border-primary transition-colors"
      style={{ borderLeft: `3px solid ${statusColors[task.status]}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <PText size="x-small" weight="semi-bold">{task.title}</PText>
        <PTag variant={priorityVariant[task.priority]} compact>{task.priority}</PTag>
      </div>

      <PText size="xx-small" color="contrast-medium" ellipsis>{task.description}</PText>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <PIcon name="clock" size="small" color={isOverdue ? 'notification-error' : 'contrast-medium'} />
          <PText size="xx-small" color={isOverdue ? 'notification-error' : 'contrast-medium'}>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </PText>
        </div>
        <div className="flex items-center gap-1">
          <PIcon name="group" size="small" color="contrast-medium" />
          <PText size="xx-small" color="contrast-medium" ellipsis>{task.owner}</PText>
        </div>
        {task.aiGenerated && <PTag color="background-frosted" icon="ai-spark" compact>AI</PTag>}
      </div>

      {task.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {task.tags.slice(0, 3).map(tag => <PTag key={tag} compact>{tag}</PTag>)}
        </div>
      )}

      {task.status !== 'completed' && (
        <div className="flex gap-2 pt-1">
          {task.status !== 'in_progress' && task.status !== 'overdue' && (
            <PButton variant="ghost" compact type="button" onClick={() => onStatusChange(task.id, 'in_progress')} icon="arrow-right" hideLabel>
              Start
            </PButton>
          )}
          <PButton variant="ghost" compact type="button" onClick={() => onStatusChange(task.id, 'completed')} icon="check" hideLabel>
            Complete
          </PButton>
        </div>
      )}
    </div>
  );
}

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  icon: string;
  count: number;
  onStatusChange: (id: string, status: TaskStatus) => void;
  accentColor?: string;
}

function BoardColumn({ title, tasks, icon, count, onStatusChange, accentColor }: BoardColumnProps) {
  return (
    <div className="flex flex-col min-w-72 max-w-80 flex-1 bg-surface rounded-lg border border-contrast-low overflow-hidden">
      <div className="p-static-sm border-b border-contrast-low flex items-center gap-2" style={{ borderTop: `3px solid ${accentColor}` }}>
        <PIcon name={icon as Parameters<typeof PIcon>[0]['name']} size="small" />
        <PText size="x-small" weight="semi-bold">{title}</PText>
        <span className="ml-auto text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: 'var(--p-color-contrast-low)', color: 'var(--p-color-primary)' }}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-static-sm space-y-2" style={{ maxHeight: '60vh' }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <PIcon name="check" size="medium" color="contrast-medium" />
            <PText size="xx-small" color="contrast-medium">No tasks</PText>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />)
        )}
      </div>
    </div>
  );
}

interface Props {
  state: AppState;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

export default function Planner({ state, updateTaskStatus }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const { tasks } = state;

  const today = '2026-05-13';
  const boards = {
    overdue: tasks.filter(t => t.status === 'overdue'),
    today: tasks.filter(t => t.dueDate === today && t.status !== 'completed' && t.status !== 'overdue'),
    upcoming: tasks.filter(t => t.dueDate > today && t.status !== 'completed'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-fluid-md gap-fluid-sm">
      <div className="flex items-center justify-between">
        <div>
          <PHeading size="medium" tag="h2">Planner</PHeading>
          <PText size="x-small" color="contrast-medium">All tasks are AI-generated and automatically organized</PText>
        </div>
        <div className="flex items-center gap-3">
          <PTag color="background-frosted" icon="ai-spark">Zero-Click Automation</PTag>
          <PTag variant={boards.overdue.length > 0 ? 'error' : 'success'}>
            {boards.overdue.length > 0 ? `${boards.overdue.length} Overdue` : 'All on track'}
          </PTag>
        </div>
      </div>

      <PTabs activeTabIndex={activeTab} onUpdate={e => setActiveTab(e.detail.activeTabIndex)} size="small">
        <PTabsItem label="Board View">
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
            <BoardColumn title="Overdue" tasks={boards.overdue} icon="exclamation-filled" count={boards.overdue.length} onStatusChange={updateTaskStatus} accentColor="var(--p-color-notification-error)" />
            <BoardColumn title="Due Today" tasks={boards.today} icon="clock" count={boards.today.length} onStatusChange={updateTaskStatus} accentColor="var(--p-color-notification-warning)" />
            <BoardColumn title="Upcoming" tasks={boards.upcoming} icon="arrow-right" count={boards.upcoming.length} onStatusChange={updateTaskStatus} accentColor="var(--p-color-notification-info)" />
            <BoardColumn title="Completed" tasks={boards.completed} icon="check" count={boards.completed.length} onStatusChange={updateTaskStatus} accentColor="var(--p-color-notification-success)" />
          </div>
        </PTabsItem>
        <PTabsItem label="List View">
          <div className="space-y-2 pt-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-static-sm rounded border border-contrast-low bg-surface">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[task.status] }} />
                <div className="flex-1 min-w-0">
                  <PText size="x-small" weight="semi-bold" ellipsis>{task.title}</PText>
                  <PText size="xx-small" color="contrast-medium">{task.owner} · Due {new Date(task.dueDate).toLocaleDateString()}</PText>
                </div>
                <PTag variant={priorityVariant[task.priority]} compact>{task.priority}</PTag>
                {task.aiGenerated && <PTag color="background-frosted" icon="ai-spark" compact>AI</PTag>}
                {task.status !== 'completed' && (
                  <PButton variant="ghost" compact type="button" onClick={() => updateTaskStatus(task.id, 'completed')} icon="check" hideLabel>
                    Done
                  </PButton>
                )}
              </div>
            ))}
          </div>
        </PTabsItem>
      </PTabs>
    </div>
  );
}
