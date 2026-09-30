import { CheckCircle2 } from 'lucide-react';
import { Panel } from '../ui/Panel';

export function QualityMetrics({ qa }) {
  const a = qa.accuracy;
  return (
    <Panel title="Quality Metrics">
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-xs">
        <Metric label="Relative Accuracy" value={`${a.relative_m.toFixed(2)} m`} />
        <Metric label="CE90" value={`${a.ce90_m.toFixed(2)} m`} />
        <Metric label="LE90" value={`${a.le90_m.toFixed(2)} m`} />
        <div>
          <p className="text-[10px] text-muted-foreground">Target</p>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-status-ok"><span>&lt; {a.target_m.toFixed(0)} m</span><CheckCircle2 className="size-3.5" /></div>
        </div>
      </div>
    </Panel>
  );
}

function Metric({ label, value }) {
  return <div><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm text-foreground">{value}</p></div>;
}
