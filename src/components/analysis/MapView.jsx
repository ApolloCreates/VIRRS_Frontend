import { MapContext } from './MapContext';

export function MapView({ scene }) {
  return (
    <div className="relative h-full min-h-[560px] overflow-hidden rounded-sm border border-border bg-[#11181d]">
      <MapContext scene={scene} full />
      <div className="pointer-events-none absolute left-3 bottom-3 rounded-sm border border-border bg-card/90 px-2.5 py-1.5 text-[10px] text-muted-foreground backdrop-blur-sm">
        DEMO LOCAL MAP · EPSG:32643
      </div>
    </div>
  );
}
