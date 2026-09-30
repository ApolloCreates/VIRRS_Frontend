import { useMemo } from 'react';
import * as THREE from 'three';
import { terrainHeight } from '../../mocks/demoScene';

export function PointCloudLayer({ scene, visible = true, confidenceMode = false, observedVisible = true, inferredVisible = true, terrainVisible = true, buildingsVisible = true }) {
  const geometry = useMemo(() => {
    const positions = [];
    const colors = [];
    const colorObserved = new THREE.Color('#b7c4cb');
    const colorInferred = new THREE.Color('#6f8290');

    if (terrainVisible) {
      for (let x = -92; x <= 92; x += 4) {
        for (let z = -92; z <= 92; z += 4) {
          const h = terrainHeight(x, z) + 0.15;
          positions.push(x, h, z);
          const c = colorObserved;
          colors.push(c.r, c.g, c.b);
        }
      }
    }

    if (buildingsVisible) scene.buildings.forEach((b) => {
      const inferred = b.source === 'inferred';
      if (inferred && !inferredVisible) return;
      if (!inferred && !observedVisible) return;
      for (let x = -b.w / 2; x <= b.w / 2; x += 1.8) {
        for (let z = -b.d / 2; z <= b.d / 2; z += 1.8) {
          const y = terrainHeight(b.x + x, b.z + z) + b.h;
          positions.push(b.x + x, y, b.z + z);
          const c = inferred ? colorInferred : colorObserved;
          colors.push(c.r, c.g, c.b);
        }
      }
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [scene, terrainVisible, buildingsVisible, observedVisible, inferredVisible]);

  if (!visible) return null;
  return (
    <points geometry={geometry}>
      <pointsMaterial size={1.15} vertexColors transparent opacity={confidenceMode ? 0.72 : 0.9} sizeAttenuation />
    </points>
  );
}
