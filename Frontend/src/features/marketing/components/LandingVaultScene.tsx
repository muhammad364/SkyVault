import { RoundedBox } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useThreeThemeColors } from '@/components/three/useThreeThemeColors'

function VaultDial() {
  const dialRef = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  const { primaryForeground, accentAmber } = useThreeThemeColors()

  useEffect(() => {
    invalidate()
  }, [invalidate])

  useFrame((state, delta) => {
    if (!dialRef.current) return
    dialRef.current.rotation.z += delta * 0.12
    dialRef.current.rotation.y = MathUtils.damp(dialRef.current.rotation.y, state.pointer.x * 0.1, 4, delta)
    invalidate()
  })

  return (
    <group ref={dialRef} position={[0, 0, 0.68]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.1, 32]} />
        <meshStandardMaterial color={primaryForeground} metalness={0.1} roughness={0.42} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => (
        <mesh key={index} position={[0, 0, 0.08]} rotation={[0, 0, (Math.PI / 3) * index]}>
          <boxGeometry args={[0.1, 0.45, 0.08]} />
          <meshStandardMaterial color={accentAmber} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.15]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color={accentAmber} metalness={0.12} roughness={0.3} />
      </mesh>
    </group>
  )
}

export default function LandingVaultScene() {
  const vaultRef = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  const { primary } = useThreeThemeColors()

  useEffect(() => {
    invalidate()
  }, [invalidate])

  useFrame((state, delta) => {
    if (!vaultRef.current) return
    vaultRef.current.rotation.x = MathUtils.damp(vaultRef.current.rotation.x, -state.pointer.y * 0.08, 4, delta)
    vaultRef.current.rotation.y = MathUtils.damp(vaultRef.current.rotation.y, state.pointer.x * 0.1, 4, delta)
    invalidate()
  })

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <group ref={vaultRef}>
        <RoundedBox args={[2, 2, 1.25]} radius={0.25} smoothness={5}>
          <meshStandardMaterial color={primary} roughness={0.54} metalness={0.08} />
        </RoundedBox>
        <VaultDial />
      </group>
    </>
  )
}
