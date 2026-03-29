import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

// Pre-loading the Mobile Launcher model
useGLTF.preload('/models/launcher.glb');

function LaunchPadGLB() {
  const { scene } = useGLTF('/models/launcher.glb');
  
  // Adjusted for the Mobile Launcher base
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
}

// Fallback display while the model is loading
function FallbackLaunchPad() {
  return (
    <group position={[0, -3, 0]}>
      <mesh>
        <boxGeometry args={[50, 4, 50]} />
        <meshStandardMaterial color="#333333" roughness={1.0} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[2, 2, 0.5, 32]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function LaunchPad(props) {
  return (
    <group {...props}>
      <Suspense fallback={<FallbackLaunchPad />}>
        <LaunchPadGLB />
      </Suspense>
    </group>
  );
}
