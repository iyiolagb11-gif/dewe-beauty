'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/data';

export default function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '', zip: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your bag is empty.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map((i) => ({ productId: i.productId, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      clear();
      const emailFlag = data.email?.sent ? 'sent' : 'skipped';
      router.push(`/order-confirmation/${data.order.id}?email=${emailFlag}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const shipping = totalCents >= 3500 || totalCents === 0 ? 0 : 495;

  return (
    <main className="page">
      <div className="wrap two-col">
        <form className="card form-grid" onSubmit={submit}>
          <h2>Checkout (mock)</h2>
          {(['email', 'name', 'address', 'city', 'zip'] as const).map((k) => (
            <div className="field" key={k}>
              <label>{k[0].toUpperCase() + k.slice(1)}</label>
              <input required value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={k === 'email' ? 'you@email.com' : ''} />
            </div>
          ))}
          {error && <div className="notice">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Placing order...' : `Place mock order — ${formatPrice(totalCents + shipping)}`}</button>
        </form>
        <div className="card">
          <h3>Order summary</h3>
          {items.map((i) => (
            <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
              <span>{i.name} × {i.qty}</span>
              <span>{formatPrice(i.priceCents * i.qty)}</span>
            </div>
          ))}
          <p style={{ marginTop: 12 }}>Subtotal: {formatPrice(totalCents)}</p>
          <p>Shipping: {shipping === 0 ? 'FREE' : formatPrice(shipping)}</p>
          <p><strong>Total: {formatPrice(totalCents + shipping)}</strong></p>
        </div>
      </div>
    </main>
  );
}
