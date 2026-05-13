import type { User, Task, Meeting, Email, Briefing, CalendarEvent, AutomationWorkflow, Notification } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alexandra Chen',
  email: 'a.chen@porsche-corp.com',
  role: 'executive',
  workspace: 'Porsche AG Executive Office',
};

export const mockTasks: Task[] = [
  {
    id: 't1', title: 'Review Q3 Financial Report', description: 'AI-extracted from Board Meeting. Review and approve Q3 financial statements before investor call.',
    status: 'in_progress', priority: 'critical', owner: 'Alexandra Chen', dueDate: '2026-05-13',
    createdAt: '2026-05-12T09:00:00Z', updatedAt: '2026-05-13T08:00:00Z', meetingId: 'm1',
    tags: ['Finance', 'Q3', 'Board'], aiGenerated: true, reminders: ['2026-05-13T07:00:00Z'], attachments: [], comments: [],
  },
  {
    id: 't2', title: 'Prepare EV Strategy Presentation', description: 'Create executive-level presentation for next board meeting covering EV roadmap 2026-2030.',
    status: 'todo', priority: 'high', owner: 'Marcus Weber', dueDate: '2026-05-16',
    createdAt: '2026-05-12T10:00:00Z', updatedAt: '2026-05-12T10:00:00Z', meetingId: 'm1',
    tags: ['Strategy', 'EV', 'Presentation'], aiGenerated: true, reminders: [], attachments: [], comments: [],
  },
  {
    id: 't3', title: 'Follow up with Supplier Network', description: 'Contact Tier-1 suppliers regarding revised delivery schedules for battery components.',
    status: 'todo', priority: 'high', owner: 'Lena Müller', dueDate: '2026-05-14',
    createdAt: '2026-05-11T14:00:00Z', updatedAt: '2026-05-11T14:00:00Z',
    tags: ['Supply Chain', 'Batteries'], aiGenerated: true, reminders: ['2026-05-14T09:00:00Z'], attachments: [], comments: [],
  },
  {
    id: 't4', title: 'Approve Marketing Campaign Budget', description: 'Review and approve the Taycan global marketing campaign budget proposal.',
    status: 'overdue', priority: 'high', owner: 'Alexandra Chen', dueDate: '2026-05-12',
    createdAt: '2026-05-10T09:00:00Z', updatedAt: '2026-05-10T09:00:00Z',
    tags: ['Marketing', 'Budget', 'Taycan'], aiGenerated: false, reminders: [], attachments: [], comments: [],
  },
  {
    id: 't5', title: 'Sign Partnership Agreement - TechVenture GmbH', description: 'Final review and signature of technology licensing agreement.',
    status: 'todo', priority: 'critical', owner: 'Alexandra Chen', dueDate: '2026-05-15',
    createdAt: '2026-05-12T11:00:00Z', updatedAt: '2026-05-12T11:00:00Z',
    tags: ['Legal', 'Partnership'], aiGenerated: false, reminders: ['2026-05-15T10:00:00Z'], attachments: [], comments: [],
  },
  {
    id: 't6', title: 'Onboard New VP of Digital', description: 'Complete onboarding checklist for new VP of Digital Transformation.',
    status: 'in_progress', priority: 'medium', owner: 'HR Team', dueDate: '2026-05-20',
    createdAt: '2026-05-08T09:00:00Z', updatedAt: '2026-05-13T07:00:00Z',
    tags: ['HR', 'Onboarding'], aiGenerated: false, reminders: [], attachments: [], comments: [],
  },
  {
    id: 't7', title: 'Review Customer Satisfaction Survey Results', description: 'AI-analyzed survey data for Porsche Experience Centers — needs executive review.',
    status: 'todo', priority: 'medium', owner: 'Alexandra Chen', dueDate: '2026-05-17',
    createdAt: '2026-05-13T07:00:00Z', updatedAt: '2026-05-13T07:00:00Z',
    tags: ['Customer Experience', 'Analytics'], aiGenerated: true, reminders: [], attachments: [], comments: [],
  },
  {
    id: 't8', title: 'Monthly Investor Relations Call', description: 'Prepare talking points and key metrics for investor relations quarterly call.',
    status: 'completed', priority: 'high', owner: 'Alexandra Chen', dueDate: '2026-05-10',
    createdAt: '2026-05-05T09:00:00Z', updatedAt: '2026-05-10T16:00:00Z',
    tags: ['Investor Relations', 'Finance'], aiGenerated: false, reminders: [], attachments: [], comments: [],
  },
];

