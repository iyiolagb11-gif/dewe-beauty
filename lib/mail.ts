import { PRODUCTS, formatPrice } from './data';

export type EmailResult = { sent: boolean; provider?: string; reason?: string };

type OrderEmailInput = {
  to: string;
  name: string;
  orderId: string;
  totalCents: number;
  items: { productId: string; qty: number }[];
};

function itemLine(productId: string, qty: number) {
  const p = PRODUCTS.find((x) => x.id === productId);
  const name = p?.name ?? productId;
  const price = p ? p.priceCents * qty : 0;
  return `• ${name} × ${qty} — ${formatPrice(price)}`;
}

export function buildOrderEmailText(input: OrderEmailInput) {
  const lines = input.items.map((i) => itemLine(i.productId, i.qty)).join('\n');
  return `Hi ${input.name},

Thank you for your DEWÉ Beauty order ${input.orderId}!

${lines}

Total: ${formatPrice(input.totalCents)}

No real payment was taken (mock checkout).
Gloss that feels like you — DEWÉ BEAUTY`;
}

export async function sendOrderConfirmation(input: OrderEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL || 'DEWE Beauty <orders@dewebeauty.example>';
  const adminBcc = process.env.ADMIN_EMAIL;

  const subject = `Your DEWÉ order ${input.orderId} is confirmed`;
  const text = buildOrderEmailText(input);

  if (!apiKey) {
    console.log(`[mail:mock] to=${input.to} subject="${subject}"\n${text}`);
    return { sent: false, reason: 'no-provider: set RESEND_API_KEY + ORDER_FROM_EMAIL to send real mail' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [input.to],
        ...(adminBcc ? { bcc: [adminBcc] } : {}),
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => 'resend error');
      console.warn('[mail:resend-failed]', res.status, err);
      return { sent: false, provider: 'resend', reason: `resend ${res.status}: ${err.slice(0, 200)}` };
    }
    return { sent: true, provider: 'resend' };
  } catch (e: any) {
    console.warn('[mail:resend-exception]', e?.message);
    return { sent: false, provider: 'resend', reason: e?.message || 'send failed' };
  }
}
