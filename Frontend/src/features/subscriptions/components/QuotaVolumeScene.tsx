import { useEffect, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
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
    invalidate()
  }, [invalidate, target])

  useFrame((state, delta) => {
    if (!groupRef.current || !fillRef.current) return
    progressRef.current = MathUtils.damp(progressRef.current, target, 5, delta)
    const fillHeight = Math.max(0.04, progressRef.current * 2.06)
    fillRef.current.scale.y = fillHeight
    fillRef.current.position.y = -1.03 + fillHeight / 2
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
      <group ref={groupRef} rotation={[0.035, -0.075, 0]}>
        <RoundedBox args={[2.2, 2.7, 0.72]} radius={0.3} smoothness={6}>
          <meshStandardMaterial color={zincDoor} metalness={0.12} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[1.82, 2.14, 0.09]} radius={0.24} smoothness={5} position={[0, 0, 0.4]}>
          <meshStandardMaterial color={zinc600} transparent opacity={0.28} roughness={0.4} />
        </RoundedBox>
        <RoundedBox
          ref={fillRef}
          args={[1.76, 1, 0.12]}
          radius={0.1}
          smoothness={4}
          position={[0, -1.01, 0.47]}
          scale={[1, 0.04, 1]}
        >
          <meshStandardMaterial color={signal} transparent opacity={0.88} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.26, 0.58]}>
          <torusGeometry args={[0.42, 0.07, 16, 40]} />
          <meshStandardMaterial color={zinc600} metalness={0.25} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.26, 0.61]}>
          <boxGeometry args={[0.72, 0.065, 0.055]} />
          <meshStandardMaterial color={zinc600} metalness={0.2} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.26, 0.61]}>
          <boxGeometry args={[0.065, 0.72, 0.055]} />
          <meshStandardMaterial color={zinc600} metalness={0.2} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.26, 0.66]}>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshStandardMaterial color={signal} metalness={0.15} roughness={0.3} />
        </mesh>
      </group>
    </>
  )
}