export const mockMeetings: Meeting[] = [
  {
    id: 'm1', title: 'Q3 Board Strategy Review', date: '2026-05-12T09:00:00Z', duration: 120,
    participants: ['Alexandra Chen', 'Marcus Weber', 'Dr. Klaus Fischer', 'Ingrid Hoffmann'],
    status: 'completed', recordingUrl: '/recordings/m1.mp4',
    transcription: 'Full transcript available. Key discussion: EV transition timeline accelerated to 2027...',
    mom: {
      id: 'mom1', meetingId: 'm1', title: 'Q3 Board Strategy Review - MOM',
      date: '2026-05-12T09:00:00Z', participants: ['Alexandra Chen', 'Marcus Weber', 'Dr. Klaus Fischer'],
      keyPoints: [
        'EV transition target moved forward to Q2 2027',
        'Battery supplier diversification strategy approved',
        'Digital transformation budget increased by 15%',
        'New VP of Digital Transformation to be onboarded by end of month',
      ],
      actionItems: [
        { id: 'ai1', description: 'Review Q3 Financial Report', owner: 'Alexandra Chen', deadline: '2026-05-13', priority: 'critical', status: 'in_progress', taskId: 't1' },
        { id: 'ai2', description: 'Prepare EV Strategy Presentation', owner: 'Marcus Weber', deadline: '2026-05-16', priority: 'high', status: 'open', taskId: 't2' },
      ],
      summary: 'Board approved accelerated EV timeline and increased digital transformation investment. Key focus areas: battery supply chain and market positioning.',
      version: 1, createdAt: '2026-05-12T11:00:00Z', updatedAt: '2026-05-12T11:00:00Z',
    },
    project: 'Corporate Strategy 2026', priority: 'critical', aiProcessed: true,
  },
  {
    id: 'm2', title: 'EV Product Roadmap Review', date: '2026-05-13T14:00:00Z', duration: 90,
    participants: ['Alexandra Chen', 'Thomas Bauer', 'Dr. Sarah Klein'],
    status: 'scheduled', project: 'EV Platform 2027', priority: 'high', aiProcessed: false,
  },
  {
    id: 'm3', title: 'Global Marketing Strategy', date: '2026-05-13T16:00:00Z', duration: 60,
    participants: ['Alexandra Chen', 'Marketing Team'],
    status: 'scheduled', project: 'Taycan Campaign 2026', priority: 'medium', aiProcessed: false,
  },
  {
    id: 'm4', title: 'Supplier Negotiations - Battery Tech', date: '2026-05-11T10:00:00Z', duration: 90,
    participants: ['Alexandra Chen', 'Lena Müller', 'Supplier Representatives'],
    status: 'completed', aiProcessed: true,
    mom: {
      id: 'mom2', meetingId: 'm4', title: 'Supplier Negotiations - Battery Tech - MOM',
      date: '2026-05-11T10:00:00Z', participants: ['Alexandra Chen', 'Lena Müller'],
      keyPoints: ['New pricing agreed for 2026', 'Delivery schedule revised'],
      actionItems: [
        { id: 'ai3', description: 'Follow up with Supplier Network', owner: 'Lena Müller', deadline: '2026-05-14', priority: 'high', status: 'open', taskId: 't3' },
      ],
      summary: 'Successful negotiation. New pricing and delivery schedules locked for Q3.',
      version: 1, createdAt: '2026-05-11T12:00:00Z', updatedAt: '2026-05-11T12:00:00Z',
    },
    priority: 'high',
  },
];

