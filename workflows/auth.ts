"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createAuthTokens, refreshAccessToken } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(input: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" as const };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Email is already in use" as const };
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hash
    }
  });

  await createAuthTokens(user);

  return { ok: true as const };
}

export async function login(input: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid credentials" as const };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, error: "Invalid email or password" as const };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { ok: false, error: "Invalid email or password" as const };
  }

  await createAuthTokens(user);

  return { ok: true as const };
}

export async function refresh() {
  const user = await refreshAccessToken();
  if (!user) {
    return { ok: false as const };
  }
  return { ok: true as const };
}

