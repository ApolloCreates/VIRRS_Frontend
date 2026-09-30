import { Panel } from "../ui/Panel";
import { formatClock, formatFileSize } from "../../lib/mission-format";

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-1.5 text-xs last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

export function MissionInfo({ mission, pipelineVersion }) {
  const { video, coordinate_system: crs } = mission;

  return (
    <Panel
      title="Mission Technical Information"
      action={
        <span className="font-mono text-[11px] text-muted-foreground">
          Pipeline {pipelineVersion || "—"}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-x-8 max-md:grid-cols-1">
        <div>
          <Row label="Video" value={video.filename} />
          <Row label="Resolution" value={video.resolution} />
          <Row label="FPS" value={video.fps} />
          <Row label="Duration" value={formatClock(video.duration_seconds)} />
        </div>
        <div>
          <Row label="Size" value={formatFileSize(video.size_mb)} />
          <Row label="CRS" value={crs.epsg ? `EPSG:${crs.epsg}` : "—"} />
          <Row label="Vertical Datum" value={crs.vertical_datum || "—"} />
          <Row label="Mission ID" value={mission.mission_id} />
        </div>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground/70">
        Synthetic demonstration values — not measured mission results.
      </p>
    </Panel>
  );
}
