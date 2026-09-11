'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/data';

export default function CartPage() {
  const { items, totalCents, setQty, remove, clear } = useCart();
  if (items.length === 0)
    return (
      <main className="page">
        <div className="wrap">
          <h1>Your bag is empty</h1>
          <p className="muted" style={{ marginTop: 8 }}>Add a gloss to get started.</p>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>Shop best sellers</Link>
        </div>
      </main>
    );
  return (
    <main className="page">
      <div className="wrap two-col">
        <div className="card">
          <h2>Your bag ({items.length})</h2>
          <div style={{ marginTop: 12 }}>
            {items.map((i) => (
              <div className="cart-row" key={i.productId}>
                <div>
                  <div style={{ fontWeight: 700 }}>{i.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{formatPrice(i.priceCents)} each</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="qty-btn" onClick={() => setQty(i.productId, i.qty - 1)}>-</button>
                  <span>{i.qty}</span>
                  <button className="qty-btn" onClick={() => setQty(i.productId, i.qty + 1)}>+</button>
                  <button onClick={() => remove(i.productId)} style={{ marginLeft: 8, textDecoration: 'underline' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={clear} style={{ marginTop: 16, textDecoration: 'underline' }}>Clear bag</button>
        </div>
        <div className="card">
          <h3>Summary</h3>
          <p style={{ marginTop: 8 }}>Subtotal: <strong>{formatPrice(totalCents)}</strong></p>
          <p className="muted" style={{ fontSize: 13 }}>Shipping: {totalCents >= 3500 ? 'FREE' : '$4.95 (free over $35)'}</p>
          <p className="muted" style={{ fontSize: 13 }}>Mock checkout — no real payment.</p>
          <Link href="/checkout" className="btn btn-primary" style={{ marginTop: 16 }}>Go to checkout</Link>
        </div>
      </div>
    </main>
  );
}
