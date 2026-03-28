import React, { useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';

// GLB modelini belleğe önceden yükle
useGLTF.preload('/models/agena.glb');

// Yüklediğiniz gerçek GLB modelini sahneye basan bileşen
function RocketGLB() {
  const { scene } = useGLTF('/models/agena.glb');

  // ÖNEMLİ: Eğer modeliniz çok büyük/küçük çıkarsa veya yamuk durursa
  // buradaki 'scale' ve 'rotation' değerlerini değiştirerek ayarlayabilirsiniz.
  // Roketin burnunu Y eksenine (yukarı) dikmek için X ekseninde (+90) derece döndürerek tersini aldık.
  // Ayrıca roket dikildiğinde yerin altına girmemesi için position Y değerini havaya kaldırdık.
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} />;
}

// Model inene kadar veya yükleme bitene kadar görünecek yedek (Fallback) model
function FallbackRocket() {
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.15, metalness: 0.7 });
  const engineMaterial = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.5, metalness: 0.9 });
  const detailMaterial = new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.8, metalness: 0.2 });

  return (
    <group position={[0, 7.5, 0]}>
      <mesh material={bodyMaterial}><cylinderGeometry args={[1.5, 1.5, 15, 64]} /></mesh>
      <mesh position={[0, 4, 0]} material={detailMaterial}><cylinderGeometry args={[1.52, 1.52, 1, 64]} /></mesh>
      <mesh position={[0, 10, 0]} material={bodyMaterial}><coneGeometry args={[1.5, 5, 64]} /></mesh>

      {/* Engine Section */}
      <mesh position={[0, -7.5, 0]} material={engineMaterial}><cylinderGeometry args={[1.5, 1.2, 0.5, 64]} /></mesh>
    </group>
  );
}

export default function Rocket({ position = 0 }) {
  const rocketRef = useRef();

  // Pozisyon Y ekseni (kalkış) yüksekliğini hesaplamak için formatlanıyor
  const yPos = typeof position === 'number' ? position : 0;
  const isLaunching = yPos > 0;
  const exhaustIntensity = isLaunching ? Math.min(1 + yPos * 0.1, 8) : 0;

  return (
    <group position={[0, yPos, 0]} ref={rocketRef}>

      {/* 
        Modeli Yükleyen Esas Kısım.
        Suspense bileşeni, "agena.glb" yüklenene kadar FallbackRocket'i gösterir.
      */}
      <Suspense fallback={<FallbackRocket />}>
        <RocketGLB />
      </Suspense>

      {/* Alt taraftaki alevler ve partiküller GLB modeline göre hizalı mı kontrol etmek gerek */}
      <group position={[0, -1, 0]}>
        {/* Glow efekti için özel roket alevleri (GLB'ye entegre etmek için konumu (position) aşağı çekebilirsiniz) */}
        {isLaunching && (
          <group position={[0, -2, 0]}>
            <mesh>
              <coneGeometry args={[1, 6 + exhaustIntensity, 32]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh>
              <coneGeometry args={[1.5, 4 + exhaustIntensity, 32]} />
              <meshBasicMaterial color="#ffaa00" toneMapped={false} transparent opacity={0.6} />
            </mesh>
          </group>
        )}
      </group>

      {/* Duman Partikül Sistemi */}
      <group position={[0, -1, 0]}>
        <ParticleSystem active={isLaunching} />
      </group>

    </group>
  );
}
