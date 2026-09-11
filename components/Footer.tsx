import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer>
      <div className="footer-offer">
        <div className="wrap">
          <h2>Get 15% off your first gloss</h2>
          <p>Plus early access to new shade drops and restock alerts.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-links wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo" style={{ color: 'var(--cream)' }}>
              DEW<span className="dot" />
            </span>
            <p>Gloss that feels like you. Simple, vegan, made for everyday shine.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link href="/shop">Best sellers</Link>
            <Link href="/#shades">All shades</Link>
            <Link href="/quiz">Shade quiz</Link>
            <Link href="/shop">Gift sets</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/">About Dewé</Link>
            <Link href="/#community">Community</Link>
            <Link href="/">For creators</Link>
            <Link href="/">Wholesale</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link href="/cart">Track my order</Link>
            <Link href="/checkout">Shipping & returns</Link>
            <Link href="/">Contact us</Link>
            <Link href="/">Ingredients</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DEWÉ BEAUTY. All rights reserved.</span>
          <span>Gloss that feels like you.</span>
        </div>
      </div>
    </footer>
  );
}
