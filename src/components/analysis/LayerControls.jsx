import { Eye, EyeOff } from 'lucide-react';

const LAYERS = [
  ['terrain', 'Terrain'],
  ['buildings', 'Buildings'],
  ['roads', 'Roads'],
  ['vegetation', 'Vegetation'],
  ['obstacles', 'Obstacles'],
  ['trajectory', 'Flight Trajectory'],
  ['confidence', 'Confidence'],
  ['observed', 'Observed'],
  ['inferred', 'Inferred'],
];

export function LayerControls({ layers, onToggle }) {
  return (
    <div className="space-y-1">
      {LAYERS.map(([key, label]) => {
        const enabled = layers[key];
        return (
          <button key={key} type="button" onClick={() => onToggle(key)} className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs hover:bg-secondary">
            <span className="text-muted-foreground">{label}</span>
            {enabled ? <Eye className="size-3.5 text-foreground" /> : <EyeOff className="size-3.5 text-muted-foreground/50" />}
          </button>
        );
      })}
      <div className="mt-3 border-t border-border pt-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#9aa7b0]" />Observed</div>
        <div className="mt-1 flex items-center gap-2"><span className="size-2 border border-dashed border-[#7c8790]" />Inferred</div>
      </div>
    </div>
  );
}
