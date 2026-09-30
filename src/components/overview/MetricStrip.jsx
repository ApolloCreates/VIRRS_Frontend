import {
  formatDuration,
  formatMeters,
  formatNumber,
  formatPercent,
  getStatusStyle,
} from "../../lib/mission-format";

function Metric({ label, value, context }) {
  return (
    <div className="flex flex-col gap-1 rounded-sm border border-border bg-card px-4 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-2xl leading-none text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{context}</span>
    </div>
  );
}

export function MetricStrip({ processing, qa }) {
  const statusStyle = getStatusStyle(processing.status);

  return (
    <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2">
      <Metric
        label="Processing Time"
        value={formatDuration(processing.elapsed_seconds)}
        context={statusStyle.label}
      />
      <Metric
        label="CE90"
        value={formatMeters(qa.accuracy.ce90_m)}
        context={`Target ≤ ${qa.accuracy.target_m.toFixed(2)} m`}
      />
      <Metric
        label="Reconstructed"
        value={formatPercent(qa.coverage.reconstructed_percent)}
        context={`${formatPercent(qa.coverage.uncovered_percent)} uncovered`}
      />
      <Metric
        label="Frames"
        value={formatNumber(processing.frames_total)}
        context={`${formatNumber(processing.keyframes_selected)} keyframes`}
      />
    </div>
  );
}
