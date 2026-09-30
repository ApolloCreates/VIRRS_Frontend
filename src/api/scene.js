import { demoScene } from "../mocks/demoScene";

// Scene data access. Later: fetch reconstruction products from the backend
// (mesh / tiles / trajectory) and return the same shape.
export const DEMO_MODE = true;

export async function getReconstructionScene(missionId) {
  await new Promise((r) => setTimeout(r, 400));
  if (!missionId) return null;
  return DEMO_MODE ? demoScene : null;
}
