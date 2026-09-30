export function MapContext({ scene, full = false }) {
  const scale = 0.62;
  const pts = scene.trajectory.map(([x, , z]) => `${100 + x * scale},${100 + z * scale}`).join(' ');
  const roadPoints = (points) => points.map(([x, z]) => [100 + x * scale, 100 + z * scale].join(',')).join(' ');
  return (
    <div className={`relative ${full ? 'h-full min-h-[560px]' : 'h-[180px]'} overflow-hidden rounded-sm border border-border bg-[#11181d]`}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs><pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#263138" strokeWidth="0.7" /></pattern></defs>
        <rect width="200" height="200" fill="url(#map-grid)" />
        {scene.roads.map((r) => (
          <polyline
            key={r.id}
            points={roadPoints(r.points)}
            fill="none"
            stroke="#697780"
            strokeWidth={Math.max(1, r.width * scale / 3)}
            opacity="0.7"
          />
        ))}
        {scene.buildings.map((b) => <rect key={b.id} x={100+(b.x-b.w/2)*scale} y={100+(b.z-b.d/2)*scale} width={b.w*scale} height={b.d*scale} fill={b.source === 'inferred' ? 'none' : '#697780'} stroke="#9aa7b0" strokeWidth="0.6" opacity="0.7" strokeDasharray={b.source === 'inferred' ? '2 2' : undefined} />)}
        <polyline points={pts} fill="none" stroke="#73a7d7" strokeWidth="1.2" />
        <circle cx={100} cy={100} r="2" fill="#d4b36a" />
      </svg>
      <span className="absolute left-3 top-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">2D Context</span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] text-muted-foreground">N ↑</span>
    </div>
  );
}
