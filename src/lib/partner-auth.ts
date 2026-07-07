// Partner portal authentication helpers.
//
// Shared-passcode gate for affiliated Buyer's Realtors. Not a real user
// system: one common passcode + a self-reported name that we stamp on
// every submission for attribution. All the actual verification happens
// server-side; the browser only ever sees an opaque signed token.

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const COOKIE_NAME = 'eg_partner';
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

// The signing secret. Prefer an operator-provided value; fall back to a
// per-boot random key so we never sign anything with a predictable
// string. A rotated secret invalidates existing sessions, which is fine.
function getSecret(): string {
  const env: any = { ...process.env, ...(import.meta.env as any) };
  const provided = env.PARTNER_SESSION_SECRET || env.SESSION_SECRET;
  if (provided && String(provided).length >= 16) return String(provided);
  // Cache a per-process fallback so tokens survive within one server instance.
  const g = globalThis as any;
  if (!g.__egPartnerFallbackSecret) {
    g.__egPartnerFallbackSecret = randomBytes(32).toString('hex');
  }
  return g.__egPartnerFallbackSecret as string;
}

export function getConfiguredPasscode(): string | null {
  const env: any = { ...process.env, ...(import.meta.env as any) };
  const raw =
    env.PARTNER_PASSCODE ||
    env.PARTNERS_PASSCODE ||
    env.PARTNER_PASSWORD ||
    env.PARTNERS_PASSWORD;
  return raw ? String(raw) : null;
}

// Constant-time string comparison so a slow-typing attacker can't
// measure how far into the passcode they got.
export function passcodesMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Token layout: base64url(name) + "." + issuedAtSeconds + "." + hmac
// Everything before the last dot is signed; the hmac is the last segment.
function b64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sign(payload: string): string {
  return b64url(createHmac('sha256', getSecret()).update(payload).digest());
}

export function issueToken(displayName: string, now = Math.floor(Date.now() / 1000)): string {
  const cleanName = displayName.trim().slice(0, 80);
  const payload = `${b64url(cleanName)}.${now}`;
  return `${payload}.${sign(payload)}`;
}

export interface PartnerSession {
  name: string;
  issuedAt: number;
  expiresAt: number;
}

export function verifyToken(token: string | undefined | null): PartnerSession | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [nameB64, issuedRaw, sig] = parts;
  const payload = `${nameB64}.${issuedRaw}`;
  const expectedSig = sign(payload);
  // Constant-time signature check.
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return null;
  const expiresAt = issuedAt + SESSION_TTL_SECONDS;
  if (Math.floor(Date.now() / 1000) >= expiresAt) return null;

  const name = b64urlDecode(nameB64).toString('utf8');
  if (!name) return null;
  return { name, issuedAt, expiresAt };
}

// Reads a specific cookie value from a raw Cookie header, without
// pulling in a cookie parser dependency.
export function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx) === name) {
      return decodeURIComponent(part.slice(idx + 1));
    }
  }
  return null;
}

export function buildSessionCookie(token: string, secure = true): string {
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (secure) attrs.push('Secure');
  return attrs.join('; ');
}

export function buildClearCookie(secure = true): string {
  const attrs = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) attrs.push('Secure');
  return attrs.join('; ');
}

export function getPartnerSessionFromRequest(request: Request): PartnerSession | null {
  const token = readCookie(request.headers.get('cookie'), COOKIE_NAME);
  return verifyToken(token);
}

// Is the incoming request being served over HTTPS? In production behind a
// proxy this comes in via X-Forwarded-Proto; locally we skip Secure so
// the browser will actually set the cookie on http://127.0.0.1.
export function isSecureRequest(request: Request): boolean {
  const proto = request.headers.get('x-forwarded-proto');
  if (proto) return proto.split(',')[0].trim() === 'https';
  return new URL(request.url).protocol === 'https:';
}
