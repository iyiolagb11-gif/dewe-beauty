import Link from 'next/link';

export default function ConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { email?: string };
}) {
  const emailStatus = searchParams?.email === 'sent' ? 'sent' : 'skipped';
  return (
    <main className="page">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 640 }}>
        <span className="badge" style={{ display: 'inline-flex', background: 'var(--blush)', padding: '8px 18px', borderRadius: 999, fontWeight: 700 }}>✨ Order confirmed (mock)</span>
        <h1 style={{ marginTop: 16 }}>Thank you! Your gloss is on its way.</h1>
        <p className="muted" style={{ marginTop: 12 }}>Order ID: <code>{params.id}</code></p>
        {emailStatus === 'sent' ? (
          <p className="muted" style={{ marginTop: 8 }}>📧 A confirmation email is on its way to your inbox.</p>
        ) : (
          <p className="muted" style={{ marginTop: 8 }}>
            📧 No confirmation email was sent — email is not configured yet (set <code>RESEND_API_KEY</code> or SMTP vars in <code>.env</code>, then restart the server).
            No real payment was taken. This order is stored in Postgres when DATABASE_URL is set, otherwise kept as a mock confirmation.
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn btn-primary">Keep shopping</Link>
          <Link href="/" className="btn btn-outline">Back home</Link>
        </div>
      </div>
    </main>
  );
}
