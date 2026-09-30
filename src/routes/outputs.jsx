import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AlertOctagon, Loader2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/Panel';
import { getMission, DEMO_MISSION_ID } from '../api/missions';
import { QualityMetrics } from '../components/outputs/QualityMetrics';
import { CoveragePanel } from '../components/outputs/CoveragePanel';
import { WarningsPanel } from '../components/outputs/WarningsPanel';
import { ProductTable } from '../components/outputs/ProductTable';
import { TrustDetails } from '../components/outputs/TrustDetails';
import { demoProducts, demoQa } from '../mocks/outputData';

export const Route = createFileRoute('/outputs')({
  head: () => ({ meta: [{ title: 'Outputs & QA — VIRRS' }, { name: 'description', content: 'VIRRS reconstruction products and quality analysis.' }] }),
  component: OutputsRoute,
});

function OutputsRoute() {
  const missionQuery = useQuery({ queryKey: ['mission', DEMO_MISSION_ID], queryFn: () => getMission(DEMO_MISSION_ID) });
  const mission = missionQuery.data?.mission;
  const qa = missionQuery.data?.qa;
  const mergedQa = qa ? { ...qa, warnings: demoQa.warnings, gnss: { ...qa.gnss, time_offset_seconds: 0.012 } } : null;

  return (
    <AppLayout title="Outputs & QA" missionId={mission?.mission_id} status={mission?.status}>
      {missionQuery.isError ? <ErrorState /> : missionQuery.isPending || !mission || !qa ? <LoadingState /> : (
        <div className="mx-auto flex max-w-[1800px] flex-col gap-3">
          <header className="flex items-end justify-between gap-4 border-b border-border pb-3">
            <div><h2 className="text-lg font-semibold tracking-wide text-foreground">Outputs &amp; QA</h2><p className="text-xs text-muted-foreground">Verify reconstruction quality and export geospatial products</p></div>
            <div className="flex items-center gap-3"><span className="font-mono text-xs text-muted-foreground">{mission.mission_id}</span><StatusBadge status={mission.status} label="Completed" /></div>
          </header>

          <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-3 max-xl:grid-cols-1">
            <QualityMetrics qa={mergedQa} />
            <CoveragePanel coverage={mergedQa.coverage} />
            <WarningsPanel warnings={mergedQa.warnings} />
          </div>

          <ProductTable products={demoProducts} />

          <TrustDetails qa={mergedQa} mission={mission} />

          <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
            <section className="rounded-sm border border-border bg-card px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Processing Timing</p><div className="mt-3 grid grid-cols-3 gap-3 text-[10px]"><Timing label="Total" value={demoQa.timing.totalProcessing} /><Timing label="Time Offset" value={demoQa.timing.timeOffset} /><Timing label="Pipeline" value={qa.provenance.pipeline_version} /></div></section>
            <section className="rounded-sm border border-border bg-card px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Coverage Interpretation</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Observed geometry is directly supported by the reconstruction. Inferred geometry is kept as a separate layer so analysts can distinguish filled or completed regions from directly observed structure.</p></section>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Timing({ label, value }) { return <div><p className="text-muted-foreground">{label}</p><p className="mt-1 font-mono text-foreground">{value}</p></div>; }
function LoadingState() { return <div className="flex h-full items-center justify-center"><div className="flex items-center gap-2 rounded-sm border border-border bg-card px-5 py-4 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading outputs &amp; QA</div></div>; }
function ErrorState() { return <div className="flex h-full items-center justify-center"><div className="max-w-sm rounded-sm border border-status-crit/40 bg-card px-6 py-7 text-center"><AlertOctagon className="mx-auto size-5 text-status-crit" /><h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]">Mission data unavailable</h2><p className="mt-2 text-sm text-muted-foreground">Unable to load outputs and QA data.</p></div></div>; }
