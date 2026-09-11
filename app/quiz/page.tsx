import QuizClient from '@/components/QuizClient';
import { getAllProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const { products } = await getAllProducts();
  return <QuizClient products={products} />;
}
