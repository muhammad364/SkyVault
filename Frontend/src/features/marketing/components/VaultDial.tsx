import type { RefObject } from 'react'
import type { Group } from 'three'

interface VaultDialProps {
  dialRef: RefObject<Group>
  backplateColor: string
  wheelColor: string
  hubColor: string
}

const spokeAngles = Array.from({ length: 8 }, (_, index) => (Math.PI / 4) * index)

export function VaultDial({ dialRef, backplateColor, wheelColor, hubColor }: VaultDialProps) {
  return (
    <group ref={dialRef} position={[0.08, 0, 0.84]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
        <cylinderGeometry args={[0.54, 0.54, 0.08, 40]} />
        <meshStandardMaterial color={backplateColor} metalness={0.18} roughness={0.42} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.4, 0.05, 14, 48]} />
        <meshStandardMaterial color={wheelColor} metalness={0.32} roughness={0.28} />
      </mesh>
      {spokeAngles.map((angle) => (
        <mesh
          key={angle}
          position={[Math.sin(angle) * 0.2, Math.cos(angle) * 0.2, 0.02]}
          rotation={[0, 0, -angle]}
        >
          <boxGeometry args={[0.055, 0.42, 0.055]} />
          <meshStandardMaterial color={wheelColor} metalness={0.3} roughness={0.3} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 28]} />
        <meshStandardMaterial color={wheelColor} metalness={0.32} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color={hubColor} metalness={0.25} roughness={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.46, 0.11]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 20]} />
        <meshStandardMaterial color={wheelColor} metalness={0.32} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.46, 0.23]}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial color={wheelColor} metalness={0.32} roughness={0.28} />
      </mesh>
    </group>
  )
}
