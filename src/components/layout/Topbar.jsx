import { StatusBadge } from "../ui/Panel";

export function Topbar({ title, missionId, status }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-5">
      <h1 className="text-sm font-semibold tracking-wide text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {missionId && (
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Mission
            </span>
            <span className="font-mono text-xs text-foreground">{missionId}</span>
          </div>
        )}
        {status && <StatusBadge status={status} />}
      </div>
    </header>
  );
}
