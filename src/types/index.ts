export type Theme = 'light' | 'dark';

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
export type AutomationStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'executive' | 'manager' | 'member';
  avatar?: string;
  workspace: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  owner: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  meetingId?: string;
  tags: string[];
  aiGenerated: boolean;
  reminders: string[];
  attachments: string[];
  comments: Comment[];
  recurring?: RecurringConfig;
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
  transcription?: string;
  mom?: MOM;
  project?: string;
  client?: string;
  priority: Priority;
  aiProcessed: boolean;
}

export interface MOM {
  id: string;
  meetingId: string;
  title: string;
  date: string;
  participants: string[];
  keyPoints: string[];
  actionItems: ActionItem[];
  summary: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  priority: Priority;
  status: 'open' | 'in_progress' | 'completed';
  taskId?: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  recipients: string[];
  body: string;
  receivedAt: string;
  isRead: boolean;
  priority: Priority;
  category: string;
  labels: string[];
  folder: string;
  aiClassified: boolean;
  requiresFollowUp: boolean;
  taskId?: string;
  summary?: string;
}

export interface Briefing {
  id: string;
  date: string;
  summary: string;
  priorities: BriefingItem[];
  marketData: MarketData[];
  newsItems: NewsItem[];
  taskSummary: TaskSummary;
  emailSummary: EmailSummary;
  meetingSummary: MeetingSummary;
  aiGenerated: boolean;
  status: 'generating' | 'ready';
}

export interface BriefingItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  type: 'task' | 'meeting' | 'email' | 'market' | 'action';
}

export interface MarketData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface TaskSummary {
  total: number;
  overdue: number;
  dueToday: number;
  inProgress: number;
  completed: number;
}

export interface EmailSummary {
  total: number;
  unread: number;
  requiresAction: number;
  highPriority: number;
}

export interface MeetingSummary {
  todayCount: number;
  upcomingCount: number;
  pendingMOMCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'reminder' | 'deadline' | 'followup';
  taskId?: string;
  meetingId?: string;
  color?: string;
  recurring?: RecurringConfig;
  source: 'google' | 'outlook' | 'system';
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  steps: WorkflowStep[];
  status: AutomationStatus;
  lastRun?: string;
  nextRun?: string;
  runsCount: number;
  successCount: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'transcription' | 'mom_generation' | 'task_extraction' | 'reminder_creation' | 'email_classification' | 'briefing_generation' | 'notification';
  status: AutomationStatus;
  duration?: number;
  output?: unknown;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export interface AIProvider {
  name: 'claude' | 'openai' | 'gemini';
  model: string;
  status: 'active' | 'fallback' | 'disabled';
  requestCount: number;
  successRate: number;
}
