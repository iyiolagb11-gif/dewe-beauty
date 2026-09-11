'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SHADES, type StaticProduct } from '@/lib/data';
import ProductImage from '@/components/ProductImage';

const STEPS = [
  { key: 'tone', q: 'What is your skin tone?', opts: ['Fair', 'Medium', 'Deep'] },
  { key: 'finish', q: 'What finish do you love?', opts: ['Sheer', 'High-shine', 'Tinted'] },
  { key: 'vibe', q: 'Pick a vibe', opts: ['Everyday nude', 'Berry bold', 'Plum night'] },
];

function pickThree(products: StaticProduct[], vibe: string) {
  if (products.length === 0) return [];
  const at = (i: number) => products[i % products.length];
  if (vibe === 'Berry bold') return [at(0), at(1), at(3)];
  if (vibe === 'Plum night') return [at(1), at(3), at(0)];
  return [at(2), at(0), at(3)];
}

export default function QuizClient({ products }: { products: StaticProduct[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = STEPS.every((s) => answers[s.key]);

  const recommendations = useMemo(() => {
    if (!done) return [];
    return pickThree(products, answers.vibe);
  }, [answers, done, products]);

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
                  <Link href={`/product/${p.slug}`}>
                    <div className="img">
                      <ProductImage src={p.image} alt={p.name} />
                    </div>
                    <div className="name">{p.name}</div>
                  </Link>
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
