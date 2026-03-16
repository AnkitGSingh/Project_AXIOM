'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore'

// Camera shake fires on LANDING → RISING transition (impact moment)
export default function ImpactEffects() {
  const phase = useAXIOMStore((s) => s.phase)
  const { camera } = useThree()

  const shaking      = useRef(false)
  const shakeElapsed = useRef(0)
  const baseX        = useRef(camera.position.x)
  const baseY        = useRef(camera.position.y)
  const firedRef     = useRef(false)

  useEffect(() => {
    if (phase !== AnimationPhase.RISING) {
      firedRef.current = false
      return
    }
    if (firedRef.current) return
    firedRef.current     = true
    baseX.current        = camera.position.x
    baseY.current        = camera.position.y
    shakeElapsed.current = 0
    shaking.current      = true
  }, [phase, camera])

  useFrame((_, delta) => {
    if (!shaking.current) return
    shakeElapsed.current += delta
    if (shakeElapsed.current >= 0.3) {
      camera.position.x = baseX.current
      camera.position.y = baseY.current
      shaking.current   = false
      return
    }
    const intensity = 0.1 * (1 - shakeElapsed.current / 0.3)
    camera.position.x = baseX.current + (Math.random() - 0.5) * intensity
    camera.position.y = baseY.current + (Math.random() - 0.5) * intensity
  })

  return null
}
