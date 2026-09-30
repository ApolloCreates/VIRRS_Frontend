import { Panel } from '../ui/Panel';
import { LayerControls } from './LayerControls';
import { MeasurementToolbar } from './MeasurementToolbar';

export function AnalysisPanel({ layers, onToggle, activeTool, onTool, measurement, selectedObject, mission }) {
  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto">
      <Panel title="Layers"><LayerControls layers={layers} onToggle={onToggle} /></Panel>
      <Panel title="Measure" action={activeTool ? <span className="text-[10px] uppercase text-accent">{activeTool}</span> : null}>
        <MeasurementToolbar activeTool={activeTool} onTool={onTool} />
        <p className="mt-2 text-[10px] leading-4 text-muted-foreground">Select points in the scene. Measurements are calculated in the local demo frame.</p>
        {measurement && <div className="mt-3 border-t border-border pt-3"><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Result</p><p className="mt-1 font-mono text-lg text-foreground">{measurement.value}</p>{measurement.rows?.map(([k, v]) => <div key={k} className="flex justify-between text-[10px] text-muted-foreground"><span>{k}</span><span className="font-mono text-foreground">{v}</span></div>)}{measurement.note && <p className="mt-2 text-[9px] leading-3 text-muted-foreground/70">{measurement.note}</p>}</div>}
      </Panel>
      <Panel title="Selection">
        {selectedObject ? <div className="space-y-1.5 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">Object</span><span className="font-mono">{selectedObject.id}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{selectedObject.type}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="capitalize">{selectedObject.source}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="font-mono">{Math.round(selectedObject.confidence * 100)}%</span></div></div> : <p className="text-xs text-muted-foreground">Select an object in the scene to inspect it.</p>}
      </Panel>
      <Panel title="Scene">
        <div className="space-y-1.5 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">State</span><span>Reconstructed</span></div><div className="flex justify-between"><span className="text-muted-foreground">CRS</span><span className="font-mono">EPSG:{mission.coordinate_system.epsg}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Vertical</span><span>{mission.coordinate_system.vertical_datum}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="text-status-active">DEMO</span></div></div>
      </Panel>
    </aside>
  );
}
