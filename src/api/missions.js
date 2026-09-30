import { mockMissionState, DEMO_MISSION_ID } from "../mocks/missionState";

// Data access layer. Components/pages must go through this module, never
// through the mocks directly. Later this becomes GET /api/missions/{mission_id}
// without any change to the consuming components.

const LATENCY_MS = 350;

export async function getMission(missionId = DEMO_MISSION_ID) {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  if (!missionId) {
    return null; // no mission selected -> empty state
  }

  if (missionId !== mockMissionState.mission.mission_id) {
    throw new Error(`Mission ${missionId} not found`);
  }

  return mockMissionState;
}

export { DEMO_MISSION_ID };
