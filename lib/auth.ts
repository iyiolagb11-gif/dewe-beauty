import * as jose from 'jose';

export const ADMIN_COOKIE = 'dewe_admin_session';
const SESSION_HOURS = 12;

function secret(): Uint8Array {
  // Session signing secret. Falls back to ADMIN_PASSWORD so local dev works
  // with a single env var, but SESSION_SECRET should be set in production.
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dewe-dev-secret-change-me';
  return new TextEncoder().encode(s);
}

export function adminCredentialsConfigured() {
  return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function verifyCredentials(email: string, password: string) {
  if (!adminCredentialsConfigured()) return false;
  return (
    email.trim().toLowerCase() === process.env.ADMIN_EMAIL!.trim().toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function createSessionToken() {
  return await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  try {
    const { payload } = await jose.jwtVerify(token, secret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