export const mockEmails: Email[] = [
  {
    id: 'e1', subject: 'URGENT: Regulatory Filing Deadline Tomorrow', sender: 'EU Regulatory Body',
    senderEmail: 'compliance@eu-regulation.gov', recipients: ['a.chen@porsche-corp.com'],
    body: 'Dear Ms. Chen, This is a reminder that the Q1 compliance filing is due tomorrow by 17:00 CET...',
    receivedAt: '2026-05-13T06:30:00Z', isRead: false, priority: 'critical',
    category: 'Regulatory', labels: ['urgent', 'compliance'], folder: 'Inbox',
    aiClassified: true, requiresFollowUp: true,
    summary: 'Regulatory filing due tomorrow 17:00 CET. Requires immediate attention.',
  },
  {
    id: 'e2', subject: 'Investor Update: Q1 Results Overview', sender: 'Dr. Hans Richter',
    senderEmail: 'h.richter@portfolio-management.de', recipients: ['a.chen@porsche-corp.com'],
    body: 'Dear Alexandra, Please find attached the Q1 results overview as requested...',
    receivedAt: '2026-05-13T07:15:00Z', isRead: false, priority: 'high',
    category: 'Finance', labels: ['investor', 'q1'], folder: 'Inbox',
    aiClassified: true, requiresFollowUp: false,
    summary: 'Q1 results summary from lead investor. Attachment with financial overview.',
  },
  {
    id: 'e3', subject: 'Partnership Proposal — TechVenture Integration', sender: 'Michael Scott',
    senderEmail: 'm.scott@techventure-gmbh.com', recipients: ['a.chen@porsche-corp.com'],
    body: 'Dear Ms. Chen, Following our recent call, I am pleased to present the revised partnership terms...',
    receivedAt: '2026-05-13T08:00:00Z', isRead: true, priority: 'high',
    category: 'Partnerships', labels: ['partnership', 'legal'], folder: 'Inbox',
    aiClassified: true, requiresFollowUp: true,
    summary: 'Revised partnership terms from TechVenture. Legal review required before signing.',
  },
  {
    id: 'e4', subject: 'Team Update: Digital Transformation Progress', sender: 'Julia Hartmann',
    senderEmail: 'j.hartmann@porsche-corp.com', recipients: ['a.chen@porsche-corp.com'],
    body: 'Dear Alexandra, Here is the weekly update on our digital transformation initiatives...',
    receivedAt: '2026-05-13T08:45:00Z', isRead: true, priority: 'medium',
    category: 'Internal', labels: ['digital', 'update'], folder: 'Inbox',
    aiClassified: true, requiresFollowUp: false,
    summary: 'Weekly digital transformation update. Phase 2 on schedule, Phase 3 planning underway.',
  },
  {
    id: 'e5', subject: 'Press Inquiry: Porsche EV Strategy Comments Requested', sender: 'Sarah Johnson',
    senderEmail: 's.johnson@automotive-times.com', recipients: ['a.chen@porsche-corp.com'],
    body: 'Dear Ms. Chen, We are preparing an article on premium EV market positioning and would welcome comments...',
    receivedAt: '2026-05-12T15:30:00Z', isRead: true, priority: 'medium',
    category: 'Media', labels: ['press', 'ev'], folder: 'Inbox',
    aiClassified: true, requiresFollowUp: true,
    summary: 'Press inquiry for EV strategy article. Coordinate with comms team for response.',
  },
];

