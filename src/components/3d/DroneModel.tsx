'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

useGLTF.preload('/models/drone.glb')

// ── Component ─────────────────────────────────────────────────────────────────
export default function DroneModel() {
  const { scene } = useGLTF('/models/drone.glb')
  const groupRef   = useRef<THREE.Group>(null)
  const innerRef   = useRef<THREE.Group>(null)
  const fitted     = useRef(false)   // guard: auto-fit runs exactly once

  const phase    = useAXIOMStore((s) => s.phase)
  const setPhase = useAXIOMStore((s) => s.setPhase)

  // ── Apply cyan material once ──────────────────────────────────────────────
  useEffect(() => {
    // Use original GLB materials — no overrides
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow    = false
        child.receiveShadow = false
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

  // ── Per-frame: auto-fit on first frame (matrices guaranteed resolved),
  //    then cinematic float + slow rotation every frame ─────────────────────
  useFrame((state) => {
    const inner = innerRef.current
    const outer = groupRef.current
    if (!inner || !outer) return

    // Auto-fit: runs once after R3F has resolved all world matrices
    if (!fitted.current) {
      const box    = new THREE.Box3().setFromObject(inner)
      const size   = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)
      const maxDim = Math.max(size.x, size.y, size.z)

      if (maxDim > 0) {
        // Target: drone fills ~28% of the viewport height (1.4 world units at fov 44 / dist 6)
        const TARGET = 1.4
        const sf = TARGET / maxDim
        inner.scale.setScalar(sf)
        // Shift the inner group so the model's bounding-box centre is at origin
        inner.position.set(
          -center.x * sf,
          -center.y * sf,
          -center.z * sf,
        )
      }
      fitted.current = true
    }

    // Cinematic float + slow spin on the outer wrapper
    const t = state.clock.getElapsedTime()
    outer.position.y = Math.sin(t * 0.8) * 0.15
    outer.rotation.y += 0.005
  })

  return (
    // outer → carries the animation (float + spin)
    // inner → carries the auto-fit scale and centering offset
    <group ref={groupRef}>
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
  )
}
