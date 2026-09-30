import { Panel } from '../ui/Panel';

export function TrustDetails({ qa, mission }) {
  return (
    <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
      <Panel title="GNSS / Time Sync">
        <div className="space-y-2 text-[10px]"><Row label="Time offset" value={`${qa.gnss.time_offset_seconds.toFixed(3)} s`} /><Row label="Residual source" value="GNSS factor graph" /><Row label="Dropout intervals" value={qa.gnss.dropout_intervals.length ? `${qa.gnss.dropout_intervals.length} detected` : 'None reported'} /></div>
      </Panel>
      <Panel title="Coordinate Reference">
        <div className="space-y-2 text-[10px]"><Row label="CRS" value={`EPSG:${mission.coordinate_system.epsg}`} /><Row label="Vertical datum" value={mission.coordinate_system.vertical_datum} /><Row label="Accuracy target" value={`≤ ${qa.accuracy.target_m.toFixed(1)} m`} /></div>
      </Panel>
      <Panel title="Provenance">
        <div className="space-y-2 text-[10px]"><Row label="Pipeline" value={qa.provenance.pipeline_version} /><Row label="Mission" value={qa.provenance.mission_id} /><Row label="Input hashes" value={`${qa.provenance.input_file_hashes.length} recorded`} /></div>
      </Panel>
    </div>
  );
}

function Row({ label, value }) { return <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-mono text-foreground">{value}</span></div>; }
