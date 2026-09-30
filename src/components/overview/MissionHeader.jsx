import { StatusBadge } from "../ui/Panel";
import { formatClock } from "../../lib/mission-format";

export function MissionHeader({ mission }) {
  const { video, coordinate_system: crs } = mission;

  return (
    <div className="flex items-start justify-between gap-6 border-b border-border pb-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Mission Overview
        </p>
        <h2 className="mt-1 font-mono text-xl text-foreground">{mission.mission_id}</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="text-foreground/90">{video.filename}</span>
          <span className="mx-2 text-border">|</span>
          {video.resolution} · {video.fps} FPS · {formatClock(video.duration_seconds)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={mission.status} />
        <p className="font-mono text-[11px] text-muted-foreground">
          EPSG:{crs.epsg ?? "—"} · {crs.vertical_datum || "—"}
        </p>
      </div>
    </div>
  );
}
