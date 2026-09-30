import { Panel } from "../ui/Panel";
import { PIPELINE_STAGES } from "../../schemas/missionSchemas";
import { formatDuration, formatNumber, getStatusStyle } from "../../lib/mission-format";

export function stageLabel(id) {
  const meta = PIPELINE_STAGES.find((s) => s.id === id);
  return meta ? `${meta.id} — ${meta.name}` : null;
}

export function findFailedStage(processing) {
  return PIPELINE_STAGES.find(
    (s) => String(processing.stages[s.id]?.status || "").toLowerCase() === "failed",
  );
}

function Bar({ value, active }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`h-full rounded-full bg-accent/80 transition-[width] duration-500 ${active ? "animate-pulse-soft" : ""}`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-lg leading-none text-foreground">{value}</span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function ProcessingSummary({ processing }) {
  const status = String(processing.status || "").toLowerCase();
  const active = status === "processing" || status === "running";
  const failed = findFailedStage(processing);
  let current = stageLabel(processing.current_stage) || "No active stage";
  if (status === "pending") current = "Waiting to start";

  return (
    <Panel title="Processing Summary">
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
        <Stat label="Overall Progress" value={`${processing.overall_progress ?? 0}%`} />
        <Stat
          label="Current Stage"
          value={<span className="text-sm">{current}</span>}
          sub={failed ? `Failed at ${stageLabel(failed.id)}` : null}
        />
        <Stat label="Elapsed" value={formatDuration(processing.elapsed_seconds)} />
        <Stat
          label="Estimated Remaining"
          value={formatDuration(processing.estimated_remaining_seconds)}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Processing Progress
        </span>
        <div className="flex-1">
          <Bar value={processing.overall_progress} active={active} />
        </div>
        <span className="font-mono text-xs text-foreground">{processing.overall_progress ?? 0}%</span>
      </div>
    </Panel>
  );
}

export function ProcessingStatistics({ processing }) {
  const total = processing.frames_total || 0;
  const done = processing.frames_processed || 0;
  const pct = total > 0 ? Math.round((done / total) * 1000) / 10 : 0;
  const style = getStatusStyle(processing.status);

  return (
    <Panel title="Processing Statistics">
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Frames Processed" value={`${formatNumber(done)} / ${formatNumber(total)}`} />
        <Stat label="Keyframes Selected" value={formatNumber(processing.keyframes_selected)} />
        <Stat label="Processing Time" value={formatDuration(processing.elapsed_seconds)} />
        <Stat label="Processing Status" value={<span className={`text-sm ${style.text}`}>{style.label}</span>} />
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-[11px]">
          <span className="text-muted-foreground">Frame processing</span>
          <span className="font-mono text-foreground">{pct}%</span>
        </div>
        <Bar value={pct} />
      </div>
    </Panel>
  );
}
