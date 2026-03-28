import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function LaunchPad(props) {
  // Placeholder for launch pad GLB loading:
  // const { scene } = useGLTF('/models/launchpad.glb');

  return (
    <group {...props}>
      {/* Central Pad */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>

      {/* Support Tower / Umbilical Tower */}
      <mesh position={[2, 4, -2]}>
        <boxGeometry args={[1, 8, 1]} />
        <meshStandardMaterial color="#ff4400" roughness={0.6} metalness={0.4} />
      </mesh>
      
      {/* Ground platform / concrete base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#2a2a2a" roughness={1.0} />
      </mesh>
    </group>
  );
}
