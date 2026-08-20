import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { useThreeThemeColors } from '@/components/three/useThreeThemeColors'

interface AuthKeySceneProps {
  active: boolean
}

const spokeAngles = Array.from({ length: 6 }, (_, index) => (Math.PI / 3) * index)
const maxTilt = MathUtils.degToRad(4)

export default function AuthKeyScene({ active }: AuthKeySceneProps) {
  const objectRef = useRef<Group>(null)
  const dialRef = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  const { primary, primaryForeground, accentAmber, cardMuted } = useThreeThemeColors()

  useEffect(() => invalidate(), [active, invalidate, primary])

  useFrame((state, delta) => {
    if (!objectRef.current || !dialRef.current) return
    objectRef.current.rotation.x = MathUtils.damp(objectRef.current.rotation.x, -state.pointer.y * maxTilt, 4, delta)
    objectRef.current.rotation.y = MathUtils.damp(objectRef.current.rotation.y, state.pointer.x * maxTilt, 4, delta)
    dialRef.current.rotation.z += delta * 0.16
    if (active) invalidate()
  })

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <group ref={objectRef} rotation={[0.06, -0.08, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.28, 48]} />
          <meshStandardMaterial color={primary} metalness={0.16} roughness={0.48} />
        </mesh>
        <group ref={dialRef} position={[-0.45, 0, 0.2]}>
          <mesh>
            <torusGeometry args={[0.64, 0.08, 16, 48]} />
            <meshStandardMaterial color={primaryForeground} metalness={0.3} roughness={0.3} />
          </mesh>
          {spokeAngles.map((angle) => (
            <mesh key={angle} position={[Math.sin(angle) * 0.31, Math.cos(angle) * 0.31, 0]} rotation={[0, 0, -angle]}>
              <boxGeometry args={[0.07, 0.62, 0.07]} />
              <meshStandardMaterial color={primaryForeground} metalness={0.28} roughness={0.32} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color={accentAmber} metalness={0.2} roughness={0.3} />
          </mesh>
        </group>
        <group position={[0.62, 0, 0.08]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 1.25, 24]} />
            <meshStandardMaterial color={cardMuted} metalness={0.24} roughness={0.34} />
          </mesh>
          <mesh position={[0.66, -0.18, 0]}>
            <boxGeometry args={[0.34, 0.36, 0.24]} />
            <meshStandardMaterial color={cardMuted} metalness={0.24} roughness={0.34} />
          </mesh>
          <mesh position={[0.94, 0.15, 0]}>
            <boxGeometry args={[0.28, 0.3, 0.24]} />
            <meshStandardMaterial color={primary} metalness={0.18} roughness={0.42} />
          </mesh>
        </group>
      </group>
    </>
  )
}
