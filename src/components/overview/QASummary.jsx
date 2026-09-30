import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Panel } from "../ui/Panel";
import { formatMeters, formatPercent, getSeverityStyle } from "../../lib/mission-format";

function Value({ label, value, note }) {
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-lg leading-none text-foreground">{value}</span>
      {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
    </div>
  );
}

export function QASummary({ qa }) {
  const warnings = qa.warnings || [];

  return (
    <Panel
      title="Quality & Trust"
      action={
        <span className="font-mono text-[11px] text-muted-foreground">
          Target ≤ {qa.accuracy.target_m.toFixed(1)} m
        </span>
      }
    >
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
        <Value label="CE90" value={formatMeters(qa.accuracy.ce90_m)} note="Horizontal" />
        <Value label="LE90" value={formatMeters(qa.accuracy.le90_m)} note="Vertical" />
        <Value
          label="Observed"
          value={formatPercent(qa.coverage.observed_percent)}
          note="Directly measured"
        />
        <Value
          label="Inferred"
          value={formatPercent(qa.coverage.inferred_percent)}
          note="Estimated, not observed"
        />
      </div>

      <div className="mt-4 border-t border-border pt-3">
        {warnings.length === 0 ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-status-ok" aria-hidden="true" />
            No active warnings
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {warnings.map((warning, index) => {
              const style = getSeverityStyle(warning.severity);
              return (
                <li
                  key={`${warning.severity}-${index}`}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <AlertTriangle className={`mt-0.5 size-3.5 ${style.text}`} aria-hidden="true" />
                  <span>
                    <span
                      className={`mr-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${style.text}`}
                    >
                      {warning.severity}
                    </span>
                    {warning.message}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}
