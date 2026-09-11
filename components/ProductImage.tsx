import Image from 'next/image';

export default function ProductImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  if (!src) {
    return (
      <svg width="38%" viewBox="0 0 100 130" fill="none" aria-hidden="true">
        <path d="M35 20h30l4 70a17 17 0 0 1-38 0Z" fill="#fff" stroke="#321923" strokeWidth="3" />
      </svg>
    );
  }
  return <Image src={src} alt={alt} fill sizes="(max-width: 560px) 80vw, (max-width: 920px) 40vw, 22vw" style={{ objectFit: 'cover' }} priority={priority} />;
}
