import { useState, useCallback } from 'react';
import type { User, Task, Meeting, Email, Briefing, CalendarEvent, AutomationWorkflow, Notification, AIProvider } from '../types';
import { mockTasks, mockMeetings, mockEmails, mockBriefing, mockCalendarEvents, mockWorkflows, mockNotifications, mockUser } from '../utils/mockData';

export interface AppState {
  user: User;
  tasks: Task[];
  meetings: Meeting[];
  emails: Email[];
  briefing: Briefing | null;
  calendarEvents: CalendarEvent[];
  workflows: AutomationWorkflow[];
  notifications: Notification[];
  aiProviders: AIProvider[];
  activeSection: string;
  isAutomationRunning: boolean;
}

const initialState: AppState = {
  user: mockUser,
  tasks: mockTasks,
  meetings: mockMeetings,
  emails: mockEmails,
  briefing: mockBriefing,
  calendarEvents: mockCalendarEvents,
  workflows: mockWorkflows,
  notifications: mockNotifications,
  aiProviders: [
    { name: 'claude', model: 'claude-3-5-sonnet-20241022', status: 'active', requestCount: 1284, successRate: 99.2 },
    { name: 'openai', model: 'gpt-4o', status: 'fallback', requestCount: 23, successRate: 97.8 },
    { name: 'gemini', model: 'gemini-1.5-pro', status: 'fallback', requestCount: 5, successRate: 96.1 },
  ],
  activeSection: 'dashboard',
  isAutomationRunning: true,
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);

  const setActiveSection = useCallback((section: string) => {
    setState(s => ({ ...s, activeSection: section }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => ({ ...n, isRead: true })),
    }));
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: Task['status']) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t),
    }));
  }, []);

  const simulateAutomation = useCallback(() => {
    setState(s => ({ ...s, isAutomationRunning: true }));
    setTimeout(() => setState(s => ({ ...s, isAutomationRunning: false })), 3000);
  }, []);

  return {
    state,
    setActiveSection,
    markNotificationRead,
    markAllNotificationsRead,
    updateTaskStatus,
    simulateAutomation,
  };
}
