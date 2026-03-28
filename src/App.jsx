import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Environment, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

import Rocket from './components/Rocket';
import LaunchPad from './components/LaunchPad';
import UIPanel from './components/UIPanel';

// Camera tracking component that follows the rocket's height
function TrackingCamera({ targetHeight, isFixed }) {
  const { camera } = useThree();
  
  // Set initial camera position on mount
  useEffect(() => {
    camera.position.set(15, 5, 15);
  }, [camera]);

  useFrame(() => {
    if (isFixed) return; // Allow OrbitControls manually if preferred

    // Default camera offset from rocket
    const targetY = targetHeight + 5;
    
    // Smoothly follow the rocket
    const currentPosition = camera.position.clone();
    const desiredPosition = new THREE.Vector3(15, targetY, 15);
    
    camera.position.lerp(desiredPosition, 0.05);
    
    // Always look at the rocket
    const lookAtTarget = new THREE.Vector3(0, targetHeight + 2, 0);
    camera.lookAt(lookAtTarget);
  });
  
  return null;
}

// A mock simulation isolated from the visuals to showcase the Go/No-Go behavior
function useMockSimulation() {
  const [height, setHeight] = useState(0);
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    if (!isLaunched) return;
    
    let velocity = 0;
    const interval = setInterval(() => {
      velocity += 0.01; // Acceleration
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
      {/* 
        This handles the aesthetics and layout.
        Developer 2 will connect this component to their store/context 
        to feed actual real-time calculated values. 
      */}
      <UIPanel 
        height={height}
        velocity={velocity}
        fuel={fuel}
        countdown={countdown}
        status={status}
        onLaunchTest={() => setIsLaunched(true)}
        onReset={() => { setIsLaunched(false); setHeight(0); }}
      />

      <Canvas shadows>
        {/* SCENE LIGHTING */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#5588ff" />

        {/* SKYBOX & ENVIRONMENT */}
        {/* We use Stars and Sky from Drei to create an atmospheric to space transition */}
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} turbidity={Math.max(0, 1 - height/1000)} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />

        {/* CAMERA SYSTEM */}
        <TrackingCamera targetHeight={height} isFixed={false} />
        {/* We can uncomment OrbitControls to test manual view */}
        {/* <OrbitControls /> */}

        {/* MODELS */}
        <LaunchPad position={[0, 0, 0]} />
        
        {/* 
          This is the single export expected from Developer 1.
          It receives 'position={height}' as a prop from the parent (Developer 2's Simulation Engine).
        */}
        <Rocket position={height} />
      </Canvas>
    </>
  );
}
