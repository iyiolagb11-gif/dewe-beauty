# DEWÉ Beauty — Fullstack (Next.js + Prisma + Postgres)

Migrated from `dewe-homepage.html` (preserved in repo for reference) to a Vercel-ready fullstack app.

## Features
- Homepage (original design 1:1), Shop, Product detail, Shade Quiz, Cart, Mock Checkout, Order confirmation
- APIs: `GET /api/products`, `GET /api/shades`, `POST /api/newsletter`, `POST/GET /api/orders`
- Cart persisted in localStorage. Mock checkout — no real payment.
- Postgres via Prisma when `DATABASE_URL` is set, otherwise static fallback so the site works without a DB.

## Local dev
```bash
npm install
npm run dev
# optional DB:
# copy .env.example to .env, set DATABASE_URL
npx prisma db push
npm run db:seed
```

## Deploy to Vercel
1. Push to GitHub: `git init; git add -A; git commit -m "dewe fullstack"; gh repo create ...; git push`
2. Import repo in Vercel Dashboard, or `npx vercel`
3. Storage → Create → Postgres (Neon), connect to project — this sets `DATABASE_URL`, `POSTGRES_URL`, etc.
4. Deploy. Then in Vercel Shell or locally with production env: `npx prisma db push && npm run db:seed`
