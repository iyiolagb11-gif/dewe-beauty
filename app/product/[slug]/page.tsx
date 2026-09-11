import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatPrice, shadeNameByHex } from '@/lib/data';
import { getProductBySlugDb } from '@/lib/products';
import AddToBagButton from '@/components/AddToBagButton';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductBySlugDb(params.slug);
  if (!p) return notFound();
  return (
    <main className="page">
      <div className="wrap two-col">
        <div className="card">
          <div className="img" style={{ background: 'var(--blush)', borderRadius: 16, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {p.image ? (
              <Image src={p.image} alt={p.name} fill sizes="(max-width: 900px) 90vw, 40vw" style={{ objectFit: 'cover' }} priority />
            ) : (
              <svg width="30%" viewBox="0 0 100 130" fill="none">
                <path d="M35 20h30l4 70a17 17 0 0 1-38 0Z" fill="#fff" stroke="#321923" strokeWidth="3" />
              </svg>
            )}
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
          <AddToBagButton productId={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} image={p.image} />
          <div className="notice" style={{ marginTop: 20 }}>🌱 100% vegan & cruelty-free. Free shipping over $35. Mock checkout — no real charge.</div>
        </div>
      </div>
    </main>
  );
}
