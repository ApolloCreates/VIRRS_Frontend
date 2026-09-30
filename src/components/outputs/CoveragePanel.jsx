import { Panel } from '../ui/Panel';

export function CoveragePanel({ coverage }) {
  const total = coverage.observed_percent + coverage.inferred_percent + coverage.uncovered_percent;
  const observed = total ? (coverage.observed_percent / total) * 100 : 0;
  const inferred = total ? (coverage.inferred_percent / total) * 100 : 0;
  const donut = `conic-gradient(#45c47a 0 ${observed}%, #3d82d4 ${observed}% ${observed + inferred}%, #e85d62 ${observed + inferred}% 100%)`;
  return (
    <Panel title="Coverage">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 rounded-full" style={{ background: donut }}>
          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card"><span className="font-mono text-sm text-foreground">{coverage.reconstructed_percent.toFixed(0)}%</span></div>
        </div>
        <div className="space-y-2 text-[10px] text-muted-foreground">
          <Legend color="#45c47a" label="Observed" value={`${coverage.observed_percent.toFixed(1)}%`} />
          <Legend color="#3d82d4" label="Inferred" value={`${coverage.inferred_percent.toFixed(1)}%`} />
          <Legend color="#e85d62" label="Uncovered" value={`${coverage.uncovered_percent.toFixed(1)}%`} />
        </div>
      </div>
    </Panel>
  );
}

function Legend({ color, label, value }) {
  return <div className="flex items-center gap-2"><span className="size-2 rounded-sm" style={{ backgroundColor: color }} /><span className="min-w-14">{label}</span><span className="font-mono text-foreground">{value}</span></div>;
}
