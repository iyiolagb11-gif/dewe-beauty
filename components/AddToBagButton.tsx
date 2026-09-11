'use client';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/data';

export default function AddToBagButton({
  productId,
  slug,
  name,
  priceCents,
  image,
}: {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
}) {
  const { add } = useCart();
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
      <button className="btn btn-primary" style={{ padding: '12px 22px' }} onClick={() => add({ productId, slug, name, priceCents, image }, 1)}>
        Add to bag — {formatPrice(priceCents)}
      </button>
    </div>
  );
}
