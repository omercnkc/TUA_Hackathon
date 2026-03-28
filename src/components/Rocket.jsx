import React, { useRef } from 'react';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';

export default function Rocket({ position = 0 }) {
  const rocketRef = useRef();
  const yPos = typeof position === 'number' ? position : 0;
  const isLaunching = yPos > 0;

  // Realistic metallic materials mimicking SpaceX Falcon9/Starship
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: "#ffffff", 
    roughness: 0.15,
    metalness: 0.7,
    envMapIntensity: 2.0 // Reflects the space environment nicely
  });

  const engineMaterial = new THREE.MeshStandardMaterial({ 
    color: "#111", 
    roughness: 0.5, 
    metalness: 0.9 
  });

  const detailMaterial = new THREE.MeshStandardMaterial({ 
    color: "#222", 
    roughness: 0.8, 
    metalness: 0.2 
  });

  const exhaustIntensity = isLaunching ? Math.min(1 + yPos * 0.1, 8) : 0;

  return (
    <group position={[0, yPos, 0]} ref={rocketRef}>
      
      {/* =======================
          MAIN ROCKET BODY
          ======================= */}
      <group position={[0, 7.5, 0]}>
        {/* Main Stage Cylinder */}
        <mesh material={bodyMaterial}>
          <cylinderGeometry args={[1.5, 1.5, 15, 64]} />
        </mesh>
        
        {/* Interstage Ring (Black) */}
        <mesh position={[0, 4, 0]} material={detailMaterial}>
          <cylinderGeometry args={[1.52, 1.52, 1, 64]} />
        </mesh>

        {/* Nose Cone / Fairing */}
        <mesh position={[0, 10, 0]} material={bodyMaterial}>
          {/* Smooth curved fairing using cone with high segments */}
          <coneGeometry args={[1.5, 5, 64]} />
        </mesh>
        
        {/* Fairing Tip */}
        <mesh position={[0, 12.5, 0]} material={detailMaterial}>
           <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>

        {/* Grid Fins (Falcon 9 style) */}
        <group position={[0, 5, 0]}>
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]} material={detailMaterial}>
             <boxGeometry args={[0.1, 1, 0.8]} />
          </mesh>
          <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI/2]} material={detailMaterial}>
             <boxGeometry args={[0.1, 1, 0.8]} />
          </mesh>
          <mesh position={[0, 0, 1.5]} rotation={[Math.PI/2, 0, 0]} material={detailMaterial}>
             <boxGeometry args={[0.8, 1, 0.1]} />
          </mesh>
          <mesh position={[0, 0, -1.5]} rotation={[-Math.PI/2, 0, 0]} material={detailMaterial}>
             <boxGeometry args={[0.8, 1, 0.1]} />
          </mesh>
        </group>

        {/* Landing Legs (Folded) */}
        <group position={[0, -6.5, 0]}>
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, 0.1]} material={detailMaterial}>
             <cylinderGeometry args={[0.1, 0.2, 3, 8]} />
          </mesh>
          <mesh position={[-1.5, 0, 0]} rotation={[0, 0, -0.1]} material={detailMaterial}>
             <cylinderGeometry args={[0.1, 0.2, 3, 8]} />
          </mesh>
          <mesh position={[0, 0, 1.5]} rotation={[-0.1, 0, 0]} material={detailMaterial}>
             <cylinderGeometry args={[0.1, 0.2, 3, 8]} />
          </mesh>
          <mesh position={[0, 0, -1.5]} rotation={[0.1, 0, 0]} material={detailMaterial}>
             <cylinderGeometry args={[0.1, 0.2, 3, 8]} />
          </mesh>
        </group>

        {/* Engine Section (Merlin-like profile) */}
        <mesh position={[0, -7.5, 0]} material={engineMaterial}>
          <cylinderGeometry args={[1.5, 1.2, 0.5, 64]} />
        </mesh>
        
        {/* Main Engine Bells */}
        <group position={[0, -8.2, 0]}>
          <mesh material={engineMaterial}><cylinderGeometry args={[0.3, 0.6, 1.2, 32]} /></mesh>
          <mesh position={[0.7, 0.2, 0]} rotation={[0,0,-0.1]} material={engineMaterial}><cylinderGeometry args={[0.2, 0.4, 1, 32]} /></mesh>
          <mesh position={[-0.7, 0.2, 0]} rotation={[0,0,0.1]} material={engineMaterial}><cylinderGeometry args={[0.2, 0.4, 1, 32]} /></mesh>
          <mesh position={[0, 0.2, 0.7]} rotation={[0.1,0,0]} material={engineMaterial}><cylinderGeometry args={[0.2, 0.4, 1, 32]} /></mesh>
          <mesh position={[0, 0.2, -0.7]} rotation={[-0.1,0,0]} material={engineMaterial}><cylinderGeometry args={[0.2, 0.4, 1, 32]} /></mesh>

          {/* Engine Flames with super bright basic material for Bloom */}
          {isLaunching && (
            <group position={[0, -0.5, 0]}>
              <mesh position={[0, -2, 0]}>
                <coneGeometry args={[1, 6 + exhaustIntensity, 32]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh position={[0, -2, 0]}>
                <coneGeometry args={[1.5, 4 + exhaustIntensity, 32]} />
                <meshBasicMaterial color="#ffaa00" toneMapped={false} transparent opacity={0.6} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* SMOKE Particle System representing overall liftoff dust */}
      <group position={[0, 0, 0]}>
        <ParticleSystem active={isLaunching} />
      </group>
    </group>
  );
}
