import { Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { terrainHeight } from '../../mocks/demoScene';

export function TerrainLayer({ visible, confidence, onPointSelect }) {
  const geometry = useMemo(() => {
    const size = 200;
    const segments = 70;
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  if (!visible) return null;
  return (
    <mesh geometry={geometry} receiveShadow onClick={(e) => { e.stopPropagation(); onPointSelect?.([e.point.x, e.point.y, e.point.z]); }}>
      <meshStandardMaterial color="#53616b" roughness={0.96} metalness={0.02} transparent opacity={confidence ? 0.82 : 1} />
    </mesh>
  );
}

function BoxBuilding({ item, onSelect, confidenceMode }) {
  const y = terrainHeight(item.x, item.z) + item.h / 2;
  const opacity = confidenceMode ? Math.max(0.25, item.confidence) : item.source === 'inferred' ? 0.55 : 0.92;
  return (
    <mesh
      position={[item.x, y, item.z]}
      onClick={(e) => { e.stopPropagation(); onSelect?.(item); }}
    >
      <boxGeometry args={[item.w, item.h, item.d]} />
      <meshStandardMaterial
        color={item.source === 'inferred' ? '#7c8790' : '#9aa7b0'}
        roughness={0.82}
        transparent
        opacity={opacity}
        wireframe={item.source === 'inferred'}
      />
    </mesh>
  );
}

export function BuildingsLayer({ buildings, visible, confidenceMode, observedVisible = true, inferredVisible = true, onSelect }) {
  if (!visible) return null;
  return <group>{buildings.filter((b) => b.source === 'observed' ? observedVisible : inferredVisible).map((b) => <BoxBuilding key={b.id} item={b} confidenceMode={confidenceMode} onSelect={onSelect} />)}</group>;
}

export function RoadsLayer({ roads, visible, confidenceMode, observedVisible = true, inferredVisible = true }) {
  if (!visible) return null;
  return (
    <group>
      {roads.filter((road) => road.source === 'observed' ? observedVisible : inferredVisible).map((road) => (
        <Line
          key={road.id}
          points={road.points.map(([x, z]) => [x, terrainHeight(x, z) + 0.08, z])}
          color={road.source === 'inferred' ? '#65727b' : '#b0bac0'}
          lineWidth={road.width * 0.7}
          transparent
          opacity={confidenceMode ? Math.max(0.25, road.confidence) : 0.78}
        />
      ))}
    </group>
  );
}

export function VegetationLayer({ trees, visible, confidenceMode }) {
  const positions = useMemo(() => trees.map((t) => [t.x, terrainHeight(t.x, t.z), t.z]), [trees]);
  if (!visible) return null;
  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} scale={trees[i].s}>
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1.7, 4, 6]} />
            <meshStandardMaterial color="#65766b" transparent opacity={confidenceMode ? 0.55 : 0.82} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.28, 0.36, 1.3, 6]} />
            <meshStandardMaterial color="#655c4f" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function TrajectoryLayer({ points, visible, onPointSelect }) {
  if (!visible) return null;
  return (
    <group>
      <Line points={points} color="#73a7d7" lineWidth={2.2} />
      <mesh position={points[Math.floor(points.length * 0.62)]} onClick={(e) => { e.stopPropagation(); onPointSelect?.(e.point.toArray()); }}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#b8d9f2" />
      </mesh>
    </group>
  );
}


export function ObstaclesLayer({ obstacles = [], visible, confidenceMode, observedVisible = true, inferredVisible = true, onSelect }) {
  if (!visible) return null;
  return (
    <group>
      {obstacles.filter((o) => o.source === 'observed' ? observedVisible : inferredVisible).map((o) => {
        const y = terrainHeight(o.x, o.z) + o.h / 2;
        return (
          <mesh key={o.id} position={[o.x, y, o.z]} onClick={(e) => { e.stopPropagation(); onSelect?.(o); }}>
            <cylinderGeometry args={[1.7, 1.7, o.h, 8]} />
            <meshStandardMaterial color={o.source === 'inferred' ? '#7c8790' : '#d0a76b'} transparent opacity={confidenceMode ? Math.max(0.25, o.confidence) : 0.8} wireframe={o.source === 'inferred'} />
          </mesh>
        );
      })}
    </group>
  );
}
