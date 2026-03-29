import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import Rocket from './components/Rocket';
import LaunchPad from './components/LaunchPad';
import LaunchSite from './components/LaunchSite';
import UIPanel from './components/UIPanel';

// Camera tracking component that lets you ROTATE the camera while it auto-tracks the height!
function TrackingCamera({ targetHeight, isLaunched }) {
  const controlsRef = useRef();
  const shakeObj = useRef({ val: 0 }); // Shake intensity
  const { camera } = useThree();

  // Set initial camera position on mount
  useEffect(() => {
    camera.position.set(30, 15, 30);
  }, [camera]);

  // GSAP animation for liftoff shake
  useEffect(() => {
    if (isLaunched && targetHeight < 200) {
      gsap.to(shakeObj.current, { val: 0.3, duration: 1, ease: 'power2.out' });
    } else {
      gsap.to(shakeObj.current, { val: 0, duration: 3, ease: 'power2.inOut' });
    }
  }, [isLaunched, targetHeight]);

  useFrame(() => {
    if (!controlsRef.current) return;

    // Follow the rocket's Y position while keeping the user's manual rotation intact!
    const targetY = targetHeight + 5;
    controlsRef.current.target.lerp(new THREE.Vector3(0, targetY, 0), 0.1);

    // Apply camera shake safely on top of OrbitControls
    if (shakeObj.current.val > 0) {
      const shakeX = (Math.random() - 0.5) * shakeObj.current.val;
      const shakeY = (Math.random() - 0.5) * shakeObj.current.val;
      const shakeZ = (Math.random() - 0.5) * shakeObj.current.val;
      camera.position.x += shakeX;
      camera.position.y += shakeY;
      camera.position.z += shakeZ;
    }

    controlsRef.current.update();
  });

  // Setup OrbitControls that prevents going under the ground
  return <OrbitControls ref={controlsRef} maxPolarAngle={Math.PI / 2 - 0.01} minDistance={15} maxDistance={200} enableDamping dampingFactor={0.05} />;
}

// Mock simulation isolated from visuals
function useMockSimulation() {
  const [height, setHeight] = useState(0);
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    if (!isLaunched) return;

    let velocity = 0;
    const interval = setInterval(() => {
      velocity += 0.05; // Acceleration
      setHeight(prev => prev + velocity);
    }, 16); // roughly 60fps

    return () => clearInterval(interval);
  }, [isLaunched]);

  return { height, isLaunched, setIsLaunched, setHeight };
}

export default function App() {
  const { height, isLaunched, setIsLaunched, setHeight } = useMockSimulation();

  // Calculate mock velocity and fuel for UI demonstration
  const status = isLaunched ? (height > 50 ? 'LIFTOFF' : 'ASCENT') : 'PRE-LAUNCH';
  const velocity = isLaunched ? height / 2 : 0;
  const fuel = isLaunched ? Math.max(0, 100 - (height / 10)) : 100;
  const countdown = isLaunched ? 0 : 10;

  return (
    <>
      <UIPanel
        height={height}
        velocity={velocity}
        fuel={fuel}
        countdown={countdown}
        status={status}
        onLaunchTest={() => setIsLaunched(true)}
        onReset={() => { setIsLaunched(false); setHeight(0); }}
      />

      <Canvas shadows camera={{ fov: 45, position: [30, 15, 30] }}>
        {/* SCENE LIGHTING - Optimized to prevent washout */}
        <color attach="background" args={['#030508']} />
        {/* SKYBOX & ENVIRONMENT */}
        {/* High quality environment map for realistic daylight reflections */}
        <Environment files="/textures/custom_sky.hdr" background blur={0.01} />

        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[50, 50, 20]}
          intensity={1.2}
          color="#fff5f0"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* POST PROCESSING FOR "WOW" GLOW -> Tuned so only fire blooms */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={2.0} mipmapBlur intensity={1.5} />
        </EffectComposer>

        {/* CAMERA SYSTEM -> Allows user to spin around the scene */}
        <TrackingCamera targetHeight={height} isLaunched={isLaunched} />

        {/* MODELS */}
        <Suspense fallback={null}>
          <LaunchSite />
        </Suspense>
        <LaunchPad position={[0, 0, 0]} />
        <Rocket position={height} />
      </Canvas>
    </>
  );
}
