import { useMemo, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

const PLY_URL = '/data/pointcloud/sih_1.ply';

/**
 * Converts the reconstruction coordinate frame into the
 * VIRRS / Three.js coordinate frame.
 *
 * After conversion:
 *   X = horizontal
 *   Y = UP
 *   Z = horizontal
 *
 * This is the ONLY place where the source PLY coordinate
 * system is converted.
 */
const SOURCE_TO_VIRRS = new THREE.Matrix4().set(
  -0.80163961, -0.59719520,  0.02705218, 0,
   0.55333657, -0.75837242, -0.34451402, 0,
   0.22625774, -0.26120712,  0.93839132, 0,
   0,           0,           0,           1
);

/**
 * Loads the supplied VIRRS PLY reconstruction.
 *
 * Processing order:
 *
 *   PLY
 *    ↓
 *   coordinate conversion
 *    ↓
 *   bounding box
 *    ↓
 *   local-origin translation
 *    ↓
 *   Three.js rendering
 *
 * No individual X/Y/Z values are manually modified.
 */
export function RealPointCloudLayer({
  visible = true,
  confidenceMode = false,
  onBounds,
}) {
  const sourceGeometry = useLoader(PLYLoader, PLY_URL);

  const { geometry, radius } = useMemo(() => {
    // Never modify the geometry returned by PLYLoader directly.
    const g = sourceGeometry.clone();

    /*
     * ------------------------------------------------------------
     * 1. CONVERT SOURCE COORDINATE SYSTEM → VIRRS COORDINATES
     * ------------------------------------------------------------
     *
     * IMPORTANT:
     * Do NOT use:
     *
     *     g.scale(1, -1, 1)
     *
     * anymore.
     *
     * The complete 3D coordinate transformation is performed
     * by this single matrix.
     */
    g.applyMatrix4(SOURCE_TO_VIRRS);

    /*
     * ------------------------------------------------------------
     * 2. CALCULATE BOUNDS AFTER TRANSFORMATION
     * ------------------------------------------------------------
     *
     * Bounds must be calculated after the coordinate conversion,
     * otherwise the camera framing would use the old coordinate
     * frame.
     */
    g.computeBoundingBox();

    let r = 1;
    let localOrigin = [0, 0, 0];

    if (g.boundingBox) {
      const center = new THREE.Vector3();

      g.boundingBox.getCenter(center);

      /*
       * ----------------------------------------------------------
       * 3. MOVE CLOUD TO LOCAL ORIGIN
       * ----------------------------------------------------------
       *
       * This does NOT scale the cloud.
       *
       * It only subtracts the center so that Three.js renders
       * around (0,0,0), avoiding floating-point precision issues.
       */
      g.translate(
        -center.x,
        -center.y,
        -center.z
      );

      localOrigin = center.toArray();

      /*
       * Calculate scene radius from the transformed cloud.
       */
      const size = new THREE.Vector3();

      g.boundingBox.getSize(size);

      r = Math.max(
        size.length() * 0.5,
        0.5
      );

      /*
       * Recalculate the sphere after translation.
       */
      g.computeBoundingSphere();

      g.userData = {
        localOrigin,
        vertexCount:
          g.getAttribute('position')?.count ?? 0,
        radius: r,
      };
    }

    return {
      geometry: g,
      radius: r,
    };
  }, [sourceGeometry]);

  /*
   * Report bounds to the parent viewer.
   */
  useEffect(() => {
    onBounds?.({
      radius,
      vertexCount:
        geometry.getAttribute('position')?.count ?? 0,
    });
  }, [geometry, radius, onBounds]);

  if (!visible) {
    return null;
  }

  const hasVertexColors =
    Boolean(geometry.getAttribute('color'));

  return (
    <points
      geometry={geometry}
      frustumCulled={false}
    >
      <pointsMaterial
        size={Math.max(
          radius * 0.0035,
          0.008
        )}
        sizeAttenuation
        vertexColors={hasVertexColors}
        color={
          hasVertexColors
            ? undefined
            : '#b7c4cb'
        }
        transparent
        opacity={
          confidenceMode
            ? 0.72
            : 0.96
        }
      />
    </points>
  );
}