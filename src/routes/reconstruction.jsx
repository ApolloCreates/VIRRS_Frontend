import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagon } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { StatusBadge } from "../components/ui/Panel";
import {
  ProcessingSummary,
  ProcessingStatistics,
  findFailedStage,
} from "../components/reconstruction/ProcessingSummary";
import { PipelineStages, StageTimeline } from "../components/reconstruction/PipelineStages";
import { getMission, DEMO_MISSION_ID } from "../api/missions";

export const Route = createFileRoute("/reconstruction")({
  head: () => ({
    meta: [
      { title: "Reconstruction — VIRRS" },
      {
        name: "description",
        content:
          "VIRRS reconstruction console: M0–M7 pipeline progress, active stage, elapsed and remaining time, and frame processing statistics.",
      },
      { property: "og:title", content: "Reconstruction — VIRRS" },
      {
        property: "og:description",
        content: "Monitor the VIRRS drone-video-to-3D processing pipeline stage by stage.",
      },
    ],
  }),
  component: ReconstructionRoute,
});

function ReconstructionRoute() {
  // Same query key as Overview: future WS updates can setQueryData here and both pages re-render.
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["mission", DEMO_MISSION_ID],
    queryFn: () => getMission(DEMO_MISSION_ID),
  });
  const processing = data?.processing;

  return (
    <AppLayout title="Reconstruction" missionId={data?.mission?.mission_id} status={processing?.status}>
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isPending || !processing ? (
        <ReconSkeleton />
      ) : (
        <Reconstruction missionId={data.mission.mission_id} processing={processing} />
      )}
    </AppLayout>
  );
}

function Reconstruction({ missionId, processing }) {
  const [selectedId, setSelectedId] = useState(
    () => processing.current_stage || findFailedStage(processing)?.id || "M0",
  );

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-3">
        <div>
          <h2 className="text-lg font-semibold tracking-wide text-foreground">Reconstruction</h2>
          <p className="text-xs text-muted-foreground">Mission processing pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-foreground">{missionId}</span>
          <StatusBadge status={processing.status} />
        </div>
      </header>

      <ProcessingSummary processing={processing} />
      <PipelineStages processing={processing} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="grid grid-cols-[1.3fr_1fr] gap-4 max-lg:grid-cols-1">
        <StageTimeline processing={processing} selectedId={selectedId} onSelect={setSelectedId} />
        <ProcessingStatistics processing={processing} />
      </div>
    </div>
  );
}

function ReconSkeleton() {
  const S = ({ h }) => <div className={`animate-pulse rounded-sm bg-secondary ${h}`} />;
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4" aria-busy="true">
      <S h="h-12" />
      <S h="h-[130px]" />
      <S h="h-[190px]" />
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <S h="h-[260px]" />
        <S h="h-[260px]" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-sm rounded-sm border border-status-crit/40 bg-card px-6 py-7 text-center">
        <AlertOctagon className="mx-auto size-5 text-status-crit" aria-hidden="true" />
        <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
          Processing data unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Unable to load reconstruction state.</p>
        <button
          type="button"
          onClick={() => onRetry()}
          className="mt-4 rounded-sm border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-foreground hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-ring"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
