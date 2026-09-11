import Link from 'next/link';
import { SHADES, formatPrice } from '@/lib/data';
import { getAllProducts } from '@/lib/products';
import AddToBagButton from '@/components/AddToBagButton';
import ProductImage from '@/components/ProductImage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products } = await getAllProducts();
  return (
    <main>
      <section className="hero">
        <div className="swatch s1"><span>Berry Rose</span></div>
        <div className="swatch s2"><span>Plum Fizz</span></div>
        <div className="swatch s3"><span>Blush</span></div>
        <div className="swatch s4"><span>Cocoa</span></div>
        <div className="swatch s5"><span>Rosy</span></div>
        <div className="hero-inner">
          <span className="badge">✨ Gloss, not guesswork</span>
          <h1>Gloss that feels like you.</h1>
          <p className="hero-sub">High-shine, comfortable lip gloss in shades made for every skin tone. Simple, wearable, made for every day.</p>
          <div className="hero-ctas">
            <Link href="/shop" className="btn btn-primary">Shop best sellers</Link>
            <Link href="/quiz" className="btn btn-outline">Find your shade</Link>
          </div>
        </div>
      </section>

      <section className="shade-strip" id="shades">
        <div className="wrap">
          <div className="head">
            <h2>Every shade, one scroll away</h2>
            <Link href="/shop">See all shades →</Link>
          </div>
          <div className="shade-row">
            {SHADES.map((s) => (
              <div className="shade-item" key={s.id}>
                <div className="swatch-sm" style={{ background: s.hex }} />
                <div className="name">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop">
        <div className="wrap">
          <div className="section-head">
            <h2>Best sellers</h2>
            <p>The four glosses people keep coming back for, in the shades that sell out first.</p>
          </div>
          <div className="cards-grid">
            {products.map((p) => (
              <div className="p-card" key={p.id}>
                <Link href={`/product/${p.slug}`}>
                  <div className="img">
                    <ProductImage src={p.image} alt={p.name} />
                  </div>
                  <div className="name">{p.name}</div>
                </Link>
                <div className="desc">{p.description}</div>
                <div className="dots">
                  {p.shadeHexes.map((hex) => (
                    <span key={hex} style={{ background: hex }} />
                  ))}
                </div>
                <div className="price">{formatPrice(p.priceCents)}</div>
                <AddToBagButton productId={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} image={p.image} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="poster">
        <div className="poster-blob pb1" />
        <div className="poster-blob pb2" />
        <div className="wrap">
          <h2>SHINE ON<span className="accent">YOUR OWN TERMS</span></h2>
          <p>Beauty doesn&apos;t have to be dramatic. Sometimes all it takes is a little shine.</p>
        </div>
      </section>

      <section id="finder">
        <div className="wrap">
          <div className="finder">
            <div className="finder-inner">
              <div>
                <h2>Not sure which shade is you?</h2>
                <p>Take our 60-second shade quiz and we&apos;ll match you to three glosses picked for your skin tone and vibe.</p>
                <Link href="/quiz" className="btn btn-primary">Take the shade quiz</Link>
              </div>
              <div className="finder-visual">
                <div className="fv" />
                <div className="fv" />
                <div className="fv" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community">
        <div className="wrap">
          <div className="section-head">
            <h2>As worn by you</h2>
            <p>Tag @dewebeauty to be featured. Real people, real gloss, no filter needed.</p>
          </div>
          <div className="ugc-grid">
            {['mira.wears', 'theresajoy', 'bysoleil', 'nadiaglows', 'kaylareads'].map((cap, i) => (
              <div className="polaroid" key={cap}>
                <div className="img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/dewe-ugc-${i + 1}/300/300`} alt="Customer wearing Dewé gloss" loading="lazy" />
                </div>
                <div className="cap">@{cap}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
