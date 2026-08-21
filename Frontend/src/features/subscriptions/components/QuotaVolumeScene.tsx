import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type Group, type Mesh } from 'three'
import { useThreeThemeColors } from '@/components/three/useThreeThemeColors'

interface QuotaVolumeSceneProps {
  usagePercentage: number
}

const maxTilt = MathUtils.degToRad(4)

export default function QuotaVolumeScene({ usagePercentage }: QuotaVolumeSceneProps) {
  const groupRef = useRef<Group>(null)
  const fillRef = useRef<Mesh>(null)
  const progressRef = useRef(0)
  const invalidate = useThree((state) => state.invalidate)
  const { primary, warningStrong, danger, zincDoor, zinc600 } = useThreeThemeColors()
  const target = Math.max(0, Math.min(100, usagePercentage)) / 100
  const signal = usagePercentage >= 95 ? danger : usagePercentage >= 80 ? warningStrong : primary

  useEffect(() => {
    progressRef.current = 0
    invalidate()
  }, [invalidate, target])

  useFrame((state, delta) => {
    if (!groupRef.current || !fillRef.current) return
    progressRef.current = MathUtils.damp(progressRef.current, target, 5, delta)
    const fillHeight = Math.max(0.04, progressRef.current * 1.6)
    fillRef.current.scale.y = fillHeight
    fillRef.current.position.y = -0.8 + fillHeight / 2
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      -state.pointer.y * maxTilt,
      5,
      delta,
    )
    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      state.pointer.x * maxTilt,
      5,
      delta,
    )
    if (Math.abs(progressRef.current - target) > 0.002) invalidate()
  })

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} />
      <group ref={groupRef} rotation={[0.08, -0.12, 0]}>
        <mesh>
          <boxGeometry args={[1.9, 1.9, 1.35, 4, 4, 4]} />
          <meshPhysicalMaterial
            color={zincDoor}
            transparent
            opacity={0.28}
            roughness={0.2}
            transmission={0.45}
          />
        </mesh>
        <mesh ref={fillRef} position={[0, -0.78, 0]} scale={[1, 0.04, 1]}>
          <boxGeometry args={[1.55, 1, 1.05]} />
          <meshStandardMaterial color={signal} transparent opacity={0.78} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.71]}>
          <torusGeometry args={[0.42, 0.07, 16, 40]} />
          <meshStandardMaterial color={zinc600} metalness={0.25} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.78]}>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshStandardMaterial color={signal} metalness={0.15} roughness={0.3} />
        </mesh>
      </group>
    </>
  )
}
