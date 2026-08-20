import type { RefObject } from 'react'
import type { Group } from 'three'

interface VaultDialProps {
  dialRef: RefObject<Group>
  rimColor: string
  hubColor: string
}

const spokeAngles = Array.from({ length: 8 }, (_, index) => (Math.PI / 4) * index)

export function VaultDial({ dialRef, rimColor, hubColor }: VaultDialProps) {
  return (
    <group ref={dialRef} position={[0.08, 0, 0.84]}>
      <mesh>
        <torusGeometry args={[0.4, 0.05, 14, 48]} />
        <meshStandardMaterial color={rimColor} metalness={0.5} roughness={0.24} />
      </mesh>
      {spokeAngles.map((angle) => (
        <mesh
          key={angle}
          position={[Math.sin(angle) * 0.2, Math.cos(angle) * 0.2, 0.02]}
          rotation={[0, 0, -angle]}
        >
          <boxGeometry args={[0.055, 0.42, 0.055]} />
          <meshStandardMaterial color={rimColor} metalness={0.48} roughness={0.26} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 28]} />
        <meshStandardMaterial color={rimColor} metalness={0.45} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color={hubColor} metalness={0.25} roughness={0.28} />
      </mesh>
    </group>
  )
}
