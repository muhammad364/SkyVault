import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { useThreeThemeColors } from '@/components/three/useThreeThemeColors'
import { VaultBody } from '@/features/marketing/components/VaultBody'
import { VaultDial } from '@/features/marketing/components/VaultDial'
import { VaultHardware } from '@/features/marketing/components/VaultHardware'

interface LandingVaultSceneProps {
  active: boolean
  engaged: boolean
}

const maxTilt = MathUtils.degToRad(6)

export default function LandingVaultScene({ active, engaged }: LandingVaultSceneProps) {
  const vaultRef = useRef<Group>(null)
  const dialRef = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  const { brand, zinc900, zinc700, zinc600, zinc400, zinc300, zincDoor } = useThreeThemeColors()

  useEffect(() => {
    invalidate()
  }, [active, brand, engaged, invalidate])

  useFrame((state, delta) => {
    if (!vaultRef.current || !dialRef.current) return

    vaultRef.current.rotation.x = MathUtils.damp(
      vaultRef.current.rotation.x,
      -state.pointer.y * maxTilt,
      4,
      delta,
    )
    vaultRef.current.rotation.y = MathUtils.damp(
      vaultRef.current.rotation.y,
      state.pointer.x * maxTilt,
      4,
      delta,
    )
    dialRef.current.rotation.z += delta * (engaged ? 1.35 : 0.18)

    if (active) invalidate()
  })

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 5]} intensity={1.9} />
      <group ref={vaultRef} rotation={[0.04, -0.08, 0]} scale={0.92}>
        <VaultBody bodyColor={zinc600} panelColor={zincDoor} rimColor={zinc300} />
        <VaultHardware fastenerColor={zinc900} hingeColor={zinc400} />
        <VaultDial
          dialRef={dialRef}
          backplateColor={zinc700}
          wheelColor={zinc300}
          hubColor={brand}
        />
      </group>
    </>
  )
}
