import { RoundedBox } from '@react-three/drei'

interface VaultBodyProps {
  bodyColor: string
  panelColor: string
  rimColor: string
}

export function VaultBody({ bodyColor, panelColor, rimColor }: VaultBodyProps) {
  return (
    <group>
      <RoundedBox args={[2.6, 2.4, 0.88]} radius={0.16} smoothness={5}>
        <meshStandardMaterial color={bodyColor} metalness={0.14} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[2.28, 2.08, 0.12]} radius={0.1} smoothness={4} position={[0, 0, 0.5]}>
        <meshStandardMaterial color={panelColor} metalness={0.12} roughness={0.46} />
      </RoundedBox>
      <mesh position={[0.08, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.83, 0.83, 0.14, 48]} />
        <meshStandardMaterial color={panelColor} metalness={0.18} roughness={0.42} />
      </mesh>
      <mesh position={[0.08, 0, 0.72]}>
        <torusGeometry args={[0.76, 0.065, 16, 56]} />
        <meshStandardMaterial color={rimColor} metalness={0.42} roughness={0.28} />
      </mesh>
    </group>
  )
}
