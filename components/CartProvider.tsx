'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { productId: string; slug: string; name: string; priceCents: number; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'dewe-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const totalCents = items.reduce((s, i) => s + i.qty * i.priceCents, 0);
    return {
      items,
      count,
      totalCents,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((p) => p.productId === item.productId);
          if (found) return prev.map((p) => (p.productId === item.productId ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        }),
      remove: (productId) => setItems((prev) => prev.filter((p) => p.productId !== productId)),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.productId !== productId) : prev.map((p) => (p.productId === productId ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
