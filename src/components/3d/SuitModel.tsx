'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

useGLTF.preload('/models/Y_Bot.glb')

// ── Cinematic Cyan Wireframe Material (PRD v3.0) ──────────────────────────────
const cyanHologramMat = new THREE.MeshStandardMaterial({
  color: '#00F2FF',
  emissive: '#00F2FF',
  emissiveIntensity: 2,
  transparent: true,
  opacity: 0.4,
  wireframe: true,
})

// ── Component ─────────────────────────────────────────────────────────────────
export default function SuitModel() {
  const { scene, animations } = useGLTF('/models/Y_Bot.glb')
  const groupRef = useRef<THREE.Group>(null)

  // useAnimations links the mixer root to the same group that holds the scene.
  const { actions, names } = useAnimations(animations, groupRef)

  const phase    = useAXIOMStore((s) => s.phase)
  const setPhase = useAXIOMStore((s) => s.setPhase)

  // ── Play first available clip (terminates T-Pose) ─────────────────────────
  useEffect(() => {
    console.log('Available animations:', names)
    if (names.length === 0) return
    actions[names[0]]?.reset().fadeIn(0.5).play()
    return () => { actions[names[0]]?.fadeOut(0.5) }
  }, [actions, names])

  // ── Apply cyan wireframe material to every mesh ───────────────────────────
  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow    = false
        child.receiveShadow = false
        child.material = cyanHologramMat
      }
    })
  }, [scene])

  // ── Phase machine: LANDING → RISING → HUD_INTRO ──────────────────────────
  useEffect(() => {
    if (phase !== AnimationPhase.LANDING) return
    const t = setTimeout(() => setPhase(AnimationPhase.RISING), 1200)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== AnimationPhase.RISING) return
    const t = setTimeout(() => setPhase(AnimationPhase.HUD_INTRO), 600)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  // ── Per-frame: gentle hover bob ───────────────────────────────────────────
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = -1.8 + Math.sin(t * 0.9) * 0.04
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(t * 0.28) * 0.08,
      0.04
    )
  })

  return (
    <group ref={groupRef} position={[2.5, -1.8, 0]} rotation={[0, 0.1, 0]} scale={[0.016, 0.016, 0.016]}>
      <primitive object={scene} />
    </group>
  )
}
