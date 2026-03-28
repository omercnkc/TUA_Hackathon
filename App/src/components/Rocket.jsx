import { Box, Cylinder, Cone } from "@react-three/drei";

function Rocket({ height }) {
  // Use react-three/drei's cylinder and cone for better rocket shape.
  return (
    <group position={[0, height, 0]}>
      {/* Nose */}
      <Cone args={[0.5, 1, 32]} position={[0, 2.5, 0]} castShadow>
        <meshStandardMaterial color="#FF4500" emissive="#AA4500" />
      </Cone>
      
      {/* Body */}
      <Cylinder args={[0.5, 0.5, 2, 32]} position={[0, 1.1, 0]} castShadow>
        <meshStandardMaterial color="#A9A9A9" />
      </Cylinder>
      
      {/* Fins (using Boxes) */}
      <Box args={[0.8, 0.4, 0.05]} position={[0.7, 0.3, 0]} rotation={[0, 0, 0.1]} castShadow>
        <meshStandardMaterial color="#FF0000" />
      </Box>
      <Box args={[0.8, 0.4, 0.05]} position={[-0.7, 0.3, 0]} rotation={[0, 0, -0.1]} castShadow>
        <meshStandardMaterial color="#FF0000" />
      </Box>
      <Box args={[0.05, 0.4, 0.8]} position={[0, 0.3, 0.7]} rotation={[-0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#FF0000" />
      </Box>
      <Box args={[0.05, 0.4, 0.8]} position={[0, 0.3, -0.7]} rotation={[0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#FF0000" />
      </Box>

      {/* Engine Exhaust Flame (Cone) */}
      {height > 0.01 && (
        <Cone args={[0.4, 0.8, 32]} position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial 
            color="#FFA500" 
            emissive="#FF8C00" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.8}
          />
        </Cone>
      )}

      {/* Particle trail (Mock) using simple scale animation or just one object */}
      <pointLight position={[0, -1, 0]} intensity={1.5} color="orange" distance={5} />
    </group>
  );
}

export default Rocket;