import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const ACCESS_TOKEN_COOKIE = "lms_access_token";
const REFRESH_TOKEN_COOKIE = "lms_refresh_token";
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  type: "access" | "refresh";
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

async function signToken(payload: Omit<JwtPayload, "type"> & { type: "access" | "refresh" }, expiresInSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(getSecret());
}

export async function createAuthTokens(user: { id: number; email: string; name: string }) {
  const accessToken = await signToken(
    { sub: String(user.id), email: user.email, name: user.name, type: "access" },
    ACCESS_TOKEN_TTL_SECONDS
  );
  const refreshToken = await signToken(
    { sub: String(user.id), email: user.email, name: user.name, type: "refresh" },
    REFRESH_TOKEN_TTL_SECONDS
  );

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    path: "/"
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
    path: "/"
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getCurrentUserFromAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<JwtPayload>(token, getSecret());
    if (payload.type !== "access") return null;
    return {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name
    };
  } catch {
    return null;
  }
}

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const { payload } = await jwtVerify<JwtPayload>(refreshToken, getSecret());
    if (payload.type !== "refresh") return null;

    const accessToken = await signToken(
      { sub: String(payload.sub), email: payload.email, name: payload.name, type: "access" },
      ACCESS_TOKEN_TTL_SECONDS
    );

    const secure = process.env.NODE_ENV === "production";
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: ACCESS_TOKEN_TTL_SECONDS,
      path: "/"
    });

    return {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name
    };
  } catch {
    return null;
  }
}

