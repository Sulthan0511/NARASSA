import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { getDB } from "./db";
import type { User } from "./types";

const SECRET = process.env.SESSION_SECRET || "narassa-dev-secret-change-in-production";
const COOKIE = "narassa_session";
const MAX_AGE = 60 * 60 * 24 * 7;

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function encodeSession(uid: string): string {
  const payload = Buffer.from(JSON.stringify({ uid, exp: Date.now() + MAX_AGE * 1000 })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return String(data.uid);
  } catch {
    return null;
  }
}

export async function setSessionCookie(uid: string) {
  const store = await cookies();
  store.set(COOKIE, encodeSession(uid), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const uid = decodeSession(token);
  if (!uid) return null;
  const db = await getDB();
  return db.users.find((u) => u.id === uid) ?? null;
}

export async function requireUser(): Promise<User | null> {
  return getSessionUser();
}

export async function requireAdmin(): Promise<User | null> {
  const u = await getSessionUser();
  return u && u.role === "admin" ? u : null;
}
