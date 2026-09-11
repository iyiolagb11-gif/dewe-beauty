'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setMsg(data.message || 'You are in! Check your inbox for 15% off.');
      setEmail('');
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="offer-form" onSubmit={submit}>
        <input type="email" required placeholder="you@email.com" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Joining...' : 'Get my code'}
        </button>
      </form>
      {msg && <p style={{ marginTop: 14, fontSize: 14, color: '#FFF8F1' }}>{msg}</p>}
    </div>
  );
}
