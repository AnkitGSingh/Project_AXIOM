'use client';

import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { Howler } from 'howler';

export function LoadingScreen() {
  const { progress } = useProgress();
  const phase    = useAXIOMStore((state) => state.phase);
  const setPhase = useAXIOMStore((state) => state.setPhase);

  // Auto-advance when assets finish loading — no button needed on the right panel
  useEffect(() => {
    if (progress >= 100 && phase === AnimationPhase.LOADING) {
      const t = setTimeout(() => setPhase(AnimationPhase.IDLE), 600);
      return () => clearTimeout(t);
    }
  }, [progress, phase, setPhase]);

  if (phase !== AnimationPhase.LOADING) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center w-full h-full"
      style={{
        animation: 'fadeIn 700ms ease-out',
        background: 'linear-gradient(180deg, rgba(8, 8, 8, 0.36), rgba(8, 8, 8, 0.18))',
        backdropFilter: 'blur(1.5px)',
      }}
    >
      {progress < 100 ? (
        <div className="flex flex-col items-center gap-4">
          <h1
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#F6CE6E', letterSpacing: '0.3em' }}
            className="text-4xl md:text-6xl font-bold"
          >
            AXIOM
          </h1>
          <div className="w-64 h-1 rounded overflow-hidden" style={{ background: 'rgba(186, 143, 54, 0.22)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, #BA8F36, #F6CE6E)',
                boxShadow: '0 0 18px rgba(246,206,110,0.55)',
                width: `${progress}%`,
              }}
            />
          </div>
          <p style={{ fontFamily: 'var(--font-rajdhani), sans-serif', color: '#E2E8F0' }}>
            {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#F6CE6E', letterSpacing: '0.2em', fontSize: '1.1rem', opacity: 0.7 }}>
          READY
        </div>
      )}
    </div>
  );
}
