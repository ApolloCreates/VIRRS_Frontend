import { useState } from "react";
import { Check, Loader2, Circle, X } from "lucide-react";
import { Panel } from "../ui/Panel";
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

export function PipelineStatus({ processing }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedStage = selectedId ? processing.stages[selectedId] : null;
  const selectedMeta = PIPELINE_STAGES.find((s) => s.id === selectedId);

  return (
    <Panel
      title="Pipeline Status"
      action={
        <span className="text-[11px] text-muted-foreground">
          Overall {processing.overall_progress}%
        </span>
      }
    >
      <ol className="flex items-stretch gap-0 overflow-x-auto pb-1">
        {PIPELINE_STAGES.map((meta, index) => {
          const stage = processing.stages[meta.id] || {};
          const style = getStatusStyle(stage.status);
          const isSelected = selectedId === meta.id;

          return (
            <li key={meta.id} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                aria-expanded={isSelected}
                aria-label={`${meta.id} ${meta.name}, ${style.label}`}
                onClick={() => setSelectedId(isSelected ? null : meta.id)}
                className={`flex min-w-[112px] flex-1 flex-col gap-1.5 rounded-sm border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  isSelected
                    ? "border-accent/50 bg-secondary"
                    : "border-border bg-secondary/40 hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex size-4 items-center justify-center rounded-full border ${style.badge}`}
                  >
                    <StageIcon status={stage.status} />
                  </span>
                  <span className="font-mono text-[11px] text-foreground">{meta.id}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {formatDuration(stage.elapsed_seconds)}
                  </span>
                </span>
                <span className="truncate text-[11px] text-muted-foreground">{meta.name}</span>
              </button>
              {index < PIPELINE_STAGES.length - 1 && (
                <span className="h-px w-3 shrink-0 bg-border" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {selectedStage && selectedMeta && (
        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-sm border border-border bg-secondary/40 px-3 py-2.5">
          <span className="font-mono text-xs text-foreground">
            {selectedMeta.id} — {selectedMeta.name}
          </span>
          <Detail label="Status" value={getStatusStyle(selectedStage.status).label} />
          <Detail label="Progress" value={`${selectedStage.progress}%`} />
          <Detail label="Elapsed" value={formatDuration(selectedStage.elapsed_seconds)} />
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
