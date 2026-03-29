import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import LaunchSiteGround from "../../components/LaunchSiteGround";
import Rocket from "../../components/Rocket";
import LaunchPad from "../../components/LaunchPad";
import UIPanel from "../../components/UIPanel";

function TrackingCamera({ targetHeight, isLaunched }) {
  const controlsRef = useRef();
  const shakeObj = useRef({ val: 0 });
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(30, 15, 30);
  }, [camera]);

  useEffect(() => {
    if (isLaunched && targetHeight < 200) {
      gsap.to(shakeObj.current, { val: 0.3, duration: 1, ease: "power2.out" });
    } else {
      gsap.to(shakeObj.current, { val: 0, duration: 3, ease: "power2.inOut" });
    }
  }, [isLaunched, targetHeight]);

  useFrame(() => {
    if (!controlsRef.current) return;
    const targetY = targetHeight + 5;
    controlsRef.current.target.lerp(new THREE.Vector3(0, targetY, 0), 0.1);

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

  return (
    <OrbitControls
      ref={controlsRef}
      maxPolarAngle={Math.PI / 2 - 0.01}
      minDistance={15}
      maxDistance={200}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

export default function SceneViewport({ sim, showOverlay = true }) {
  const { state } = sim;
  const scaledHeight = (state.height || 0) / 100;
  const isLaunched = state.state === "launch" || state.state === "burnout";
  const countdown = state.state === "countdown" ? Math.max(0, Math.ceil(state.countdown)) : 0;
  const fuelPercent = state.fuel;

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}>
      <Canvas shadows camera={{ fov: 45, position: [30, 15, 30] }}>
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[50, 50, 20]}
          intensity={2.0}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ffffff" />
        <Environment files="/assets/env/sky.hdr" background />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={2.0} mipmapBlur intensity={1.5} />
        </EffectComposer>
        <TrackingCamera targetHeight={scaledHeight} isLaunched={isLaunched} />
        <LaunchSiteGround />
        <LaunchPad position={[0, 0, 0]} />
        <Rocket position={scaledHeight} active={isLaunched} />
      </Canvas>

      {showOverlay && (
        <UIPanel
          height={state.height}
          velocity={state.velocity}
          fuel={fuelPercent}
          countdown={countdown}
          status={state.state.toUpperCase()}
          events={sim.events}
          onLaunchTest={sim.startCountdown}
          onReset={sim.resetSimulation}
        />
      )}
    </div>
  );
}
