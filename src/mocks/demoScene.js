// SYNTHETIC DEMO SCENE — not measured mission data.
// Isolated here so the viewer can later consume real reconstruction products
// (mesh, trajectory, object metadata) with the same shape.
// Units: 1 scene unit = 1 m, local frame. x = east, z = south (-z = north), y = up.

export const SCENE_EXTENT = 200; // m, square footprint centered on origin

// Demo local origin used only for displaying DEMO LOCAL coordinates.
export const DEMO_LOCAL_ORIGIN = { easting: 1000, northing: 1000, elevation: 100 };

export function terrainHeight(x, z) {
  return (
    1.8 * Math.sin(x / 34) +
    1.4 * Math.cos(z / 27) +
    0.8 * Math.sin((x + z) / 19) +
    0.012 * x
  );
}

// Synthetic confidence 0..1: lower toward the edges and in one occluded patch.
export function terrainConfidence(x, z) {
  const r = Math.hypot(x, z) / (SCENE_EXTENT / 2);
  const patch = Math.exp(-((x - 55) ** 2 + (z + 50) ** 2) / 900);
  return Math.max(0.15, Math.min(1, 1.05 - 0.55 * r * r - 0.5 * patch));
}

const b = (id, x, z, w, d, h, source, confidence) => ({
  id,
  type: "Building",
  x,
  z,
  w,
  d,
  h,
  source,
  confidence,
});

export const demoBuildings = [
  b("B-01", -48, -38, 18, 14, 9, "observed", 0.94),
  b("B-02", -22, -40, 12, 16, 14, "observed", 0.9),
  b("B-03", -50, -8, 22, 12, 6, "observed", 0.88),
  b("B-04", -18, -12, 10, 10, 21, "observed", 0.83),
  b("B-05", 22, -36, 16, 20, 11, "observed", 0.86),
  b("B-06", 46, -34, 12, 12, 8, "inferred", 0.42),
  b("B-07", 24, 18, 20, 14, 7, "observed", 0.79),
  b("B-08", 50, 22, 14, 18, 12, "inferred", 0.36),
  b("B-09", -40, 30, 16, 16, 5, "observed", 0.71),
  b("B-10", -14, 36, 12, 10, 9, "inferred", 0.48),
  b("B-11", 58, -58, 10, 12, 6, "inferred", 0.3),
];

// Roads: polylines of [x, z] with a width.
export const demoRoads = [
  { id: "R-01", type: "Road", width: 7, source: "observed", confidence: 0.92,
    points: [[-100, -24], [-30, -25], [10, -22], [100, -20]] },
  { id: "R-02", type: "Road", width: 6, source: "observed", confidence: 0.87,
    points: [[4, -100], [5, -40], [6, 0], [8, 60], [10, 100]] },
  { id: "R-03", type: "Road", width: 5, source: "inferred", confidence: 0.45,
    points: [[6, 4], [40, 5], [72, 6], [100, 4]] },
];

// Deterministic pseudo-random trees.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
export const demoTrees = (() => {
  const r = rng(42);
  const trees = [];
  while (trees.length < 140) {
    const x = (r() - 0.5) * 190;
    const z = (r() - 0.5) * 190;
    const nearRoad = Math.abs(z + 23) < 7 || Math.abs(x - 6) < 7 || (x > 0 && Math.abs(z - 5) < 6);
    const inBuilding = demoBuildings.some(
      (bd) => Math.abs(x - bd.x) < bd.w / 2 + 3 && Math.abs(z - bd.z) < bd.d / 2 + 3,
    );
    if (nearRoad || inBuilding) continue;
    trees.push({ x, z, s: 0.7 + r() * 0.7 });
  }
  return trees;
})();

// UAV trajectory: lawnmower survey pattern at ~60 m AGL.
export const demoTrajectory = (() => {
  const pts = [];
  const legs = 6;
  for (let i = 0; i < legs; i++) {
    const x = -80 + (160 / (legs - 1)) * i;
    const zs = i % 2 === 0 ? [-85, 85] : [85, -85];
    for (let t = 0; t <= 10; t++) {
      const z = zs[0] + ((zs[1] - zs[0]) * t) / 10;
      pts.push([x, 60 + terrainHeight(x, z) + Math.sin(t / 2) * 0.8, z]);
    }
  }
  return pts;
})();

export const demoObstacles = [
  { id: 'O-01', type: 'Obstacle', x: 74, z: -12, h: 5, source: 'observed', confidence: 0.82 },
  { id: 'O-02', type: 'Obstacle', x: -68, z: 58, h: 3, source: 'inferred', confidence: 0.46 },
  { id: 'O-03', type: 'Obstacle', x: 38, z: 68, h: 4, source: 'observed', confidence: 0.76 },
];

export const demoUavPosition = demoTrajectory[Math.floor(demoTrajectory.length * 0.62)];

export const demoScene = {
  demo: true,
  extent: SCENE_EXTENT,
  buildings: demoBuildings,
  roads: demoRoads,
  trees: demoTrees,
  obstacles: demoObstacles,
  trajectory: demoTrajectory,
  uavPosition: demoUavPosition,
};
