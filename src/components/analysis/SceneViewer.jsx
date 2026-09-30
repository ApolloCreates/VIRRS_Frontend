import { useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, Line, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { BuildingsLayer, ObstaclesLayer, RoadsLayer, TerrainLayer, TrajectoryLayer, VegetationLayer } from './SceneLayers';
import { RealPointCloudLayer } from './RealPointCloudLayer';

function SelectionMarker({ point }) {
  if (!point) return null;
  return (
    <mesh position={point}>
      <sphereGeometry args={[1.2, 12, 12]} />
      <meshBasicMaterial color="#9ec7e8" />
    </mesh>
  );
}

function MeasurementLines({ points, tool }) {
  if (points.length < 2 || tool === 'coordinate') return null;
  return <Line points={points} color="#d4b36a" lineWidth={2} />;
}

function niceScale(radius) {
  const target = Math.max(radius * 0.45, 0.5);
  const exponent = Math.floor(Math.log10(target));
  const base = target / 10 ** exponent;
  const niceBase = base >= 5 ? 5 : base >= 2 ? 2 : 1;
  return niceBase * 10 ** exponent;
}

export function SceneViewer({ scene, layers, tool, measurementPoints, onPoint, onSelectObject, displayMode = 'mesh' }) {
  const controlsRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('perspective');
  const [pointCloudRadius, setPointCloudRadius] = useState(4);
  const [pointCloudReady, setPointCloudReady] = useState(false);

  const handlePointCloudBounds = useCallback(({ radius }) => {
    setPointCloudRadius(Math.max(radius, 0.5));
    setPointCloudReady(true);

    // Frame the actual cloud as soon as PLYLoader finishes. The previous
    // hard-coded 20 m OrbitControls minimum was larger than this reconstruction,
    // making the cloud impossible to zoom into.
    requestAnimationFrame(() => {
      const controls = controlsRef.current;
      if (!controls) return;
      const distance = Math.max(radius * 2.2, 2);
      controls.object.position.set(distance * 0.9, distance * 0.62, distance * 0.9);
      controls.target.set(0, 0, 0);
      controls.update();
      setCameraMode('fit');
    });
  }, []);

  const reset = () => {
    if (displayMode === 'pointcloud' && pointCloudReady) {
      const distance = Math.max(pointCloudRadius * 2.2, 2);
      controlsRef.current?.object.position.set(distance * 0.9, distance * 0.62, distance * 0.9);
      controlsRef.current?.target.set(0, 0, 0);
      controlsRef.current?.update();
    } else {
      controlsRef.current?.reset();
    }
    setCameraMode('perspective');
  };

  const topView = () => {
    if (!controlsRef.current) return;
    const distance = displayMode === 'pointcloud' ? Math.max(pointCloudRadius * 2.2, 2) : 170;
    controlsRef.current.object.position.set(0, distance, 0.01);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
    setCameraMode('top');
  };

  const fit = () => {
    if (!controlsRef.current) return;
    const distance = displayMode === 'pointcloud' ? Math.max(pointCloudRadius * 2.2, 2) : 135;
    controlsRef.current.object.position.set(
      distance * 0.9,
      distance * 0.62,
      distance * 0.9,
    );
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
    setCameraMode('fit');
  };

  const scale = niceScale(displayMode === 'pointcloud' ? pointCloudRadius : 100);

  return (
    <div className="relative h-full min-h-[560px] overflow-hidden rounded-sm border border-border bg-[#0b1014]">
      <Canvas shadows dpr={[1, 1.5]} onPointerMissed={() => {}}>
        <PerspectiveCamera
          key={displayMode}
          makeDefault
          position={displayMode === 'pointcloud' ? [8, 5.5, 8] : [125, 88, 125]}
          fov={45}
          near={0.001}
          far={Math.max(1000, pointCloudRadius * 100)}
        />
        <color attach="background" args={['#0b1014']} />
        <fog attach="fog" args={['#0b1014', displayMode === 'pointcloud' ? pointCloudRadius * 12 : 260, displayMode === 'pointcloud' ? pointCloudRadius * 30 : 520]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[80, 140, 60]} intensity={2.1} castShadow />
        <Sky distance={450000} sunPosition={[80, 120, 40]} inclination={0.48} azimuth={0.25} rayleigh={0.15} turbidity={5} />

        <Grid
          args={displayMode === 'pointcloud'
            ? [Math.max(pointCloudRadius * 4, 10), Math.max(pointCloudRadius * 4, 10)]
            : [220, 220]}
          position={[0, -0.15, 0]}
          cellSize={displayMode === 'pointcloud' ? Math.max(pointCloudRadius / 5, 0.25) : 10}
          cellThickness={0.35}
          cellColor="#273139"
          sectionSize={displayMode === 'pointcloud' ? Math.max(pointCloudRadius, 2) : 50}
          sectionThickness={0.6}
          sectionColor="#39464f"
          fadeDistance={displayMode === 'pointcloud' ? pointCloudRadius * 8 : 240}
          infiniteGrid
        />

        {displayMode === 'pointcloud' ? (
          <RealPointCloudLayer
            visible
            confidenceMode={layers.confidence}
            onBounds={handlePointCloudBounds}
          />
        ) : (
          <>
            <TerrainLayer visible={layers.terrain} onPointSelect={onPoint} confidence={layers.confidence} />
            <BuildingsLayer buildings={scene.buildings} visible={layers.buildings} confidenceMode={layers.confidence} observedVisible={layers.observed} inferredVisible={layers.inferred} onSelect={onSelectObject} />
            <RoadsLayer roads={scene.roads} visible={layers.roads} confidenceMode={layers.confidence} observedVisible={layers.observed} inferredVisible={layers.inferred} />
            <VegetationLayer trees={scene.trees} visible={layers.vegetation} confidenceMode={layers.confidence} />
            <ObstaclesLayer obstacles={scene.obstacles} visible={layers.obstacles} confidenceMode={layers.confidence} observedVisible={layers.observed} inferredVisible={layers.inferred} onSelect={onSelectObject} />
            <TrajectoryLayer points={scene.trajectory} visible={layers.trajectory} onPointSelect={onPoint} />
          </>
        )}

        <SelectionMarker point={measurementPoints.at(-1)} />
        <MeasurementLines points={measurementPoints} tool={tool} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          maxPolarAngle={Math.PI * 0.49}
          minDistance={displayMode === 'pointcloud' ? Math.max(pointCloudRadius * 0.025, 0.08) : 20}
          maxDistance={displayMode === 'pointcloud' ? Math.max(pointCloudRadius * 20, 50) : 420}
        />
      </Canvas>

      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm border border-border bg-card/90 px-2.5 py-1.5 backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-status-active" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">PLY Reconstruction</span>
        <span className="font-mono text-[10px] text-muted-foreground">{cameraMode}</span>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-sm border border-border bg-card/90 p-1 backdrop-blur-sm">
        <button type="button" onClick={reset} className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">Reset</button>
        <button type="button" onClick={fit} className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">Fit</button>
        <button type="button" onClick={topView} className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">Top</button>
      </div>

      <div className="absolute right-3 bottom-3 flex items-center gap-2 rounded-sm border border-border bg-card/90 px-2.5 py-1.5 text-[10px] text-muted-foreground">
        <span className="font-mono">{Number.isInteger(scale) ? scale : scale.toFixed(1)} m</span>
        <span className="inline-block h-px w-12 bg-muted-foreground" />
      </div>

      <div className="absolute right-3 top-3 flex flex-col items-center rounded-sm border border-border bg-card/90 px-2 py-1.5 text-[9px] font-semibold text-muted-foreground backdrop-blur-sm">
        <span className="text-foreground">N</span><span className="mt-0.5 h-4 w-px bg-accent" />
      </div>
    </div>
  );
}
