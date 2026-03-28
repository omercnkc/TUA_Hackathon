import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

// Modeli ön belleklemek (preload) render hızını inanılmaz artırır
useGLTF.preload('/models/launcher.glb');

function LaunchPadGLB() {
  // Sisteme yeni aktardığımız Mobile Launcher modelini okuyoruz
  const { scene } = useGLTF('/models/launcher.glb');
  
  // ÖNEMLİ: Roketi yerleştirdiğiniz Mobile Launcher kulesinin 
  // tam ortaya (roketin etrafına) oturması için bu 'scale', 'position' ve 'rotation' değerlerini 
  // duruma göre değiştirmeniz gerekebilir. 
  
  // Örn: Eğer kule çok küçük görünüyorsa scale={[10, 10, 10]} yapabilirsiniz.
  // Veya roket kule tellerine çarpıyorsa position={[0, -2, 0]} ile biraz itebilirsiniz.
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
}

// Model indirilirken / işlenirken ekranda boşluk gözükmemesi için devasa gri bir beton zemin
function FallbackLaunchPad() {
  return (
    <group position={[0, -3, 0]}>
      <mesh>
        <boxGeometry args={[50, 4, 50]} />
        <meshStandardMaterial color="#333333" roughness={1.0} />
      </mesh>
      {/* Devam ediyor yükleniyor anlamında yanıp sönen küçük bir gösterge */}
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
      {/* Suspense React'ta asenkron olan (örnek: GLB model) componentleri bekletir 
          ve inene kadar ekrana fallback (yedek) olanı basar.
      */}
      <Suspense fallback={<FallbackLaunchPad />}>
        <LaunchPadGLB />
      </Suspense>
    </group>
  );
}
