// Shared formatting + status helpers. Keep all status styling logic here.

export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export function formatClock(seconds) {
  if (seconds === null || seconds === undefined) return "—";
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatFileSize(megabytes) {
  if (megabytes === null || megabytes === undefined) return "—";
  if (megabytes >= 1024) return `${(megabytes / 1024).toFixed(2)} GB`;
  return `${megabytes} MB`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US");
}

export function formatMeters(value, digits = 2) {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)} m`;
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}%`;
}

const STATUS_STYLES = {
  completed: {
    label: "Completed",
    dot: "bg-status-ok",
    text: "text-status-ok",
    badge: "border-status-ok/35 bg-status-ok/10 text-status-ok",
  },
  processing: {
    label: "Processing",
    dot: "bg-status-active animate-pulse-soft",
    text: "text-status-active",
    badge: "border-status-active/35 bg-status-active/10 text-status-active",
  },
  running: {
    label: "Processing",
    dot: "bg-status-active animate-pulse-soft",
    text: "text-status-active",
    badge: "border-status-active/35 bg-status-active/10 text-status-active",
  },
  pending: {
    label: "Pending",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
    badge: "border-border bg-secondary text-muted-foreground",
  },
  queued: {
    label: "Queued",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
    badge: "border-border bg-secondary text-muted-foreground",
  },
  warning: {
    label: "Warning",
    dot: "bg-status-warn",
    text: "text-status-warn",
    badge: "border-status-warn/35 bg-status-warn/10 text-status-warn",
  },
  failed: {
    label: "Failed",
    dot: "bg-status-crit",
    text: "text-status-crit",
    badge: "border-status-crit/35 bg-status-crit/10 text-status-crit",
  },
};

export function getStatusStyle(status) {
  const key = String(status || "").toLowerCase();
  return STATUS_STYLES[key] || STATUS_STYLES.pending;
}

export function getSeverityStyle(severity) {
  const key = String(severity || "").toLowerCase();
  if (key === "critical") return getStatusStyle("failed");
  if (key === "warning") return getStatusStyle("warning");
  return getStatusStyle("processing");
}
