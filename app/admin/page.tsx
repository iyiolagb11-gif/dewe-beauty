'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Shade = { id: string; name: string; hex: string };
type Product = {
  id: string; slug: string; name: string; description: string;
  priceCents: number; image: string; bestseller: boolean; shades: Shade[];
};

const emptyForm = { name: '', description: '', price: '', image: '', bestseller: true, shades: '' };

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'no-db' | 'error'>('loading');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.status === 503) { setStatus('no-db'); setError(data.error); return; }
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setProducts(data.products);
      setStatus('ready');
    } catch (e: any) {
      setStatus('error');
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function parseShades(s: string) {
    return s.split(/[,\s]+/).map((x) => x.trim()).filter((x) => /^#[0-9a-fA-F]{6}$/.test(x));
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, description: form.description,
          priceDollars: Number(form.price), image: form.image,
          bestseller: form.bestseller, shadeHexes: parseShades(form.shades),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Create failed');
      setForm(emptyForm);
      setShowAdd(false);
      await load();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  }

  async function quickPrice(id: string, dollars: string) {
    const v = Number(dollars);
    if (!v || v < 0.5) { setError('Price must be at least $0.50'); return; }
    setError('');
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceDollars: v }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Update failed'); return; }
    setProducts((ps) => ps.map((p) => (p.id === id ? data.product : p)));
  }

  async function toggleBestseller(p: Product) {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bestseller: !p.bestseller }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Update failed'); return; }
    setProducts((ps) => ps.map((x) => (x.id === p.id ? data.product : x)));
  }

  async function saveEdit(p: Product, patch: { name: string; description: string; image: string; shades: string }) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patch.name, description: patch.description, image: patch.image, shadeHexes: parseShades(patch.shades) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setProducts((ps) => ps.map((x) => (x.id === p.id ? data.product : x)));
      setEditing(null);
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  }

  async function removeProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Delete failed'); return; }
    setProducts((ps) => ps.filter((x) => x.id !== p.id));
  }

  return (
    <main className="page">
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Admin — Products</h1>
            <p className="muted">Update prices, edit details, add new items for sale.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ padding: '10px 20px' }} onClick={() => setShowAdd((s) => !s)}>
              {showAdd ? 'Close' : '+ New product'}
            </button>
            <button className="btn btn-outline" style={{ padding: '10px 20px' }} onClick={logout}>Log out</button>
          </div>
        </div>

        {error && <div className="notice" style={{ marginTop: 16 }}>{error}</div>}
        {status === 'no-db' && (
          <div className="card" style={{ marginTop: 16 }}>
            <h3>Database not connected</h3>
            <p className="muted">Product management needs Postgres. On Vercel: Storage → Create → Postgres, or set <code>DATABASE_URL</code> locally and run <code>npx prisma db push && npm run db:seed</code>.</p>
          </div>
        )}

        {showAdd && status !== 'no-db' && (
          <form className="card form-grid" style={{ marginTop: 20 }} onSubmit={createProduct}>
            <h3>New product</h3>
            <div className="field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Berry Cloud Gloss" /></div>
            <div className="field"><label>Description</label><input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What makes it special?" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field"><label>Price (USD)</label><input required type="number" step="0.01" min="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="16" /></div>
              <div className="field"><label>Bestseller?</label><select value={form.bestseller ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, bestseller: e.target.value === 'yes' })}><option value="yes">Yes</option><option value="no">No</option></select></div>
            </div>
            <div className="field"><label>Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.pexels.com/..." /></div>
            <div className="field"><label>Shade hexes (comma separated)</label><input value={form.shades} onChange={(e) => setForm({ ...form, shades: e.target.value })} placeholder="#C83F68, #F0AFC0" /></div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add product'}</button>
          </form>
        )}

        {status === 'loading' && <p className="muted" style={{ marginTop: 20 }}>Loading products...</p>}

        {status === 'ready' && (
          <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
            {products.map((p) => (
              <ProductRow key={p.id} product={p} editing={editing === p.id}
                onEdit={() => setEditing(p.id)} onCancel={() => setEditing(null)}
                onSave={(patch) => saveEdit(p, patch)} onQuickPrice={(v) => quickPrice(p.id, v)}
                onToggle={() => toggleBestseller(p)} onDelete={() => removeProduct(p)} saving={saving} />
            ))}
            {products.length === 0 && <p className="muted">No products yet — add your first one above.</p>}
          </div>
        )}
      </div>
    </main>
  );
}

function ProductRow({ product: p, editing, onEdit, onCancel, onSave, onQuickPrice, onToggle, onDelete, saving }: {
  product: Product; editing: boolean; onEdit: () => void; onCancel: () => void;
  onSave: (patch: { name: string; description: string; image: string; shades: string }) => void;
  onQuickPrice: (v: string) => void; onToggle: () => void; onDelete: () => void; saving: boolean;
}) {
  const [price, setPrice] = useState((p.priceCents / 100).toString());
  const [name, setName] = useState(p.name);
  const [desc, setDesc] = useState(p.description);
  const [image, setImage] = useState(p.image);
  const [shades, setShades] = useState(p.shades.map((s) => s.hex).join(', '));

  useEffect(() => {
    setPrice((p.priceCents / 100).toString());
    setName(p.name); setDesc(p.description); setImage(p.image);
    setShades(p.shades.map((s) => s.hex).join(', '));
  }, [p]);

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} width={56} height={56} style={{ borderRadius: 12, objectFit: 'cover' }} />
        ) : <span style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--blush)', display: 'inline-block' }} />}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800 }}>{p.name}</div>
          <div className="muted" style={{ fontSize: 13 }}>/product/{p.slug} · {p.bestseller ? '★ bestseller' : 'hidden from bestsellers'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>$</span>
          <input value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => { if (Number(price) * 100 !== p.priceCents) onQuickPrice(price); }}
            style={{ width: 80, height: 40, borderRadius: 10, border: '2px solid var(--plum)', padding: '0 10px', fontFamily: 'inherit', fontWeight: 700 }} aria-label={`Price for ${p.name}`} />
          <button className="quiz-opt" onClick={onToggle}>{p.bestseller ? '★' : '☆'}</button>
          <button className="quiz-opt" onClick={editing ? onCancel : onEdit}>{editing ? 'Cancel' : 'Edit'}</button>
          <button className="quiz-opt" onClick={onDelete}>Delete</button>
        </div>
      </div>
      {editing && (
        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label>Description</label><input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="field"><label>Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} /></div>
          <div className="field"><label>Shade hexes</label><input value={shades} onChange={(e) => setShades(e.target.value)} /></div>
          <button className="btn btn-primary" style={{ padding: '12px 22px' }} disabled={saving} onClick={() => onSave({ name, description: desc, image, shades })}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  );
}

