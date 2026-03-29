import React, { useMemo, useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';
import {
  ROCKET_EXHAUST_OFFSET,
  ROCKET_FALLBACK_POSITION,
  ROCKET_MODEL_POSITION,
  ROCKET_MODEL_ROTATION,
  ROCKET_MODEL_SCALE
} from './launchSceneConfig';

useGLTF.preload('/models/agena.glb');

function FallbackRocket() {
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.15, metalness: 0.7 });
  const engineMaterial = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.5, metalness: 0.9 });
  const detailMaterial = new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.8, metalness: 0.2 });

  return (
    <group position={ROCKET_FALLBACK_POSITION}>
      <mesh material={bodyMaterial}><cylinderGeometry args={[1.5, 1.5, 15, 64]} /></mesh>
      <mesh position={[0, 4, 0]} material={detailMaterial}><cylinderGeometry args={[1.52, 1.52, 1, 64]} /></mesh>
      <mesh position={[0, 10, 0]} material={bodyMaterial}><coneGeometry args={[1.5, 5, 64]} /></mesh>
      <mesh position={[0, -7.5, 0]} material={engineMaterial}><cylinderGeometry args={[1.5, 1.2, 0.5, 64]} /></mesh>
    </group>
  );
}

function RocketModelWithEffects({ active, exhaustIntensity }) {
  const { scene } = useGLTF('/models/agena.glb');
  const exhaustAnchor = useMemo(() => {
    const measurementScene = scene.clone(true);
    measurementScene.position.set(...ROCKET_MODEL_POSITION);
    measurementScene.rotation.set(...ROCKET_MODEL_ROTATION);
    measurementScene.scale.set(...ROCKET_MODEL_SCALE);
    measurementScene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(measurementScene);
    if (bounds.isEmpty()) {
      return [ROCKET_MODEL_POSITION[0], ROCKET_MODEL_POSITION[1] - 8, ROCKET_MODEL_POSITION[2]];
    }

    return [
      ROCKET_MODEL_POSITION[0] + ROCKET_EXHAUST_OFFSET[0],
      bounds.min.y - 0.1,
      ROCKET_MODEL_POSITION[2] + ROCKET_EXHAUST_OFFSET[2]
    ];
  }, [scene]);

  const innerHeight = 4 + exhaustIntensity;
  const outerHeight = 6 + exhaustIntensity;

  return (
    <>
      <primitive
        object={scene}
        scale={ROCKET_MODEL_SCALE}
        position={ROCKET_MODEL_POSITION}
        rotation={ROCKET_MODEL_ROTATION}
      />

      <group position={exhaustAnchor}>
        {active && (
          <group>
            <mesh position={[0, -outerHeight / 2, 0]}>
              <coneGeometry args={[1, outerHeight, 32]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[0, -innerHeight / 2, 0]}>
              <coneGeometry args={[1.5, innerHeight, 32]} />
              <meshBasicMaterial color="#ffaa00" toneMapped={false} transparent opacity={0.6} />
            </mesh>
          </group>
        )}
        <ParticleSystem active={active} />
      </group>
    </>
  );
}

export default function Rocket({ position = 0, active = false }) {
  const rocketRef = useRef();
  const yPos = typeof position === 'number' ? position : 0;
  const isLaunching = active;
  const exhaustIntensity = isLaunching ? Math.min(1 + yPos * 0.1, 8) : 0;

  return (
    <group position={[0, yPos, 0]} ref={rocketRef}>
      <Suspense fallback={<FallbackRocket />}>
        <RocketModelWithEffects active={isLaunching} exhaustIntensity={exhaustIntensity} />
      </Suspense>
    </group>
  );
}
