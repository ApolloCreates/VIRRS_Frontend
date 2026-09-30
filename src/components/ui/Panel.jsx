import { getStatusStyle } from "../../lib/mission-format";

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-sm border border-border bg-card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function StatusBadge({ status, label }) {
  const style = getStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-sm border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${style.badge}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label || style.label}
    </span>
  );
}