export const mockBriefing: Briefing = {
  id: 'b1',
  date: '2026-05-13',
  summary: 'Critical day ahead: regulatory filing deadline, 2 back-to-back meetings this afternoon, and a partnership agreement requiring your signature. Market conditions favorable with DAX up 0.8%. 3 emails require immediate action.',
  priorities: [
    { id: 'p1', title: 'EU Regulatory Filing Due Today', description: 'Compliance filing must be submitted by 17:00 CET', priority: 'critical', type: 'action' },
    { id: 'p2', title: 'Review Q3 Financial Report', description: 'Required before investor call this week', priority: 'critical', type: 'task' },
    { id: 'p3', title: 'Sign TechVenture Partnership Agreement', description: 'Awaiting signature — deadline Friday', priority: 'high', type: 'task' },
    { id: 'p4', title: 'EV Product Roadmap Meeting at 14:00', description: 'With Thomas Bauer and Dr. Sarah Klein', priority: 'high', type: 'meeting' },
    { id: 'p5', title: 'Marketing Campaign Budget Approval Overdue', description: 'Taycan campaign budget overdue by 1 day', priority: 'high', type: 'task' },
  ],
  marketData: [
    { symbol: 'DAX', name: 'DAX Index', value: 18427.3, change: 147.2, changePercent: 0.80 },
    { symbol: 'PAH3', name: 'Porsche AG', value: 72.4, change: 0.85, changePercent: 1.19 },
    { symbol: 'VOW3', name: 'Volkswagen', value: 118.6, change: -1.2, changePercent: -1.00 },
    { symbol: 'EUR/USD', name: 'EUR/USD', value: 1.0823, change: 0.0015, changePercent: 0.14 },
  ],
  newsItems: [
    { id: 'n1', title: 'EU Sets Stricter EV Emission Standards for 2027', source: 'Reuters', url: '#', publishedAt: '2026-05-13T06:00:00Z', category: 'Regulatory', relevance: 'high' },
    { id: 'n2', title: 'Battery Technology Breakthrough Cuts Costs by 20%', source: 'Financial Times', url: '#', publishedAt: '2026-05-13T07:30:00Z', category: 'Technology', relevance: 'high' },
    { id: 'n3', title: 'Premium Auto Market Grows 8% in Q1 2026', source: 'Bloomberg', url: '#', publishedAt: '2026-05-13T08:00:00Z', category: 'Market', relevance: 'medium' },
  ],
  taskSummary: { total: 8, overdue: 1, dueToday: 2, inProgress: 2, completed: 1 },
  emailSummary: { total: 5, unread: 2, requiresAction: 3, highPriority: 2 },
  meetingSummary: { todayCount: 2, upcomingCount: 3, pendingMOMCount: 0 },
  aiGenerated: true,
  status: 'ready',
};

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'ce1', title: 'Q3 Board Strategy Review', start: '2026-05-12T09:00:00Z', end: '2026-05-12T11:00:00Z', type: 'meeting', meetingId: 'm1', source: 'outlook', color: '#c00' },
  { id: 'ce2', title: 'EV Product Roadmap Review', start: '2026-05-13T14:00:00Z', end: '2026-05-13T15:30:00Z', type: 'meeting', meetingId: 'm2', source: 'outlook', color: '#c00' },
  { id: 'ce3', title: 'Global Marketing Strategy', start: '2026-05-13T16:00:00Z', end: '2026-05-13T17:00:00Z', type: 'meeting', meetingId: 'm3', source: 'google', color: '#c00' },
  { id: 'ce4', title: 'Review Q3 Financial Report', start: '2026-05-13T10:00:00Z', end: '2026-05-13T11:00:00Z', type: 'deadline', taskId: 't1', source: 'system', color: '#c00' },
  { id: 'ce5', title: 'Sign Partnership Agreement', start: '2026-05-15T10:00:00Z', end: '2026-05-15T10:30:00Z', type: 'deadline', taskId: 't5', source: 'system', color: '#c00' },
  { id: 'ce6', title: 'Regulatory Filing Follow-up', start: '2026-05-14T09:00:00Z', end: '2026-05-14T09:30:00Z', type: 'reminder', source: 'system', color: '#c00' },
];

