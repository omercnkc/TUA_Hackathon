import React, { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { LAUNCHER_MODEL_POSITION } from "./launchSceneConfig";

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#6f8d4f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const hue = 92 + Math.random() * 18;
    const lightness = 28 + Math.random() * 24;
    ctx.fillStyle = `hsl(${hue}, 32%, ${lightness}%)`;
    ctx.fillRect(x, y, 2, 6);
  }

  for (let i = 0; i < 180; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = "rgba(166, 184, 119, 0.18)";
    ctx.beginPath();
    ctx.arc(x, y, 8 + Math.random() * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9, 9);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createConcreteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#8d9195";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 9000; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = 120 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${0.08 + Math.random() * 0.12})`;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.strokeStyle = "rgba(70, 74, 78, 0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 200, 200);
  ctx.strokeRect(86, 86, 84, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function LaunchSiteGround() {
  const grassTexture = useMemo(() => createGrassTexture(), []);
  const concreteTexture = useMemo(() => createConcreteTexture(), []);

  return (
    <group position={LAUNCHER_MODEL_POSITION}>
      <mesh position={[0, -1.48, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[26, 28, 1.7, 72]} />
        <meshStandardMaterial color="#584a3d" roughness={1} />
      </mesh>

      <mesh position={[0, -0.62, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[26, 96]} />
        <meshStandardMaterial map={grassTexture} color="#88a36a" roughness={1} />
      </mesh>

      <RoundedBox
        args={[18.5, 1.08, 18.5]}
        radius={0.42}
        smoothness={6}
        position={[0, -0.54, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={concreteTexture}
          color="#9ea2a6"
          roughness={0.97}
          metalness={0.03}
        />
      </RoundedBox>

      <RoundedBox
        args={[13.8, 0.16, 13.8]}
        radius={0.24}
        smoothness={4}
        position={[0, 0.02, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={concreteTexture}
          color="#b2b6ba"
          roughness={0.94}
          metalness={0.02}
        />
      </RoundedBox>
    </group>
  );
}
