import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Panel } from '../ui/Panel';

export function WarningsPanel({ warnings }) {
  return (
    <Panel title="Quality Warnings">
      <div className="space-y-2.5">
        {warnings.length === 0 ? <div className="flex items-center gap-2 text-[10px] text-status-ok"><CheckCircle2 className="size-3.5" />No active warnings</div> : warnings.map((warning, i) => (
          <div key={`${warning.message}-${i}`} className="flex items-start gap-2 text-[10px] leading-4 text-muted-foreground">
            {warning.severity === 'ok' ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-status-ok" /> : <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-status-warn" />}
            <span>{warning.message}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
