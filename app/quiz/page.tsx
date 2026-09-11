'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, SHADES } from '@/lib/data';

const STEPS = [
  { key: 'tone', q: 'What is your skin tone?', opts: ['Fair', 'Medium', 'Deep'] },
  { key: 'finish', q: 'What finish do you love?', opts: ['Sheer', 'High-shine', 'Tinted'] },
  { key: 'vibe', q: 'Pick a vibe', opts: ['Everyday nude', 'Berry bold', 'Plum night'] },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = STEPS.every((s) => answers[s.key]);

  const recommendations = useMemo(() => {
    if (!done) return [];
    const vibe = answers.vibe;
    if (vibe === 'Berry bold') return [PRODUCTS[0], PRODUCTS[1], PRODUCTS[3]];
    if (vibe === 'Plum night') return [PRODUCTS[1], PRODUCTS[3], PRODUCTS[0]];
    return [PRODUCTS[2], PRODUCTS[0], PRODUCTS[3]];
  }, [answers, done]);

  return (
    <main className="page">
      <div className="wrap">
        <h1>Find your shade (60 seconds)</h1>
        <p className="muted">Answer 3 questions — we match you to 3 glosses.</p>
        <div style={{ display: 'grid', gap: 22, marginTop: 28 }}>
          {STEPS.map((s) => (
            <div className="card" key={s.key}>
              <h3>{s.q}</h3>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {s.opts.map((o) => (
                  <button key={o} className={`quiz-opt ${answers[s.key] === o ? 'active' : ''}`} onClick={() => setAnswers((a) => ({ ...a, [s.key]: o }))}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {done && (
          <div style={{ marginTop: 28 }}>
            <h2>Your matches</h2>
            <div className="cards-grid" style={{ marginTop: 16 }}>
              {recommendations.map((p) => (
                <div className="p-card" key={p.id}>
                  <div className="name">{p.name}</div>
                  <div className="desc">{p.description}</div>
                  <div className="dots">{p.shadeHexes.map((h) => <span key={h} style={{ background: h }} />)}</div>
                  <Link href={`/product/${p.slug}`} className="btn btn-outline" style={{ marginTop: 12, padding: '10px 18px' }}>View</Link>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 16 }}>Shade library: {SHADES.map((s) => s.name).join(' · ')}</p>
          </div>
        )}
      </div>
    </main>
  );
}
