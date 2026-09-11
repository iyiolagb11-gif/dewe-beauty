import Link from 'next/link';
import { SHADES, formatPrice } from '@/lib/data';
import { getAllProducts } from '@/lib/products';
import AddToBagButton from '@/components/AddToBagButton';
import ProductImage from '@/components/ProductImage';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const { products } = await getAllProducts();
  return (
    <main className="page">
      <div className="wrap">
        <h1>Shop all gloss</h1>
        <p className="muted" style={{ marginTop: 8 }}>Four bestsellers. Nine shades. Mock checkout — no real payment.</p>
        <div className="cards-grid" style={{ marginTop: 32 }}>
          {products.map((p) => (
            <div className="p-card" key={p.id}>
              <Link href={`/product/${p.slug}`}>
                <div className="img">
                  <ProductImage src={p.image} alt={p.name} />
                </div>
                <div className="name">{p.name}</div>
              </Link>
              <div className="desc">{p.description}</div>
              <div className="dots">{p.shadeHexes.map((hex) => <span key={hex} style={{ background: hex }} />)}</div>
              <div className="price">{formatPrice(p.priceCents)}</div>
              <AddToBagButton productId={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} image={p.image} />
            </div>
          ))}
        </div>
        <h2 style={{ marginTop: 56 }}>All shades</h2>
        <div className="shade-row" style={{ marginTop: 16 }}>
          {SHADES.map((s) => (
            <div className="shade-item" key={s.id}>
              <div className="swatch-sm" style={{ background: s.hex }} />
              <div className="name">{s.name} · {s.hex}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
