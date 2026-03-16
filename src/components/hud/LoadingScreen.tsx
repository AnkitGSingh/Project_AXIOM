'use client';

import { useProgress } from '@react-three/drei';
import { useAXIOMStore, AnimationPhase } from '@/lib/store/useAXIOMStore';
import { Howler } from 'howler';

export function LoadingScreen() {
  const { progress } = useProgress();
  const phase    = useAXIOMStore((state) => state.phase);
  const setPhase = useAXIOMStore((state) => state.setPhase);

  if (phase !== AnimationPhase.LOADING) return null;

  const handleInitialize = () => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
    setPhase(AnimationPhase.IDLE);
  };

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
        <button
          onClick={handleInitialize}
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: '2rem',
            padding: '1.5rem 4rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            border: '2px solid #F6CE6E',
            color: '#F6CE6E',
            background: 'transparent',
            boxShadow: '0 0 20px rgba(246,206,110,0.35)',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#F6CE6E';
            (e.currentTarget as HTMLButtonElement).style.color = '#080808';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(246,206,110,0.85)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#F6CE6E';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(246,206,110,0.35)';
          }}
        >
          INITIALIZE SYSTEM
        </button>
      )}
    </div>
  );
}
