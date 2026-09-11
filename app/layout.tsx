import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DEWÉ BEAUTY — Gloss That Feels Like You',
  description: 'High-shine, comfortable lip gloss in shades made for every skin tone.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <div className="ticker">
            <div className="ticker-track">
              <span>✨ FREE SHIPPING ON ORDERS OVER $35</span>
              <span>💋 NEW SHADE DROP: &quot;MIDNIGHT PLUM&quot; IS HERE</span>
              <span>🌱 100% VEGAN &amp; CRUELTY-FREE</span>
              <span>✨ FREE SHIPPING ON ORDERS OVER $35</span>
              <span>💋 NEW SHADE DROP: &quot;MIDNIGHT PLUM&quot; IS HERE</span>
              <span>🌱 100% VEGAN &amp; CRUELTY-FREE</span>
            </div>
          </div>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
