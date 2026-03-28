import React from 'react';

export default function LaunchPad(props) {
  return (
    <group {...props}>
      {/* ==================================
          Mobile Launcher Platform (MLP) Base 
          ================================== */}
      <mesh position={[0, -2, 0]}>
        {/* A massive concrete-like platform */}
        <boxGeometry args={[25, 4, 20]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      
      {/* Ground (Crawlerway/Concrete Pad below MLP) */}
      <mesh position={[0, -4.5, 0]}>
        <boxGeometry args={[80, 1, 80]} />
        <meshStandardMaterial color="#222222" roughness={1.0} />
      </mesh>

      {/* Flame Trench Cutout Effect (darker section on base) */}
      <mesh position={[0, 0.05, -1]}>
        <boxGeometry args={[8, 0.1, 10]} />
        <meshStandardMaterial color="#111111" roughness={1.0} />
      </mesh>

      {/* ==================================
          Fixed Service Structure (FSS) Tower 
          ================================== */}
      {/* We position it slightly to the left and back to clear the Shuttle */}
      <group position={[-6, 15, -6]}>
        {/* Main Steel Pillar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 30, 4]} />
          {/* Space Launch Red color for towers */}
          <meshStandardMaterial color="#b23a3a" roughness={0.7} metalness={0.6} />
        </mesh>
        
        {/* Elevator/Stairs Shaft */}
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[2, 30, 3]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
        </mesh>

        {/* Crane at the top */}
        <mesh position={[4, 16.5, 0]} rotation={[0, 0, -Math.PI/12]}>
          <boxGeometry args={[15, 0.5, 0.5]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.5} metalness={0.8} />
        </mesh>
        
        {/* Access Arms extending towards the Rocket */}
        {/* Crew Access Arm */}
        <mesh position={[4.5, 10, 2]}>
          <boxGeometry args={[5, 0.8, 1.5]} />
          <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
         
        {/* Hydrogen Vent Arm (Beanie Cap) */}
        <mesh position={[4.5, 13, 1]}>
           <boxGeometry args={[5, 0.5, 1]} />
           <meshStandardMaterial color="#cccccc" roughness={0.6} />
        </mesh>
      </group>

      {/* ==================================
          Lightning Rods / Lighting Masts
          ================================== */}
      <group position={[10, 8, -8]}>
         <mesh><cylinderGeometry args={[0.2, 0.3, 20]} /><meshStandardMaterial color="#aaaaaa" /></mesh>
      </group>
      <group position={[-10, 8, 8]}>
         <mesh><cylinderGeometry args={[0.2, 0.3, 20]} /><meshStandardMaterial color="#aaaaaa" /></mesh>
      </group>
      <group position={[10, 8, 8]}>
         <mesh><cylinderGeometry args={[0.2, 0.3, 20]} /><meshStandardMaterial color="#aaaaaa" /></mesh>
      </group>
      
      {/* RSS (Rotating Service Structure) Placeholder (retracted) */}
      <mesh position={[-10, 10, -10]}>
        <boxGeometry args={[8, 20, 6]} />
        <meshStandardMaterial color="#888888" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}
