import React, { useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';

// Pre-loading the Agena model
useGLTF.preload('/models/agena.glb');

// High-fidelity GLB Rocket component
function RocketGLB() {
  const { scene } = useGLTF('/models/agena.glb');
  
  // Custom alignment: Lifting the rocket to 8m to sit correctly inside the new Mobile Launcher tower
  // Rocket is rotated 90deg on X to point up
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} />;
}

// Low-fidelity fallback for slow connections
function FallbackRocket() {
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#e0e0e0", roughness: 0.15, metalness: 0.7 });
  const engineMaterial = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.5, metalness: 0.9 });
  const detailMaterial = new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.8, metalness: 0.2 });

  return (
    <group position={[0, 7.5, 0]}>
      <mesh material={bodyMaterial}><cylinderGeometry args={[1.5, 1.5, 15, 64]} /></mesh>
      <mesh position={[0, 4, 0]} material={detailMaterial}><cylinderGeometry args={[1.52, 1.52, 1, 64]} /></mesh>
      <mesh position={[0, 10, 0]} material={bodyMaterial}><coneGeometry args={[1.5, 5, 64]} /></mesh>
      <mesh position={[0, -7.5, 0]} material={engineMaterial}><cylinderGeometry args={[1.5, 1.2, 0.5, 64]} /></mesh>
    </group>
  );
}

export default function Rocket({ position = 0 }) {
  const yPos = typeof position === 'number' ? position : 0;
  const isLaunching = yPos > 0.01;
  const exhaustIntensity = isLaunching ? Math.min(1 + yPos * 0.1, 8) : 0;

  return (
    <group position={[0, yPos, 0]}>
      {/* Immersive GLB Model or Fallback */}
      <Suspense fallback={<FallbackRocket />}>
        <RocketGLB />
      </Suspense>

      {/* Dynamic Visual Effects (Thrusters and Particle Smog) */}
      <group position={[0, -1, 0]}>
        {isLaunching && (
          <group position={[0, -2, 0]}>
            <mesh>
              <coneGeometry args={[1, 6 + exhaustIntensity, 32]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh>
              <coneGeometry args={[1.5, 4 + exhaustIntensity, 32]} />
              <meshBasicMaterial color="#ffaa00" toneMapped={false} transparent opacity={0.6} />
            </mesh>
          </group>
        )}
      </group>

      <group position={[0, -1, 0]}>
        <ParticleSystem active={isLaunching} />
      </group>
    </group>
  );
}
