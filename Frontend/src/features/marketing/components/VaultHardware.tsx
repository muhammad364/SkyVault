import { RoundedBox } from '@react-three/drei'
import type { RefObject } from 'react'
import type { Group } from 'three'

interface VaultHardwareProps {
  hardwareRef: RefObject<Group>
  metalColor: string
  hingeColor: string
}

const fastenerAngles = Array.from({ length: 12 }, (_, index) => (Math.PI / 6) * index)

export function VaultHardware({ hardwareRef, metalColor, hingeColor }: VaultHardwareProps) {
  return (
    <group>
      <group ref={hardwareRef}>
        {[-0.77, 0.77].map((y) => (
          <group key={y} position={[0.58, y, 0.72]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.045, 0.045, 0.85, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.25} />
            </mesh>
            <mesh position={[0.46, 0, 0]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.25} />
            </mesh>
          </group>
        ))}
        <group position={[1.02, 0, 0.72]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 1.18, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.25} />
          </mesh>
          {[-0.65, 0.65].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.5} roughness={0.25} />
            </mesh>
          ))}
        </group>
      </group>
      {[-0.62, 0.62].map((y) => (
        <RoundedBox key={y} args={[0.24, 0.4, 0.18]} radius={0.05} smoothness={3} position={[-1.15, y, 0.62]}>
          <meshStandardMaterial color={hingeColor} metalness={0.32} roughness={0.3} />
        </RoundedBox>
      ))}
      {fastenerAngles.map((angle) => (
        <mesh key={angle} position={[0.08 + Math.cos(angle) * 0.93, Math.sin(angle) * 0.93, 0.79]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={metalColor} metalness={0.48} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}
