import { Crosshair, Ruler, Square, Triangle, MapPin } from 'lucide-react';

const TOOLS = [
  ['distance', 'Distance', Ruler],
  ['height', 'Height', Triangle],
  ['area', 'Area', Square],
  ['volume', 'Volume', Crosshair],
  ['coordinate', 'Coordinate', MapPin],
];

export function MeasurementToolbar({ activeTool, onTool }) {
  return (
    <div className="flex flex-wrap gap-1">
      {TOOLS.map(([key, label, Icon]) => (
        <button key={key} type="button" onClick={() => onTool(activeTool === key ? null : key)} title={label} className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] ${activeTool === key ? 'border-accent/50 bg-accent/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}>
          <Icon className="size-3.5" />{label}
        </button>
      ))}
    </div>
  );
}
