import { Suspense, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AlertOctagon, Box, Loader2, Map, ScanLine } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge, Panel } from '../components/ui/Panel';
import { getMission, DEMO_MISSION_ID } from '../api/missions';
import { getReconstructionScene } from '../api/scene';
import { SceneViewer } from '../components/analysis/SceneViewer';
import { AnalysisPanel } from '../components/analysis/AnalysisPanel';
import { MapView } from '../components/analysis/MapView';
import { computeMeasurement, TOOL_POINTS } from '../lib/measure';

export const Route = createFileRoute('/analysis')({
  head: () => ({ meta: [{ title: '3D Analysis — VIRRS' }, { name: 'description', content: 'VIRRS geospatial reconstruction analysis workspace.' }] }),
  component: AnalysisRoute,
});

function AnalysisRoute() {
  const missionQuery = useQuery({ queryKey: ['mission', DEMO_MISSION_ID], queryFn: () => getMission(DEMO_MISSION_ID) });
  const sceneQuery = useQuery({ queryKey: ['scene', DEMO_MISSION_ID], queryFn: () => getReconstructionScene(DEMO_MISSION_ID) });
  const [layers, setLayers] = useState({ terrain: true, buildings: true, roads: true, vegetation: true, obstacles: false, trajectory: true, confidence: false, observed: true, inferred: true });
  const [viewMode, setViewMode] = useState('3d');
  const [displayMode, setDisplayMode] = useState('mesh');
  const [activeTool, setActiveTool] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);

  const measurement = useMemo(() => activeTool ? computeMeasurement(activeTool, points) : null, [activeTool, points]);

  const onPoint = (point) => {
    if (!activeTool) return;
    const limit = TOOL_POINTS[activeTool];
    if (limit !== Infinity && points.length >= limit) setPoints([point]);
    else setPoints((p) => [...p, point]);
  };
  const onTool = (tool) => { setActiveTool(tool); setPoints([]); };
  const onToggle = (key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const mission = missionQuery.data?.mission;
  const scene = sceneQuery.data;
  const loading = missionQuery.isPending || sceneQuery.isPending;

  return (
    <AppLayout title="3D Analysis" missionId={mission?.mission_id} status={mission?.status}>
      {missionQuery.isError || sceneQuery.isError ? <ErrorState /> : loading || !mission || !scene ? <LoadingState /> : (
        <div className="mx-auto flex max-w-[1800px] flex-col gap-3">
          <header className="flex items-end justify-between gap-4 border-b border-border pb-3">
            <div><h2 className="text-lg font-semibold tracking-wide text-foreground">3D Analysis</h2><p className="text-xs text-muted-foreground">Geospatial reconstruction workspace</p></div>
            <div className="flex items-center gap-3"><span className="font-mono text-xs text-muted-foreground">{mission.mission_id}</span><StatusBadge status="completed" label="PLY Reconstruction" /></div>
          </header>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-card p-1">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setViewMode('3d')} className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${viewMode === '3d' ? 'bg-accent text-background' : 'text-muted-foreground hover:text-foreground'}`}><Box className="size-3.5" />3D View</button>
              <button type="button" onClick={() => setViewMode('map')} className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${viewMode === 'map' ? 'bg-accent text-background' : 'text-muted-foreground hover:text-foreground'}`}><Map className="size-3.5" />Map View</button>
            </div>
            {viewMode === '3d' && (
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setDisplayMode('pointcloud')} className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${displayMode === 'pointcloud' ? 'bg-accent text-background' : 'text-muted-foreground hover:text-foreground'}`}><ScanLine className="size-3.5" />Point Cloud</button>
                <button type="button" onClick={() => setDisplayMode('mesh')} className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${displayMode === 'mesh' ? 'bg-accent text-background' : 'text-muted-foreground hover:text-foreground'}`}><Box className="size-3.5" />Textured Mesh</button>
              </div>
            )}
          </div>
          <div className="grid min-h-[calc(100vh-205px)] grid-cols-[minmax(0,1fr)_310px] gap-3 max-xl:grid-cols-1">
            <div className="flex min-h-0 flex-col gap-3">
              <div className="min-h-0 flex-1">
                {viewMode === '3d' ? (
                  <Suspense fallback={<PointCloudLoading />}><SceneViewer scene={scene} layers={layers} tool={activeTool} measurementPoints={points} onPoint={onPoint} onSelectObject={setSelectedObject} displayMode={displayMode} /></Suspense>
                ) : (
                  <MapView scene={scene} />
                )}
              </div>
              <div className="grid grid-cols-[1fr_220px] gap-3 max-md:grid-cols-1">
                <Panel title="Measurement Tools"><div className="flex flex-wrap gap-2">{['distance','height','area','volume','coordinate'].map((tool) => <button key={tool} type="button" onClick={() => onTool(tool)} className={`rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${activeTool === tool ? 'border-accent/50 bg-accent/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>{tool}</button>)}</div></Panel>
                <Panel title="Measurement Result">{measurement ? <div><p className="font-mono text-lg text-foreground">{measurement.value}</p>{measurement.rows?.slice(0, 3).map(([k, v]) => <div key={k} className="flex justify-between text-[10px] text-muted-foreground"><span>{k}</span><span className="font-mono text-foreground">{v}</span></div>)}<p className="mt-2 text-[9px] text-muted-foreground">{measurement.note || 'Measurement in the active reconstruction frame'}</p></div> : <p className="text-[10px] text-muted-foreground">Select a measurement tool and pick points in the scene.</p>}</Panel>
              </div>
            </div>
            <AnalysisPanel layers={layers} onToggle={onToggle} activeTool={activeTool} onTool={onTool} measurement={measurement} selectedObject={selectedObject} mission={mission} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function PointCloudLoading() { return <div className="flex h-full min-h-[560px] items-center justify-center rounded-sm border border-border bg-[#0b1014]"><div className="flex items-center gap-2 rounded-sm border border-border bg-card px-5 py-4 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading 1.53M-point PLY reconstruction</div></div>; }
function LoadingState() { return <div className="flex h-full items-center justify-center"><div className="flex items-center gap-2 rounded-sm border border-border bg-card px-5 py-4 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading reconstruction</div></div>; }
function ErrorState() { return <div className="flex h-full items-center justify-center"><div className="max-w-sm rounded-sm border border-status-crit/40 bg-card px-6 py-7 text-center"><AlertOctagon className="mx-auto size-5 text-status-crit" /><h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]">Reconstruction unavailable</h2><p className="mt-2 text-sm text-muted-foreground">Unable to load the reconstruction scene.</p></div></div>; }
