import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ title, missionId, status, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} missionId={missionId} status={status} />
        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</main>
      </div>
    </div>
  );
}

export function PlaceholderModule({ title, message }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-sm rounded-sm border border-border bg-card px-6 py-8 text-center">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Coming in the next implementation phase.
        </p>
      </div>
    </div>
  );
}
