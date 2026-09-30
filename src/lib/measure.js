import { DEMO_LOCAL_ORIGIN } from "../mocks/demoScene";

// Pure measurement helpers. Points are [x, y, z] in metres (scene frame).

export const TOOL_POINTS = { distance: 2, height: 2, coordinate: 1, area: Infinity, volume: Infinity };

export function distance3d(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function polygonArea(points) {
  // Planar (XZ) shoelace approximation.
  let s = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, , z1] = points[i];
    const [x2, , z2] = points[(i + 1) % points.length];
    s += x1 * z2 - x2 * z1;
  }
  return Math.abs(s) / 2;
}

export function boundingVolume(points) {
  const ext = (i) => Math.max(...points.map((p) => p[i])) - Math.min(...points.map((p) => p[i]));
  return ext(0) * ext(1) * ext(2);
}

export function toDemoLocal([x, y, z]) {
  return {
    easting: DEMO_LOCAL_ORIGIN.easting + x,
    northing: DEMO_LOCAL_ORIGIN.northing - z,
    elevation: DEMO_LOCAL_ORIGIN.elevation + y,
  };
}

const fmt = (v, d = 1) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export function computeMeasurement(tool, pts) {
  if (tool === "distance" && pts.length === 2)
    return { label: "Distance", value: `${fmt(distance3d(pts[0], pts[1]))} m` };
  if (tool === "height" && pts.length === 2)
    return { label: "Height", value: `${fmt(Math.abs(pts[1][1] - pts[0][1]))} m` };
  if (tool === "area" && pts.length >= 3)
    return { label: "Area", value: `${fmt(polygonArea(pts), 0)} m²` };
  if (tool === "volume" && pts.length >= 2)
    return {
      label: "Estimated Volume",
      value: `${fmt(boundingVolume(pts), 0)} m³`,
      note: "Bounding-box estimate of selected points. Not authoritative.",
    };
  if (tool === "coordinate" && pts.length === 1) {
    const c = toDemoLocal(pts[0]);
    return {
      label: "Coordinates",
      rows: [
        ["Easting", `${fmt(c.easting, 2)} m`],
        ["Northing", `${fmt(c.northing, 2)} m`],
        ["Elevation", `${fmt(c.elevation, 2)} m`],
      ],
      note: "DEMO LOCAL COORDINATES — not a projected CRS.",
    };
  }
  return null;
}
