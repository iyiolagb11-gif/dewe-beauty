import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, formatPrice, shadeNameByHex } from '@/lib/data';
import AddToBagButton from '@/components/AddToBagButton';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProductBySlug(params.slug);
  if (!p) return notFound();
  return (
    <main className="page">
      <div className="wrap two-col">
        <div className="card">
          <div className="img" style={{ background: 'var(--blush)', borderRadius: 16, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30%" viewBox="0 0 100 130" fill="none">
              <path d="M35 20h30l4 70a17 17 0 0 1-38 0Z" fill="#fff" stroke="#321923" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div>
          <Link href="/shop">← Back to shop</Link>
          <h1 style={{ marginTop: 8 }}>{p.name}</h1>
          <p className="muted" style={{ marginTop: 8 }}>{p.description}</p>
          <p style={{ marginTop: 12, fontWeight: 800, fontSize: 20 }}>{formatPrice(p.priceCents)}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {p.shadeHexes.map((hex) => (
              <span key={hex} title={shadeNameByHex(hex)} style={{ width: 28, height: 28, borderRadius: '50%', background: hex, border: '2px solid #fff', boxShadow: '0 0 0 1.5px rgba(37,34,33,0.12)' }} />
            ))}
          </div>
          <AddToBagButton productId={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} />
          <div className="notice" style={{ marginTop: 20 }}>🌱 100% vegan & cruelty-free. Free shipping over $35. Mock checkout — no real charge.</div>
        </div>
      </div>
    </main>
  );
}
