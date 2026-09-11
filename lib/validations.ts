import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(99),
});

export const orderSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(4, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(3, 'ZIP is required'),
  items: z.array(orderItemSchema).min(1, 'Cart is empty'),
});
