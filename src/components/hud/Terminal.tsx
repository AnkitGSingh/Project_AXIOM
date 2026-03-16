'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAXIOMStore } from '@/lib/store/useAXIOMStore'

const CYAN = '#00F2FF'
const GOLD = '#F6CE6E'
const DIM_GOLD = 'rgba(246,206,110,0.55)'

// ── Types ─────────────────────────────────────────────────────────────────────
type MsgKind = 'cmd' | 'response' | 'system' | 'error'

interface TMsg {
  id: string
  kind: MsgKind
  text: string
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 14 }: { text: string; speed?: number }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(0)
  }, [text])

  useEffect(() => {
    if (idx >= text.length) return
    const t = setTimeout(() => setIdx(i => i + 1), speed)
    return () => clearTimeout(t)
  }, [idx, text.length, speed])

  return <>{text.slice(0, idx)}</>
}

// ── Local command registry ────────────────────────────────────────────────────
const LOCAL_COMMANDS: Record<string, string> = {
  help: [
    'AXIOM Command Registry:',
    '  about      — Operator profile + optics zoom',
    '  projects   — Project matrix + Arc Reactor burst',
    '  skills     — Tech stack readout',
    '  contact    — Open communication channels',
    '  clear      — Purge terminal buffer',
    '  [anything] — Query AXIOM AI directly',
  ].join('\n'),
  skills: [
    'Primary Stack  : Python · TypeScript · Next.js · FastAPI · PostgreSQL',
    'AI / ML        : LangChain · PyTorch · HuggingFace · OpenAI · Bedrock',
    'Infrastructure : AWS · Vercel · Docker · GitHub Actions',
    'Speciality     : AI automation pipelines · ad spend protection systems',
  ].join('\n'),
  contact: [
    'Communication channels:',
    '  Email    →  ankit [at] adtecher.com',
    '  GitHub   →  github.com/ankitgsingh',
    '  LinkedIn →  linkedin.com/in/ankitgsingh',
    'Ping dispatched. OPERATOR will respond within 24h.',
  ].join('\n'),
}

// ── Terminal ──────────────────────────────────────────────────────────────────
export default function Terminal() {
  const [messages, setMessages] = useState<TMsg[]>([
    { id: 'boot', kind: 'system', text: "Terminal active. Type 'help' for commands." },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const triggerArcReactorPulse = useAXIOMStore(s => s.triggerArcReactorPulse)
  const setCameraZoomHead = useAXIOMStore(s => s.setCameraZoomHead)

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const addMsg = useCallback((kind: MsgKind, text: string) => {
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, kind, text },
    ])
  }, [])

  const handleSubmit = useCallback(async () => {
    const raw = input.trim()
    if (!raw || isLoading) return

    const cmd = raw.toLowerCase()

    addMsg('cmd', raw)
    setHistory(prev => [raw, ...prev])
    setHistoryIdx(-1)
    setInput('')

    // ── clear ──────────────────────────────────────────────────────────────
    if (cmd === 'clear') {
      setMessages([{ id: 'cleared', kind: 'system', text: "Buffer purged. Type 'help' for commands." }])
      return
    }

    // ── projects — Arc Reactor pulse ───────────────────────────────────────
    if (cmd === 'projects') {
      triggerArcReactorPulse()
      addMsg(
        'response',
        'AXIOM: Project matrix coming online — Arc Reactor output at 3000%. Three deployments active. Ask me about any project by name, or query the full stack.',
      )
      return
    }

    // ── about — Camera zoom to head ────────────────────────────────────────
    if (cmd === 'about') {
      setCameraZoomHead(true)
      addMsg(
        'response',
        'AXIOM: Loading operator profile. Ankit Singh — MSc Artificial Intelligence, Automation Engineer at AdTecher, Sheffield. Specialist in AI-powered ad spend protection. Optical sensors redirecting to primary contact point.',
      )
      setTimeout(() => setCameraZoomHead(false), 8000)
      return
    }

    // ── local commands ─────────────────────────────────────────────────────
    if (LOCAL_COMMANDS[cmd]) {
      addMsg('response', LOCAL_COMMANDS[cmd])
      return
    }

    // ── AI fallback — AWS Bedrock ──────────────────────────────────────────
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: raw }] }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      addMsg('response', data.text ?? 'AXIOM: Signal ambiguous. Please rephrase your query.')
    } catch {
      addMsg('error', 'AXIOM: Neural link degraded. Ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are configured.')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, addMsg, triggerArcReactorPulse, setCameraZoomHead])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHistoryIdx(prev => {
          const next = Math.min(prev + 1, history.length - 1)
          if (history[next] !== undefined) setInput(history[next])
          return next
        })
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHistoryIdx(prev => {
          const next = Math.max(prev - 1, -1)
          setInput(next === -1 ? '' : (history[next] ?? ''))
          return next
        })
      }
    },
    [handleSubmit, history],
  )

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'var(--font-jetbrains), monospace',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        cursor: 'text',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 12,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(246,206,110,0.2) transparent',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: 6,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: 'clamp(0.75rem, 1.3vw, 1rem)',
            }}
          >
            {msg.kind === 'cmd' && (
              <>
                <span style={{ color: CYAN }}>{'> '}</span>
                <span style={{ color: GOLD }}>{msg.text}</span>
              </>
            )}
            {msg.kind === 'response' && (
              <span style={{ color: CYAN }}>
                <TypewriterText text={msg.text} speed={12} />
              </span>
            )}
            {msg.kind === 'system' && (
              <span style={{ color: DIM_GOLD }}>{msg.text}</span>
            )}
            {msg.kind === 'error' && (
              <span style={{ color: '#FF4C4C' }}>{msg.text}</span>
            )}
          </div>
        ))}

        {isLoading && (
          <div
            style={{ color: CYAN, fontSize: 'clamp(0.75rem, 1.3vw, 1rem)' }}
          >
            {'AXIOM: '}
            <span style={{ animation: 'termBlink 0.7s step-end infinite' }}>
              ▋▋▋
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(246,206,110,0.18)',
          paddingTop: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Prompt character */}
          <span
            style={{
              color: CYAN,
              fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {'>'}
          </span>

          {/* Fake display of typed text + blinking cursor */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              minHeight: '1.4em',
            }}
          >
            <span
              style={{
                color: GOLD,
                fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
                fontFamily: 'var(--font-jetbrains), monospace',
                whiteSpace: 'pre',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {input}
            </span>
            <span
              style={{
                color: GOLD,
                fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
                animation: 'termCursorBlink 1s step-end infinite',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              █
            </span>

            {/* Hidden real input — positioned behind visual display */}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 'inherit',
                color: 'transparent',
                caretColor: 'transparent',
              }}
              autoFocus
              disabled={isLoading}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes termCursorBlink { 50% { opacity: 0; } }
        @keyframes termBlink { 40% { opacity: 0.2; } }
      `}</style>
    </div>
  )
}
