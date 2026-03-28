import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PositionalAudio } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';

export default function Rocket({ position = 0 }) {
  // You can later swap this with: const { scene } = useGLTF('/models/rocket.glb');
  const rocketRef = useRef();

  // In standard ThreeJS, position is usually [x, y, z].
  // The requirements state position={height}, meaning it's a single number.
  // We map this height to the Y axis.
  const yPos = typeof position === 'number' ? position : 0;

  // Calculate if the rocket is currently launching (moving up)
  const isLaunching = yPos > 0;

  return (
    <group position={[0, yPos, 0]} ref={rocketRef}>
      {/* 
        This is a temporary placeholder rocket model. 
        Once you have your GLB from Blender, you can replace this mesh 
        with <primitive object={scene} /> 
      */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Rocket Nose Cone */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#ff3333" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Rocket Fins */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.1, 1, 0.5]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 1, 0.5]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>
      <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.1]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>
      <mesh position={[0, 0.5, -0.5]} rotation={[-Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.1]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>

      {/* Engine Engine Bell */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Fire and Smoke Particle System */}
      <group position={[0, -0.5, 0]}>
        <ParticleSystem active={isLaunching} />
      </group>

      {/* 
        Rocket Sound Component 
        Uncomment the PositionalAudio once you add your sound file to the public folder (e.g. public/sounds/rocket.mp3)
      */}
      {/* 
      <PositionalAudio 
        url="/sounds/rocket.mp3" 
        distance={20} 
        loop 
        autoplay={isLaunching} 
      /> 
      */}
    </group>
  );
}
