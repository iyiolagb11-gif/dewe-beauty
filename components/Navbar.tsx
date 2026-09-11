'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Navbar() {
  const { count } = useCart();
  return (
    <header>
      <nav className="wrap">
        <Link href="/" className="logo">
          DEW<span className="dot" />
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/#shades">Shades</Link>
          <Link href="/quiz">Find your shade</Link>
          <Link href="/#community">Community</Link>
        </div>
        <div className="nav-icons">
          <Link href="/shop" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <Link href="/cart" className="cart-badge" aria-label="Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="count">{count}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
