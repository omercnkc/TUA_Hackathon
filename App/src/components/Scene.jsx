import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, Environment, PerspectiveCamera, Cloud } from "@react-three/drei";
import Rocket from "./Rocket";
import { Suspense } from "react";

function Scene({ height }) {
  // Rocket position in units. Simulate 100km range.
  // We'll scale it so height=100_000 is some units high.
  const scaledHeight = height / 100; // 1m = 0.01 units, 100km = 1000 units.

  return (
    <div style={{ width: '100%', height: '80vh', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, scaledHeight + 5, 20]} />
        <OrbitControls enablePan={true} target={[0, scaledHeight, 0]} />
        
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[100, 100, 100]} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <Rocket height={scaledHeight} />
          
          {/* Ground */}
          {height < 5000 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          )}

          {/* Clouds Layer */}
          {height < 30000 && (
            <Cloud
              opacity={0.3}
              speed={0.2}
              width={20}
              depth={2}
              segments={40}
              position={[0, 10, 0]}
            />
          )}

          <Environment preset="night" />
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
        STATUS: {height >= 100000 ? "OUTER SPACE" : "ATMOSPHERE"}<br/>
        ALTITUDE: {Math.round(height).toLocaleString()}m
      </div>
    </div>
  );
}

export default Scene;