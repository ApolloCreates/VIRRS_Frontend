import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertOctagon, Inbox } from "lucide-react";

import { AppLayout } from "../components/layout/AppLayout";
import { MissionHeader } from "../components/overview/MissionHeader";
import { MetricStrip } from "../components/overview/MetricStrip";
import { PipelineStatus } from "../components/overview/PipelineStatus";
import { QASummary } from "../components/overview/QASummary";
import { SensorStatus } from "../components/overview/SensorStatus";
import { MissionInfo } from "../components/overview/MissionInfo";
import { getMission, DEMO_MISSION_ID } from "../api/missions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Overview — VIRRS" },
      {
        name: "description",
        content:
          "VIRRS mission overview: processing pipeline status, accuracy, coverage and sensor availability for single-pass drone video to 3D reconstruction.",
      },
      { property: "og:title", content: "Mission Overview — VIRRS" },
      {
        property: "og:description",
        content:
          "Pipeline status M0–M7, accuracy and coverage metrics, and mission inputs for a VIRRS reconstruction mission.",
      },
    ],
  }),
  component: OverviewRoute,
});

function OverviewRoute() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["mission", DEMO_MISSION_ID],
    queryFn: () => getMission(DEMO_MISSION_ID),
  });

  return (
    <AppLayout
      title="Overview"
      missionId={data?.mission?.mission_id}
      status={data?.mission?.status}
    >
      {isPending && <OverviewSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isPending && !isError && !data && <EmptyState />}
      {!isPending && !isError && data && <Overview missionState={data} />}
    </AppLayout>
  );
}

function Overview({ missionState }) {
  const { mission, processing, qa } = missionState;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
      <MissionHeader mission={mission} />
      <MetricStrip processing={processing} qa={qa} />
      <PipelineStatus processing={processing} />
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 max-lg:grid-cols-1">
        <QASummary qa={qa} />
        <SensorStatus sensors={mission.sensors} />
      </div>
      <MissionInfo mission={mission} pipelineVersion={qa.provenance.pipeline_version} />
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-sm bg-secondary ${className}`} />;
}

function OverviewSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4" aria-busy="true">
      <p className="text-xs text-muted-foreground">Loading mission data…</p>
      <Skeleton className="h-16" />
      <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[78px]" />
        ))}
      </div>
      <Skeleton className="h-[120px]" />
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 max-lg:grid-cols-1">
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[180px]" />
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
          Mission data unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Unable to load mission state.</p>
        <button
          type="button"
          onClick={() => onRetry()}
          className="mt-4 rounded-sm border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-sm rounded-sm border border-border bg-card px-6 py-7 text-center">
        <Inbox className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
          No active mission
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select or load a mission to begin analysis.
        </p>
      </div>
    </div>
  );
}
