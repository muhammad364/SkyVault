import { RoundedBox } from '@react-three/drei'
interface VaultHardwareProps {
  fastenerColor: string
  hingeColor: string
}

const fastenerAngles = Array.from({ length: 12 }, (_, index) => (Math.PI / 6) * index)

export function VaultHardware({ fastenerColor, hingeColor }: VaultHardwareProps) {
  return (
    <group>
      {[-0.62, 0.62].map((y) => (
        <RoundedBox key={y} args={[0.24, 0.4, 0.18]} radius={0.05} smoothness={3} position={[-1.15, y, 0.62]}>
          <meshStandardMaterial color={hingeColor} metalness={0.32} roughness={0.3} />
        </RoundedBox>
      ))}
      {fastenerAngles.map((angle) => (
        <mesh key={angle} position={[0.08 + Math.cos(angle) * 0.93, Math.sin(angle) * 0.93, 0.79]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={fastenerColor} metalness={0.36} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}
