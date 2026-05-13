import { PHeading, PText, PTag, PIcon, PSpinner, PDivider } from '@porsche-design-system/components-react';
import type { AppState } from '../store/appStore';
import type { AutomationWorkflow, WorkflowStep, AutomationStatus } from '../types';

const statusVariant: Record<AutomationStatus, 'success' | 'info' | 'warning' | 'error' | 'secondary'> = {
  completed: 'success', running: 'info', idle: 'secondary', failed: 'error',
};

const stepTypeIcons: Record<WorkflowStep['type'], string> = {
  transcription: 'microphone',
  mom_generation: 'document',
  task_extraction: 'check',
  reminder_creation: 'bell',
  email_classification: 'email',
  briefing_generation: 'chart',
  notification: 'broadcast',
};

function WorkflowStepRow({ step }: { step: WorkflowStep }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{
        background: step.status === 'completed' ? 'var(--p-color-notification-success-soft)'
          : step.status === 'running' ? 'var(--p-color-notification-info-soft)'
            : step.status === 'failed' ? 'var(--p-color-notification-error-soft)'
              : 'var(--p-color-contrast-low)',
      }}>
        {step.status === 'running' ? (
          <PSpinner size="small" aria={{ 'aria-label': 'Running' }} />
        ) : (
          <PIcon
            name={step.status === 'completed' ? 'check' : step.status === 'failed' ? 'close' : stepTypeIcons[step.type] as Parameters<typeof PIcon>[0]['name']}
            size="small"
            color={step.status === 'completed' ? 'notification-success' : step.status === 'failed' ? 'notification-error' : 'contrast-medium'}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <PText size="x-small" weight={step.status === 'running' ? 'semi-bold' : 'regular'} ellipsis>{step.name}</PText>
      </div>
      {step.duration !== undefined && step.duration > 0 && (
        <PText size="xx-small" color="contrast-medium">{step.duration}s</PText>
      )}
      <PTag variant={statusVariant[step.status]} compact>{step.status}</PTag>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: AutomationWorkflow }) {
  const successRate = workflow.runsCount > 0 ? ((workflow.successCount / workflow.runsCount) * 100).toFixed(1) : '0';
  const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
  const totalSteps = workflow.steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="bg-canvas rounded-lg border border-contrast-low p-fluid-md">
      <div className="flex items-start justify-between gap-4 mb-fluid-sm">
        <div className="flex-1 min-w-0">
          <PHeading size="small" tag="h3">{workflow.name}</PHeading>
          <div className="flex items-center gap-2 mt-1">
            <PIcon name="flash" size="small" color="contrast-medium" />
            <PText size="xx-small" color="contrast-medium">Trigger: {workflow.trigger}</PText>
          </div>
        </div>
        <PTag variant={statusVariant[workflow.status]}>{workflow.status.toUpperCase()}</PTag>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'var(--p-color-contrast-low)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            background: workflow.status === 'completed' ? 'var(--p-color-notification-success)'
              : workflow.status === 'running' ? 'var(--p-color-notification-info)'
                : workflow.status === 'failed' ? 'var(--p-color-notification-error)'
                  : 'var(--p-color-contrast-medium)',
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-0 divide-y" style={{ borderColor: 'var(--p-color-contrast-low)' }}>
        {workflow.steps.map(step => <WorkflowStepRow key={step.id} step={step} />)}
      </div>

      <PDivider />

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1">
          <PIcon name="chart" size="small" color="contrast-medium" />
          <PText size="xx-small" color="contrast-medium">{workflow.runsCount.toLocaleString()} runs</PText>
        </div>
        <div className="flex items-center gap-1">
          <PIcon name="check" size="small" color="notification-success" />
          <PText size="xx-small" color="notification-success">{successRate}% success</PText>
        </div>
        {workflow.lastRun && (
          <div className="flex items-center gap-1">
            <PIcon name="clock" size="small" color="contrast-medium" />
            <PText size="xx-small" color="contrast-medium">
              Last: {new Date(workflow.lastRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </PText>
          </div>
        )}
        {workflow.nextRun && (
          <div className="flex items-center gap-1 ml-auto">
            <PIcon name="arrow-right" size="small" color="contrast-medium" />
            <PText size="xx-small" color="contrast-medium">
              Next: {new Date(workflow.nextRun).toLocaleString()}
            </PText>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props { state: AppState }

export default function AutomationEngine({ state }: Props) {
  const runningWorkflows = state.workflows.filter(w => w.status === 'running');
  const totalRuns = state.workflows.reduce((sum, w) => sum + w.runsCount, 0);
  const totalSuccess = state.workflows.reduce((sum, w) => sum + w.successCount, 0);
  const overallRate = totalRuns > 0 ? ((totalSuccess / totalRuns) * 100).toFixed(1) : '0';

  return (
    <div className="flex-1 overflow-y-auto p-fluid-md space-y-fluid-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <PHeading size="medium" tag="h2">Automation Engine</PHeading>
          <PText size="x-small" color="contrast-medium">Zero-click automation — all workflows run automatically. Cannot be disabled.</PText>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--p-color-notification-success)' }} />
          <PTag variant="success">System Active</PTag>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {[
          { label: 'Active Workflows', value: state.workflows.length, icon: 'flash', color: 'var(--p-color-primary)' },
          { label: 'Running Now', value: runningWorkflows.length, icon: 'spinner', color: runningWorkflows.length > 0 ? 'var(--p-color-notification-info)' : 'var(--p-color-contrast-medium)' },
          { label: 'Total Runs', value: totalRuns.toLocaleString(), icon: 'chart', color: 'var(--p-color-primary)' },
          { label: 'Success Rate', value: `${overallRate}%`, icon: 'check', color: 'var(--p-color-notification-success)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-surface rounded-lg border border-contrast-low p-fluid-md flex items-center gap-3">
            <PIcon name={icon as Parameters<typeof PIcon>[0]['name']} size="medium" color="contrast-medium" />
            <div>
              <PText size="large" weight="bold" color="inherit" style={{ color }}>{value}</PText>
              <PText size="xx-small" color="contrast-medium">{label}</PText>
            </div>
          </div>
        ))}
      </div>

      {/* AI Providers */}
      <section className="bg-surface rounded-lg border border-contrast-low p-fluid-md">
        <div className="flex items-center gap-2 mb-fluid-sm">
          <PIcon name="brain" color="primary" />
          <PHeading size="small" tag="h3">AI Provider Architecture</PHeading>
          <PTag color="background-frosted" icon="ai-spark" compact>Multi-LLM</PTag>
        </div>
        <div className="space-y-3">
          {state.aiProviders.map(provider => (
            <div key={provider.name} className="flex items-center gap-3 p-static-sm rounded border border-contrast-low bg-canvas">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <PText size="x-small" weight="semi-bold" style={{ textTransform: 'capitalize' }}>{provider.name}</PText>
                  <PTag variant={provider.status === 'active' ? 'success' : provider.status === 'fallback' ? 'info' : 'secondary'} compact>
                    {provider.status}
                  </PTag>
                  {provider.status === 'active' && <PTag compact>Primary</PTag>}
                </div>
                <PText size="xx-small" color="contrast-medium">{provider.model}</PText>
              </div>
              <div className="text-right">
                <PText size="xx-small" color="contrast-medium">{provider.requestCount.toLocaleString()} requests</PText>
                <PText size="xx-small" color="notification-success">{provider.successRate}% success</PText>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-static-sm rounded" style={{ background: 'var(--p-color-notification-warning-soft)' }}>
          <PText size="xx-small" color="contrast-medium">
            Provider abstraction layer active. Business logic is provider-agnostic. Fallback chain: Claude → OpenAI → Gemini.
          </PText>
        </div>
      </section>

      {/* Workflows */}
      <section>
        <div className="flex items-center gap-2 mb-fluid-sm">
          <PIcon name="arrows" color="primary" />
          <PHeading size="small" tag="h3">Active Workflows</PHeading>
        </div>
        <div className="grid gap-fluid-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {state.workflows.map(w => <WorkflowCard key={w.id} workflow={w} />)}
        </div>
      </section>
    </div>
  );
}
