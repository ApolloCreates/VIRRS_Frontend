import { Check, Loader2, Circle, X } from "lucide-react";
import { Panel, StatusBadge } from "../ui/Panel";
import { PIPELINE_STAGES } from "../../schemas/missionSchemas";
import { formatDuration, getStatusStyle } from "../../lib/mission-format";

function StageIcon({ status }) {
  const key = String(status || "").toLowerCase();
  if (key === "completed") return <Check className="size-3" aria-hidden="true" />;
  if (key === "processing" || key === "running")
    return <Loader2 className="size-3 animate-spin" aria-hidden="true" />;
  if (key === "failed") return <X className="size-3" aria-hidden="true" />;
  return <Circle className="size-2.5" aria-hidden="true" />;
}

function PipelineStage({ meta, stage, selected, onSelect }) {
  const style = getStatusStyle(stage.status);
  const progress = Math.max(0, Math.min(100, stage.progress || 0));
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${meta.id} ${meta.name}, ${style.label}`}
      onClick={onSelect}
      className={`flex w-[150px] shrink-0 flex-col gap-2 rounded-sm border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        selected ? "border-accent/60 bg-secondary" : "border-border bg-secondary/40 hover:bg-secondary"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`flex size-4 items-center justify-center rounded-full border ${style.badge}`}>
          <StageIcon status={stage.status} />
        </span>
        <span className="font-mono text-xs font-semibold text-foreground">{meta.id}</span>
        <span className={`ml-auto text-[10px] uppercase tracking-[0.1em] ${style.text}`}>
          {style.label}
        </span>
      </span>
      <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {meta.name}
      </span>
      <span className="h-1 w-full overflow-hidden rounded-full bg-background">
        <span className={`block h-full ${style.dot}`} style={{ width: `${progress}%` }} />
      </span>
      <span className="flex justify-between font-mono text-[11px] text-foreground">
        <span>{progress}%</span>
        <span className="text-muted-foreground">{formatDuration(stage.elapsed_seconds)}</span>
      </span>
    </button>
  );
}

export function PipelineStages({ processing, selectedId, onSelect }) {
  const selectedMeta = PIPELINE_STAGES.find((s) => s.id === selectedId);
  const selectedStage = selectedId ? processing.stages[selectedId] || {} : null;

  return (
    <Panel title="Pipeline · M0 → M7">
      <ol className="flex items-center overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((meta, i) => (
          <li key={meta.id} className="flex items-center">
            <PipelineStage
              meta={meta}
              stage={processing.stages[meta.id] || {}}
              selected={selectedId === meta.id}
              onSelect={() => onSelect(meta.id)}
            />
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="h-px w-4 shrink-0 bg-border" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      {selectedMeta && selectedStage && (
        <div className="mt-3 rounded-sm border border-border bg-secondary/40 px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Selected Stage
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-mono text-sm text-foreground">
              {selectedMeta.id} — {selectedMeta.name}
            </span>
            <StatusBadge status={selectedStage.status} />
            <Detail label="Progress" value={`${selectedStage.progress ?? 0}%`} />
            <Detail label="Elapsed" value={formatDuration(selectedStage.elapsed_seconds)} />
          </div>
        </div>
      )}
    </Panel>
  );
}

function Detail({ label, value }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </span>
  );
}

export function StageTimeline({ processing, selectedId, onSelect }) {
  return (
    <Panel title="Stage Timeline">
      <ul className="divide-y divide-border">
        {PIPELINE_STAGES.map((meta) => {
          const stage = processing.stages[meta.id] || {};
          const style = getStatusStyle(stage.status);
          return (
            <li key={meta.id}>
              <button
                type="button"
                onClick={() => onSelect(meta.id)}
                className={`grid w-full grid-cols-[40px_1fr_110px_70px] items-center gap-3 px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-ring ${
                  selectedId === meta.id ? "bg-secondary/60" : ""
                }`}
              >
                <span className="font-mono text-foreground">{meta.id}</span>
                <span className="truncate text-muted-foreground">{meta.name}</span>
                <span className={`flex items-center gap-2 ${style.text}`}>
                  <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                  {style.label}
                </span>
                <span className="text-right font-mono text-foreground">
                  {formatDuration(stage.elapsed_seconds)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
