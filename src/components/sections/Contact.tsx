'use client';
import { useState } from 'react';
import { useAXIOMStore } from '@/lib/store/useAXIOMStore';

export function Contact() {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const setTransmissionSuccess = useAXIOMStore(s => s.setTransmissionSuccess);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !message) return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setFormStatus('ERROR');
      return;
    }

    setFormStatus('SUBMITTING');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('access_key', accessKey);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.status === 200) {
        setFormStatus('SUCCESS');
        setTransmissionSuccess(true);
        setName(''); setEmail(''); setMessage('');
      } else {
        setFormStatus('ERROR');
      }
    } catch {
      setFormStatus('ERROR');
    }
  };

  return (
    <div style={{ padding: '2rem 2rem 3rem' }}>

      <h2 style={{
        fontFamily: 'var(--font-orbitron)',
        color: '#F6CE6E',
        fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
        marginBottom: '2rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        &gt; INITIATE_COMMS
      </h2>

      <div style={{
        background: '#00141e',
        border: '1px solid rgba(246,206,110,0.25)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {[{ id: 'name', label: 'Operator Name', type: 'text', value: name, set: setName },
          { id: 'email', label: 'Return Frequency (Email)', type: 'email', value: email, set: setEmail }].map(({ id, label, type, value, set }) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={id} style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.58rem', color: '#00F2FF', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</label>
            <input
              required
              type={type}
              id={id}
              value={value}
              onChange={(e) => set(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid #374151',
                color: '#fff',
                padding: '0.6rem 0.85rem',
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor="message" style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.58rem', color: '#00F2FF', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Encrypted Transmission</label>
          <textarea
            required
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid #374151',
              color: '#fff',
              padding: '0.6rem 0.85rem',
              fontFamily: 'var(--font-rajdhani)',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={formStatus === 'SUBMITTING' || formStatus === 'SUCCESS'}
          style={{
            background: formStatus === 'SUCCESS' ? 'rgba(34,197,94,0.15)' : 'transparent',
            border: `1px solid ${formStatus === 'SUCCESS' ? '#22c55e' : '#F6CE6E'}`,
            color: formStatus === 'SUCCESS' ? '#22c55e' : '#F6CE6E',
            fontFamily: 'var(--font-orbitron)',
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '0.85rem',
            cursor: formStatus === 'SUBMITTING' || formStatus === 'SUCCESS' ? 'not-allowed' : 'pointer',
            opacity: formStatus === 'SUBMITTING' ? 0.5 : 1,
            marginTop: '0.25rem',
          }}
        >
          {formStatus === 'IDLE' && 'Transmit Message'}
          {formStatus === 'SUBMITTING' && 'Encrypting...'}
          {formStatus === 'SUCCESS' && '✓ Transmission Secure'}
          {formStatus === 'ERROR' && 'Transmission Failed — Retry'}
        </button>
      </div>
    </div>
  );
}
