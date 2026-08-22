import { useThreeThemeColors } from '@/components/three/useThreeThemeColors'

export default function FolderEmptyScene() {
  const { zinc600, zincDoor, brand } = useThreeThemeColors()

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} />
      <group rotation={[-0.12, -0.28, 0.04]} position={[0, -0.15, 0]}>
        <mesh position={[-0.55, 0.76, -0.18]}>
          <boxGeometry args={[0.9, 0.36, 0.72]} />
          <meshStandardMaterial color={brand} roughness={0.42} metalness={0.08} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.45, 1.45, 0.9]} />
          <meshStandardMaterial color={zinc600} roughness={0.42} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.24, 0.52]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[2.15, 1.05, 0.12]} />
          <meshStandardMaterial color={zincDoor} roughness={0.3} metalness={0.08} />
        </mesh>
      </group>
    </>
  )
}
