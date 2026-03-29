import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Procedural beton dokusu
function createConcreteTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#888078';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    const shade = Math.random() * 40 - 20;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${120 + shade}, ${112 + shade}, ${100 + shade}, 0.3)`;
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(60, 55, 50, 0.4)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < size; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
  }
  for (let y = 0; y < size; y += 128) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
  }

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r2 = Math.random() * 30 + 10;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r2);
    g.addColorStop(0, 'rgba(40, 35, 30, 0.15)');
    g.addColorStop(1, 'rgba(40, 35, 30, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

export default function LaunchSite() {
  const concreteTex = useMemo(() => createConcreteTexture(), []);

  // Gerçek fotoğraf dokusu — Polished grass for realism
  const grassTex = useTexture('/textures/grass.jpg');
  useMemo(() => {
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(64, 64);
    grassTex.needsUpdate = true;
  }, [grassTex]);

  return (
    <group position={[0, -24, 0]}>

      {/* 1. GENİŞ ÇİM ZEMİN */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial map={grassTex} roughness={0.9} metalness={0.0} />
      </mesh>

      {/* 2. ANA BETON BLOK (Uzay aracı ve rampa için temel) */}
      <mesh position={[0, 1, 0]} receiveShadow>
        <boxGeometry args={[150, 6, 150]} />
        <meshStandardMaterial map={concreteTex} roughness={0.8} />
      </mesh>

      {/* 3. YUVARLAK FIRLATMA PLATFORMU (Blok üzerinde) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.1, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial map={concreteTex} roughness={0.9} color="#999" />
      </mesh>

      {/* Sarı uyarı şeritleri */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.15, 0]}>
        <ringGeometry args={[58, 60, 64]} />
        <meshStandardMaterial color="#d4a017" roughness={0.7} />
      </mesh>

      {/* Egzoz Havuzu (Yanmış merkez) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#222" roughness={1.0} />
      </mesh>

    </group>
  );
}

