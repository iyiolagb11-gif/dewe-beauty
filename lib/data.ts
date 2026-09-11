export type StaticShade = { id: string; name: string; hex: string };
export type StaticProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  bestseller: boolean;
  shadeHexes: string[];
};

export const SHADES: StaticShade[] = [
  { id: 'sh-rosy', name: 'Rosy', hex: '#E8879E' },
  { id: 'sh-berry-rose', name: 'Berry Rose', hex: '#C83F68' },
  { id: 'sh-plum-fizz', name: 'Plum Fizz', hex: '#7A2E42' },
  { id: 'sh-blush', name: 'Blush', hex: '#F0AFC0' },
  { id: 'sh-cocoa', name: 'Cocoa', hex: '#B2665A' },
  { id: 'sh-sundown', name: 'Sundown', hex: '#D96A82' },
  { id: 'sh-sheer-nude', name: 'Sheer Nude', hex: '#E3A6A0' },
  { id: 'sh-wine-time', name: 'Wine Time', hex: '#9C4B5C' },
  { id: 'sh-cotton', name: 'Cotton', hex: '#F4C2CE' },
];

export const PRODUCTS: StaticProduct[] = [
  {
    id: 'prod-glass-gloss',
    slug: 'glass-gloss',
    name: 'Glass Gloss',
    description: 'Non-sticky, high-shine finish. The everyday gloss that feels like you.',
    priceCents: 1600,
    image: 'https://images.pexels.com/photos/36517583/pexels-photo-36517583.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestseller: true,
    shadeHexes: ['#E8879E', '#C83F68', '#F0AFC0'],
  },
  {
    id: 'prod-plump-tint',
    slug: 'plump-tint',
    name: 'Plump Tint',
    description: 'Tinted gloss with a light plump. Comfortable color with a little extra shine.',
    priceCents: 1800,
    image: 'https://images.pexels.com/photos/15854300/pexels-photo-15854300.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestseller: true,
    shadeHexes: ['#7A2E42', '#B2665A', '#D96A82'],
  },
  {
    id: 'prod-sheer-balm',
    slug: 'sheer-balm-gloss',
    name: 'Sheer Balm Gloss',
    description: 'Barely-there color, all-day comfort. Balm care meets gloss shine.',
    priceCents: 1400,
    image: 'https://images.pexels.com/photos/27462658/pexels-photo-27462658.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestseller: true,
    shadeHexes: ['#F4C2CE', '#E3A6A0'],
  },
  {
    id: 'prod-mirror-oil',
    slug: 'mirror-shine-oil',
    name: 'Mirror Shine Oil',
    description: 'Sheer glass finish, zero tack. Weightless oil for mirror shine.',
    priceCents: 1500,
    image: 'https://images.pexels.com/photos/30408333/pexels-photo-30408333.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestseller: true,
    shadeHexes: ['#9C4B5C', '#C83F68'],
  },
];

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function shadeNameByHex(hex: string) {
  return SHADES.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;
}
