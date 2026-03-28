import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ active = false }) {
  const count = 500;
  const meshRef = useRef();

  // Create initial properties for each particle
  const particles = useMemo(() => {
    const arr = new Float32Array(count * 3); // position array
    const velocities = [];
    const lifetimes = [];
    for (let i = 0; i < count; i++) {
        // Init properties
        const theta = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 0.5;
        arr[i * 3 + 0] = Math.cos(theta) * radius; // x
        arr[i * 3 + 1] = Math.random() * -2; // y (downwards from engine)
        arr[i * 3 + 2] = Math.sin(theta) * radius; // z
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: -Math.random() * 0.2 - 0.1, // downward thrust
            z: (Math.random() - 0.5) * 0.1
        });
        
        // Random lifetime
        lifetimes.push(Math.random());
    }
    return { positions: arr, velocities, lifetimes };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!active || !meshRef.current) return;

    // We animate position per instance.
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
        // Move particle
        particles.positions[i * 3 + 0] += particles.velocities[i].x;
        particles.positions[i * 3 + 1] += particles.velocities[i].y;
        particles.positions[i * 3 + 2] += particles.velocities[i].z;
        
        // Decrease life
        particles.lifetimes[i] -= 0.02;

        // Reset if dead
        if (particles.lifetimes[i] < 0) {
            particles.lifetimes[i] = 1.0;
            const theta = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 0.2; // tighter spawn radius 
            particles.positions[i * 3 + 0] = Math.cos(theta) * radius;
            particles.positions[i * 3 + 1] = 0; // reset to origin (engine exhaust)
            particles.positions[i * 3 + 2] = Math.sin(theta) * radius;
        }

        // Apply
        dummy.position.set(
            particles.positions[i * 3 + 0],
            particles.positions[i * 3 + 1],
            particles.positions[i * 3 + 2]
        );
        
        // Scale down scale based on lifetime
        const scale = Math.max(0, particles.lifetimes[i]);
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        // Simple color transition from hot yellow/orange to smoke grey
        const color = new THREE.Color();
        if (scale > 0.7) color.setHex(0xffaa00); // Fire
        else if (scale > 0.4) color.setHex(0xff3300); // Dark Fire
        else color.setHex(0xaaaaaa); // Smoke
        meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <icosahedronGeometry args={[0.2, 1]} />
      {/* We use MeshBasicMaterial to make it act like pure light/emissive and not care about scene lights */}
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
