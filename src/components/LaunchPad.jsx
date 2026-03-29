import React, { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { LAUNCHER_MODEL_POSITION, LAUNCHER_MODEL_SCALE } from './launchSceneConfig';

useGLTF.preload('/models/launcher.glb');

function LaunchPadGLB() {
  const { scene } = useGLTF('/models/launcher.glb');
  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);

    // The imported launcher asset is authored with a 0.01 internal node scale.
    // Normalize it once so the runtime transform can stay at the requested [1,1,1].
    clone.scale.setScalar(100);
    clone.updateMatrixWorld(true);

    const initialBox = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    initialBox.getCenter(center);

    clone.position.set(-center.x, -initialBox.min.y, -center.z);
    clone.updateMatrixWorld(true);

    clone.traverse((child) => {
      child.frustumCulled = false;
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={LAUNCHER_MODEL_POSITION}>
      <primitive object={preparedScene} scale={LAUNCHER_MODEL_SCALE} position={[0, 0, 0]} />
    </group>
  );
}

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