export const mockWorkflows: AutomationWorkflow[] = [
  {
    id: 'w1', name: 'Meeting Post-Processing Pipeline',
    trigger: 'Meeting recording uploaded',
    steps: [
      { id: 's1', name: 'Speech-to-Text Transcription', type: 'transcription', status: 'completed', duration: 45 },
      { id: 's2', name: 'AI MOM Generation', type: 'mom_generation', status: 'completed', duration: 12 },
      { id: 's3', name: 'Task Extraction & Assignment', type: 'task_extraction', status: 'completed', duration: 8 },
      { id: 's4', name: 'Calendar Reminder Creation', type: 'reminder_creation', status: 'completed', duration: 2 },
      { id: 's5', name: 'Planner Board Update', type: 'notification', status: 'completed', duration: 1 },
    ],
    status: 'completed', lastRun: '2026-05-12T11:05:00Z', runsCount: 47, successCount: 46,
  },
  {
    id: 'w2', name: 'Email Intelligence Pipeline',
    trigger: 'New email received',
    steps: [
      { id: 's6', name: 'Email Classification', type: 'email_classification', status: 'completed', duration: 3 },
      { id: 's7', name: 'Priority Detection', type: 'email_classification', status: 'completed', duration: 2 },
      { id: 's8', name: 'Auto-Tagging & Labeling', type: 'notification', status: 'completed', duration: 1 },
      { id: 's9', name: 'Follow-up Task Generation', type: 'task_extraction', status: 'running', duration: 0 },
      { id: 's10', name: 'Reminder Scheduling', type: 'reminder_creation', status: 'idle', duration: 0 },
    ],
    status: 'running', lastRun: '2026-05-13T08:45:00Z', nextRun: '2026-05-13T08:50:00Z', runsCount: 1847, successCount: 1839,
  },
  {
    id: 'w3', name: 'Daily Executive Briefing',
    trigger: 'Scheduled — daily 06:00 CET',
    steps: [
      { id: 's11', name: 'Data Aggregation', type: 'briefing_generation', status: 'completed', duration: 15 },
      { id: 's12', name: 'Market Data Fetch', type: 'briefing_generation', status: 'completed', duration: 5 },
      { id: 's13', name: 'AI Briefing Generation', type: 'briefing_generation', status: 'completed', duration: 18 },
      { id: 's14', name: 'Email Delivery', type: 'notification', status: 'completed', duration: 2 },
      { id: 's15', name: 'Dashboard Update', type: 'notification', status: 'completed', duration: 1 },
    ],
    status: 'completed', lastRun: '2026-05-13T06:00:00Z', nextRun: '2026-05-14T06:00:00Z', runsCount: 365, successCount: 364,
  },
  {
    id: 'w4', name: 'Today\'s Plan AI Engine',
    trigger: 'Scheduled — daily 07:00 CET',
    steps: [
      { id: 's16', name: 'Pending Tasks Analysis', type: 'task_extraction', status: 'completed', duration: 8 },
      { id: 's17', name: 'Calendar Review', type: 'reminder_creation', status: 'completed', duration: 3 },
      { id: 's18', name: 'AI Priority Generation', type: 'mom_generation', status: 'completed', duration: 11 },
      { id: 's19', name: 'Today\'s Plan Delivery', type: 'notification', status: 'completed', duration: 1 },
    ],
    status: 'completed', lastRun: '2026-05-13T07:00:00Z', nextRun: '2026-05-14T07:00:00Z', runsCount: 180, successCount: 180,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1', title: 'AI Task Extraction Complete', message: '4 tasks auto-created from Q3 Board Strategy Review meeting',
    type: 'success', createdAt: '2026-05-12T11:05:00Z', isRead: false,
    action: { label: 'View Tasks', href: '/planner' },
  },
  {
    id: 'notif2', title: 'Overdue Task Alert', message: 'Marketing Campaign Budget Approval is 1 day overdue',
    type: 'warning', createdAt: '2026-05-13T07:00:00Z', isRead: false,
    action: { label: 'View Task', href: '/planner' },
  },
  {
    id: 'notif3', title: 'Email Classified — Critical', message: 'EU Regulatory Filing deadline email requires immediate attention',
    type: 'error', createdAt: '2026-05-13T06:35:00Z', isRead: false,
    action: { label: 'View Email', href: '/email' },
  },
  {
    id: 'notif4', title: "Today's Plan Ready", message: "Your AI-generated executive plan for May 13 is ready",
    type: 'info', createdAt: '2026-05-13T07:00:00Z', isRead: true,
    action: { label: "View Plan", href: '/dashboard' },
  },
  {
    id: 'notif5', title: 'MOM Auto-Generated', message: 'Minutes of Meeting for "Q3 Board Strategy Review" generated and saved',
    type: 'success', createdAt: '2026-05-12T11:02:00Z', isRead: true,
    action: { label: 'View MOM', href: '/meetings' },
  },
];
